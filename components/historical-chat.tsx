'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'
import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { HistoricalFigure } from '@/lib/types'

interface ChatMessage {
  id: string
  role: string
  content: string
}

export function HistoricalChat({ figure }: { figure: HistoricalFigure }) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'system',
        content: figure.context
      }
    ]
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isOpen) {
    return (
      <Button 
        className="w-full mt-4" 
        onClick={() => setIsOpen(true)}
      >
        Chat with {figure.name}
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-10 flex h-[46vh] w-[calc(100%-2rem)] flex-col rounded-lg border bg-background shadow-lg md:left-1/2 md:right-auto md:w-full md:max-w-2xl md:-translate-x-1/2"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={figure.avatar_url}
                alt={figure.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">Chat with {figure.name}</h3>
          </div>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.length > 1 ? (
            <>
              {messages.slice(1).map((message: ChatMessage) => (
                <div key={message.id} className="flex gap-3">
                  <div className={message.role === 'user' ? 'ml-auto' : ''}>
                    <p className="bg-muted rounded-lg p-3">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Ask me anything! Here are some suggestions:
              </p>
              <div className="grid gap-2">
                {figure.possible_questions_to_ask?.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start"
                    onClick={() => {
                      handleInputChange({ target: { value: question } } as any)
                      handleSubmit({ preventDefault: () => {} } as any)
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto border-t p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={`Ask ${figure.name} a question...`}
                className="max-w-md flex-1 py-3 min-h-[44px] text-base"
              />
              <Button type="submit" size="default" className="shrink-0 px-6">
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 