'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { HistoricalChat } from '@/components/historical-chat'
import { AddHistoricalFigureForm } from '@/components/add-historical-figure-form'

function AddFigureButton({ eventId }: { eventId: string }) {
  const [isAdding, setIsAdding] = useState(false)

  if (isAdding) {
    return (
      <div className="border p-4 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Add New Historical Figure</h3>
        <AddHistoricalFigureForm 
          eventId={eventId} 
          onComplete={() => setIsAdding(false)}
        />
      </div>
    )
  }

  return (
    <Button 
      className="w-full h-full min-h-[200px]" 
      variant="outline"
      onClick={() => setIsAdding(true)}
    >
      Add Historical Figure
    </Button>
  )
}

interface EventDetailsProps {
  event: any
  figures: any[]
}

export function EventDetails({ event, figures }: EventDetailsProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative h-64 mb-6">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{event.date}</p>
        <p className="text-lg mb-8">{event.summary}</p>
        
        <h2 className="text-2xl font-semibold mb-6">Historical Figures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {figures?.map(figure => (
            <div key={figure.id} className="border rounded-lg p-4">
              <div className="relative h-40 mb-4">
                <Image
                  src={figure.avatar_url}
                  alt={figure.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{figure.name}</h3>
              <p className="text-gray-600 mb-2">{figure.role}</p>
              <p className="text-sm text-gray-700">{figure.bio}</p>
              <HistoricalChat figure={figure} />
            </div>
          ))}
          <AddFigureButton eventId={event.id} />
        </div>
      </div>
    </div>
  )
} 