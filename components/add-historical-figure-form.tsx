'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { uploadImage } from '@/lib/supabase-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

interface AddHistoricalFigureFormProps {
  eventId: string
  onComplete?: () => void
}

export function AddHistoricalFigureForm({ eventId, onComplete }: AddHistoricalFigureFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    context: '',
    avatar_url: '',
    event_id: eventId
  })

  const supabase = createClientComponentClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImage(file)
      setFormData(prev => ({ ...prev, avatar_url: imageUrl }))
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
        .from('historical_figures')
        .insert([formData])

      if (error) throw error

      toast.success('Historical figure added successfully!')
      setFormData({
        name: '',
        role: '',
        bio: '',
        context: '',
        avatar_url: '',
        event_id: eventId
      })
      onComplete?.()
    } catch (error) {
      toast.error('Failed to add historical figure')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <Input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="Role"
          value={formData.role}
          onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Biography"
          value={formData.bio}
          onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          required
        />
      </div>

      <div>
        <Textarea
          placeholder="Context for AI Chat (e.g., 'I am [name], and I...')"
          value={formData.context}
          onChange={e => setFormData(prev => ({ ...prev, context: e.target.value }))}
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

      {formData.avatar_url && (
        <div className="mt-4">
          <img 
            src={formData.avatar_url} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Historical Figure'}
      </Button>
    </form>
  )
} 