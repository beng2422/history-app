'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { uploadImage } from '@/lib/supabase-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

export function AddHistoricalEventForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    summary: '',
    content: '',
    image_url: ''
  })

  const supabase = createClientComponentClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImage(file)
      setFormData(prev => ({ ...prev, image_url: imageUrl }))
      toast.success('Image uploaded successfully!')
    } catch (error) {
      toast.error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('historical_events')
        .insert([formData])

      if (error) throw error

      toast.success('Historical event added successfully!')
      setFormData({
        title: '',
        date: '',
        summary: '',
        content: '',
        image_url: ''
      })
    } catch (error) {
      toast.error('Failed to add historical event')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <Input
          type="text"
          placeholder="Event Title"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="Date (e.g., December 17, 1903)"
          value={formData.date}
          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Summary"
          value={formData.summary}
          onChange={e => setFormData(prev => ({ ...prev, summary: e.target.value }))}
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Detailed Content"
          value={formData.content}
          onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
        />
      </div>

      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          required
        />
      </div>

      {formData.image_url && (
        <div className="mt-4">
          <img 
            src={formData.image_url} 
            alt="Preview" 
            className="max-w-md rounded-lg"
          />
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Historical Event'}
      </Button>
    </form>
  )
} 