'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { uploadImage } from '@/lib/supabase-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

export function AddPersonalStoryForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
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
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error('You must be logged in to add a story')
        return
      }

      const { error } = await supabase
        .from('personal_stories')
        .insert([{
          ...formData,
          user_id: userData.user.id
        }])

      if (error) throw error

      toast.success('Story added successfully!')
      setFormData({
        title: '',
        date: '',
        location: '',
        summary: '',
        content: '',
        image_url: ''
      })
      // Refresh the page to show new story
      window.location.reload()
    } catch (error) {
      console.error('Error adding story:', error)
      toast.error('Failed to add story')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <Input
          type="text"
          placeholder="Story Title"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Input
          type="text"
          placeholder="Date (e.g., 1942-1945)"
          value={formData.date}
          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div>
        <Input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
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
          placeholder="Full Story"
          value={formData.content}
          onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
          required
          className="min-h-[200px]"
        />
      </div>

      <div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
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
        {isLoading ? 'Adding...' : 'Add Personal Story'}
      </Button>
    </form>
  )
} 