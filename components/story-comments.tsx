'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-hot-toast'

interface Comment {
  id: string
  content: string
  created_at: string
  story_id: string
  user_id: string
  user: {
    email: string
  }
}

export function StoryComments({ storyId, initialComments = [] }: { 
  storyId: string
  initialComments: Comment[]
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const supabase = createClientComponentClient()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error('You must be logged in to comment')
        return
      }

      // First, insert the comment
      const { data: commentData, error: commentError } = await supabase
        .from('story_comments')
        .insert([{
          story_id: storyId,
          content: newComment,
          user_id: userData.user.id
        }])
        .select('id, content, created_at, story_id, user_id')
        .single()

      if (commentError) throw commentError

      // Create the comment data with the user's email from auth
      const newCommentData = {
        ...commentData,
        user: {
          email: userData.user.email || 'Anonymous'
        }
      } as Comment

      setComments([...comments, newCommentData])
      setNewComment('')
      toast.success('Comment added!')
    } catch (error) {
      console.error('Comment error:', error)
      toast.error('Failed to add comment')
    }
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Comments</h3>
      
      <div className="space-y-4 mb-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">
              {comment.user?.email || 'Anonymous'}
            </p>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button type="submit">Comment</Button>
      </form>
    </div>
  )
} 