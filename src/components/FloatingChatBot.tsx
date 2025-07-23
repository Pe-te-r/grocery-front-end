import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Maximize2, Minimize2, MessageSquareText, ArrowLeft, ArrowRight } from 'lucide-react';
import {   getGeminiResponse } from '@/api/chat';
import ReactMarkdown from 'react-markdown';


type Position = {
  x: number;
  y: number;
  isDragging: boolean;
};

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  side: 'left' | 'right';
};

const ChatbotSystem = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSize, setChatSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [userMessageSide, setUserMessageSide] = useState<'left' | 'right'>('right');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  
  // Positions for draggable elements
  const [iconPosition, setIconPosition] = useState<Position>({
    x: typeof window !== 'undefined' ? window.innerWidth - 70 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight - 70 : 0,
    isDragging: true
  });
  
  const [chatPosition, setChatPosition] = useState<Position>({
    x: typeof window !== 'undefined' ? window.innerWidth - 450 : 0,
    y: 20,
    isDragging: true
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Update icon position to stay within bounds
      setIconPosition(prev => {
        const maxX = window.innerWidth - (iconRef.current?.offsetWidth || 50);
        const maxY = window.innerHeight - (iconRef.current?.offsetHeight || 50);
        return {
          ...prev,
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY)
        };
      });
      
      // Update chat position to stay within bounds
      setChatPosition(prev => {
        const chatWidth = chatRef.current?.offsetWidth || 300;
        const chatHeight = chatRef.current?.offsetHeight || 400;
        const maxX = window.innerWidth - chatWidth;
        const maxY = window.innerHeight - chatHeight;
        return {
          ...prev,
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY)
        };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced dragging logic for icon
  const handleIconMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIconPosition(prev => ({ ...prev, isDragging: true }));
    
    const startX = e.clientX - iconPosition.x;
    const startY = e.clientY - iconPosition.y;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!iconPosition.isDragging) return;
      
      let newX = e.clientX - startX;
      let newY = e.clientY - startY;
      
      // Keep within viewport bounds
      const iconWidth = iconRef.current?.offsetWidth || 50;
      const iconHeight = iconRef.current?.offsetHeight || 50;
      const maxX = window.innerWidth - iconWidth;
      const maxY = window.innerHeight - iconHeight;
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      
      setIconPosition({
        x: newX,
        y: newY,
        isDragging: true
      });
    };
    
    const handleMouseUp = () => {
      setIconPosition(prev => ({ ...prev, isDragging: true }));
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Enhanced dragging logic for chat
  const handleChatMouseDown = (e: React.MouseEvent) => {
    // Don't drag if clicking on input or buttons
    if (e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLButtonElement || 
        (e.target as HTMLElement).closest('button')) {
      return;
    }
    
    e.preventDefault();
    setChatPosition(prev => ({ ...prev, isDragging: true }));
    
    const startX = e.clientX - chatPosition.x;
    const startY = e.clientY - chatPosition.y;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!chatPosition.isDragging) return;
      
      let newX = e.clientX - startX;
      let newY = e.clientY - startY;
      
      // Calculate chat dimensions
      const chatWidth = chatRef.current?.offsetWidth || 300;
      const chatHeight = chatRef.current?.offsetHeight || 400;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - chatWidth;
      const maxY = window.innerHeight - chatHeight;
      
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      
      setChatPosition({
        x: newX,
        y: newY,
        isDragging: true
      });
    };
    
    const handleMouseUp = () => {
      setChatPosition(prev => ({ ...prev, isDragging: true }));
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleAIResponse = useCallback(async (userMessage: string) => {
    try {
      // Add the user message to the chat immediately
      const newUserMessage: Message = {
        id: Date.now(),
        text: userMessage,
        sender: 'user',
        side: userMessageSide
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      setInputMessage('');
      
      // Show a loading message while waiting for the AI response
      const loadingMessage: Message = {
        id: Date.now() + 1,
        text: "Thinking...",
        sender: 'ai',
        side: userMessageSide === 'right' ? 'left' : 'right'
      };
      setMessages(prev => [...prev, loadingMessage]);
      
      setIsTyping(true);
      
      // Get the AI response from your API
      const aiResponse = await getGeminiResponse(userMessage, 
        messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      );
      
      setIsTyping(false);
      
      // Remove the loading message and add the real response
      setMessages(prev => [
        ...prev.filter(msg => msg.id !== loadingMessage.id),
        {
          id: Date.now() + 2,
          text: aiResponse,
          sender: 'ai',
          side: userMessageSide === 'right' ? 'left' : 'right'
        }
      ]);
      
    } catch (error) {
      setIsTyping(false);
      console.error('Error getting AI response:', error);
      setMessages(prev => [
        ...prev.filter(msg => msg.text !== "Thinking..."),
        {
          id: Date.now() + 2,
          text: "Sorry, I encountered an error. Please try again.",
          sender: 'ai',
          side: userMessageSide === 'right' ? 'left' : 'right'
        }
      ]);
    }
  }, [messages, userMessageSide]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    await handleAIResponse(inputMessage);
  };

  const getChatSizeClasses = () => {
    switch (chatSize) {
      case 'small':
        return 'w-120 h-100';
      case 'large':
        return 'w-160 h-[38rem]';
      default:
        return 'w-140 h-124';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Floating Icon */}
      <div
        ref={iconRef}
        className={`fixed cursor-pointer pointer-events-auto rounded-full p-3 bg-green-600 text-white shadow-lg hover:bg-green-700 transition-colors ${
          iconPosition.isDragging ? 'shadow-xl scale-110' : ''
        }`}
        style={{
          left: `${iconPosition.x}px`,
          top: `${iconPosition.y}px`,
          transform: iconPosition.isDragging ? 'scale(1.1)' : 'none'
        }}
        onClick={toggleChat}
        onMouseDown={handleIconMouseDown}
        title="Chat with us"
      >
        {isChatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </div>
      
      {/* Chat System */}
      {isChatOpen && (
        <div
          ref={chatRef}
          className={`fixed flex flex-col bg-white rounded-lg shadow-xl overflow-hidden pointer-events-auto ${
            getChatSizeClasses()
          }`}
          style={{
            left: `${chatPosition.x}px`,
            top: `${chatPosition.y}px`,
            cursor: chatPosition.isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={handleChatMouseDown}
        >
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 bg-green-600 text-white">
            <div className="flex items-center space-x-2">
              <MessageSquareText size={20} />
              <span className="font-semibold">AI Assistant</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setUserMessageSide(prev => prev === 'right' ? 'left' : 'right')}
                className="p-1 rounded hover:bg-green-500 transition-colors"
                title="Toggle message sides"
              >
                {userMessageSide === 'right' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
              <button 
                onClick={() => setChatSize(prev => 
                  prev === 'small' ? 'medium' : prev === 'medium' ? 'large' : 'small'
                )}
                className="p-1 rounded hover:bg-green-500 transition-colors"
                title={chatSize === 'large' ? 'Minimize' : 'Maximize'}
              >
                {chatSize === 'large' ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button 
                onClick={toggleChat}
                className="p-1 rounded hover:bg-green-500 transition-colors"
                title="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Start a conversation with the AI
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.side === 'right' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-2 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-green-100 text-gray-800' 
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
    {message.sender === 'ai' ? (
        <ReactMarkdown >
          {message.text}
        </ReactMarkdown>
      ) : (
        message.text
      )}                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-2 rounded-lg bg-gray-200 text-gray-800">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isTyping}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={isTyping || !inputMessage.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatbotSystem;