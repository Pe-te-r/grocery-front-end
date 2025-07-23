// providers/ChatbotProvider.tsx
"use client"

import { useEffect, useState } from 'react'
import FloatingChatbot from "./FloatingChatBot"

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  // This ensures the chatbot is mounted properly
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {children}
      {mounted && <FloatingChatbot />}
    </>
  )
}