import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { StoryComments } from '@/components/story-comments'
import { StoryLikeButton } from '@/components/story-like-button'
import { Button } from '@/components/ui/button'

interface Story {
  id: string
  title: string
  date: string
  location: string
  summary: string
  content: string
  image_url?: string
  created_at: string
  user_id: string
}

export default async function PersonalStoriesPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-muted-foreground">
          Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
          .env to view stories.
        </p>
      </div>
    )
  }
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // First, get the stories
  const { data: stories, error } = await supabase
    .from('personal_stories')
    .select('*')
    .order('created_at', { ascending: false })

  // Then, for each story, get its comments and likes separately
  const storiesWithDetails = await Promise.all((stories || []).map(async (story) => {
    const [commentsResponse, likesResponse, userLikeResponse] = await Promise.all([
      supabase
        .from('story_comments')
        .select('id, content, created_at, story_id, user_id')
        .eq('story_id', story.id),
      supabase
        .from('story_likes')
        .select('count')
        .eq('story_id', story.id),
      supabase
        .from('story_likes')
        .select('user_id')
        .eq('story_id', story.id)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '')
    ])

    return {
      ...story,
      comments: commentsResponse.data || [],
      likes: likesResponse.data || [],
      user_like: userLikeResponse.data || []
    }
  }))

  console.log('Error:', error)

  if (error) {
    console.error('Supabase error:', error)
  }

  if (!storiesWithDetails || storiesWithDetails.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Personal Historical Stories</h1>
            <Link href="/personal-stories/new">
              <Button>Share Your Story</Button>
            </Link>
          </div>
          <p className="text-muted-foreground">No stories have been shared yet. Be the first to share your story!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Personal Historical Stories</h1>
          <Link href="/personal-stories/new">
            <Button>Share Your Story</Button>
          </Link>
        </div>

        <div className="grid gap-8">
          {storiesWithDetails.map(story => (
            <div key={story.id} className="border rounded-lg overflow-hidden">
              {story.image_url && (
                <div className="relative h-64">
                  <Image
                    src={story.image_url}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-semibold">{story.title}</h3>
                  <StoryLikeButton 
                    storyId={story.id}
                    initialLikeCount={story.likes[0]?.count ?? 0}
                    initialIsLiked={!!story.user_like[0]?.user_id}
                  />
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  <span>{story.date}</span>
                  <span className="mx-2">•</span>
                  <span>{story.location}</span>
                </div>
                <p className="text-gray-600 mb-4">{story.summary}</p>
                <p className="text-sm mb-6">{story.content}</p>
                <StoryComments 
                  storyId={story.id}
                  initialComments={story.comments}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 