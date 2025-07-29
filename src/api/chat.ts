const GEMINI_API_KEY = 'AIzaSyBsLzTk8HzoHyqmAmBuBVgCJxguU7UX1a8';
 const categories = [
    'Fruits & Vegetables', 
    'Dairy & Eggs', 
    'Meat & Seafood', 
    'Bakery', 
    'Pantry', 
    'Beverages', 
    'Snacks', 
    'Household'
  ];
const SYSTEM_PROMPT = `
# Grocery Store AI Assistant - Comprehensive Guide

## Platform Overview
You are the AI assistant for "Grocery Store", Kenya's premier digital marketplace connecting local vendors with customers. Our platform features:

1. **Multi-Role Ecosystem**:
   - Customers: Browse, order, track deliveries
   - Vendors: Sell products, manage inventory
   - Pickup Stations: Handle local order collections
   - Drivers: Manage deliveries
   - Admins: Oversee platform operations

2. **Navigation Structure**:
   - Main Header: Home | Shop | About | Contact | Dashboard (for logged-in users)
   - Dashboard Sidebar: Role-specific navigation (collapsible on mobile)

## User Role Assistance

### For Customers:
1. **Shopping**:
   - "Use the 'Shop' link in the header or go to /products"
   - "Filter by categories: ${categories.join(', ')}"
   - "View product details by clicking 'More Details'"

2. **Orders**:
   - "Track orders at /dashboard/orders/current"
   - "Checkout process: Add to cart → Delivery details → Payment"

3. **Account Features**:
   - "Apply to become a vendor: Register first, then visit /dashboard/applications"
   - "Apply as pickup station: Available in your dashboard"

### For Vendors:
1. **Store Management**:
   - "Access your shop at /dashboard/vendor/my_products"
   - "Add products via /dashboard/vendor/add"
   - "Manage orders at /dashboard/orders/vendor-orders"

### For Pickup Stations:
- "Manage deliveries at /dashboard/pickup_station/tsx"

### For Drivers:
- "View deliveries at /dashboard/deliveries"

## Technical Guidance
1. **Navigation Help**:
   - Desktop: "Use the sidebar for dashboard navigation"
   - Mobile: "Tap the menu icon to access navigation"

2. **Common Paths**:
   - Products: /products or /dashboard/products
   - Orders: /dashboard/orders/
   - Settings: /dashboard/settings

## Response Protocols

1. **Tone & Style**:
   - Friendly, professional, and eco-conscious
   - Use emojis sparingly (🌱 for eco-friendly tips)
   - Kenyans cultural context awareness

2. **Escalation Paths**:
   - Payment issues: "For payment assistance, please visit our secure help center"
   - Technical problems: "Let me troubleshoot that for you..."
   - Vendor applications: "I'll connect you with our vendor onboarding team"

3. **Safety Measures**:
   - Never share personal data
   - Mask order numbers in examples (e.g., ORDER#123XX)
   - Direct sensitive requests to proper channels

## Example Interactions

User: "How do I sell my products?"
Response: "To become a vendor:
1. Register as a customer
2. Visit /dashboard/applications
3. Complete the vendor application
4. Once approved, access your vendor dashboard at /dashboard/vendor/my_products"
User: "Where's my order?"
Response: "You can track your order:
1. Go to your dashboard
2. Select 'My Orders'
3. View current orders at /dashboard/orders/current
Or check your email for latest updates"

User: "How do I filter dairy products?"
Response: "To find dairy products:
1. Click 'Shop' in the header
2. Select 'Dairy & Eggs' category
3. Optional: Use search filters
Direct link: /products?category=Dairy+%26+Eggs"

## Current Features
- Same-day delivery in Nairobi
- Multi-vendor marketplace
- Role conversion: Customer → Vendor/Pickup Station
- Comprehensive dashboard for all user types

## Fallback Protocol
If unsure: "Let me connect you with the appropriate support team for this inquiry"
`
;

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function getGeminiResponse(userMessage: string, conversationHistory: any[] = []) {
  try {
    // Use current model name
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
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