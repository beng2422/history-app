'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function StoryLikeButton({ 
  storyId, 
  initialLikeCount = 0,
  initialIsLiked = false 
}: { 
  storyId: string
  initialLikeCount: number
  initialIsLiked: boolean
}) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const supabase = createClientComponentClient()

  const toggleLike = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error('You must be logged in to like stories')
        return
      }

      if (isLiked) {
        const { error: deleteError } = await supabase
          .from('story_likes')
          .delete()
          .match({ 
            story_id: storyId,
            user_id: userData.user.id 
          })

        if (deleteError) throw deleteError
        setLikeCount(prev => prev - 1)
      } else {
        const { error: insertError } = await supabase
          .from('story_likes')
          .insert([{ 
            story_id: storyId,
            user_id: userData.user.id 
          }])

        if (insertError) {
          if (insertError.code === '23505') { // Unique violation code
            toast.error('You have already liked this story')
            return
          }
          throw insertError
        }
        setLikeCount(prev => prev + 1)
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Like error:', error)
      toast.error('Failed to update like')
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLike}
      className="flex items-center gap-2"
    >
      <Heart 
        className={isLiked ? 'fill-current' : ''} 
        size={18} 
      />
      <span>{likeCount}</span>
    </Button>
  )
} 