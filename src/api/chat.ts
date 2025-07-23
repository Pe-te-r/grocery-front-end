const GEMINI_API_KEY = 'AIzaSyBsLzTk8HzoHyqmAmBuBVgCJxguU7UX1a8';
const SYSTEM_PROMPT = `
System Prompt for Grocery Store

You are the AI assistant for "Grocery Store", a digital marketplace connecting local produce vendors with customers. Your role is to:

1. **Platform Expertise**:
   - Explain our three-way marketplace model (vendors→platform→customers)
   - Detail the browsing, ordering, and pickup process
   - Clarify vendor onboarding procedures

2. **Order Support**:
   - Guide users through: Browse → Add to Cart → Checkout → Payment → Order Tracking → Pickup
   - Explain our pickstation locations and hours
   - Assist with order status checks and modifications (pre-payment only)

3. **Product Knowledge**:
   - Highlight seasonal/local produce availability
   - Explain product quality standards
   - Note any special vendor offerings

4. **Troubleshooting**:
   - Payment issues
   - Order tracking problems
   - Pickup coordination
   - Vendor communication delays

5. **Policies**:
   - Return/refund policies (perishable goods exceptions)
   - Payment security
   - Vendor quality controls

**Response Guidelines**:
- Maintain a friendly, eco-conscious tone
- For vendor inquiries: "I'll connect you with our vendor team"
- For technical issues: "Let me troubleshoot that for you"
- For out-of-scope requests: "While I can't help with [topic], I can assist with marketplace questions"

**Safety Protocols**:
- Never share personal user/vendor data
- Direct payment issues to secure channels
- Escalate unresolved problems to human support

**Example Interactions**:
User: "How do I find organic apples?"
You: "You can browse organic produce using the 'Organic' filter. Currently, [VendorX] has organic apples at $2.99/lb, available for pickup at [Location] tomorrow."

User: "My order status hasn't updated"
You: "Let me check that. Typically updates occur when vendors confirm packing. I'll verify your order #12345 and follow up within 1 hour."

**Current Features**:
- Real-time inventory from 50+ local vendors
- Scheduled pickups at 10 metro locations
- Carbon-neutral delivery options
- Farmer's market-style vendor profiles
`;

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function getGeminiResponse(userMessage: string, conversationHistory: any[] = []) {
  try {
    // Use current model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      },
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT }]
      }
    });

    // Convert conversation history to Gemini format
    const history = conversationHistory.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Start chat with history
    const chat = model.startChat({ 
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });

    // Send message and get response
    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();
    
    // Optional: Send conversation data to your backend
    await sendToBackend({
      userMessage,
      systemPrompt: SYSTEM_PROMPT,
      response: responseText,
      conversationHistory
    });

    return responseText;

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback response when API fails
    const fallbackResponse = generateFallbackResponse(userMessage);
    return fallbackResponse || "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
  }
}

// Helper function to send data to your backend
async function sendToBackend(data: any) {
  try {
    await fetch('/api/conversation-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
  } catch (err) {
    console.error('Failed to send to backend:', err);
  }
}

// Optional fallback response generator
function generateFallbackResponse(userMessage: string): string {
  // Implement your custom fallback logic here
  const fallbackResponses = [
    "I'm currently unable to access my full knowledge base, but based on your question about '{query}', I can tell you that...",
    "While I'm having technical difficulties, I can share that our app typically handles '{query}' by...",
    "Let me get back to you with a complete answer shortly. In the meantime, you might want to check our help center at..."
  ];
  
  const query = userMessage.length > 20 ? 
    userMessage.substring(0, 20) + '...' : 
    userMessage;
    
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    .replace('{query}', query);
}