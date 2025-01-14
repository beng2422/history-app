import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { EventDetails } from '@/components/event-details'

export default async function EventPage({ params }: { params: { eventId: string } }) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const { data: event } = await supabase
    .from('historical_events')
    .select('*')
    .eq('id', params.eventId)
    .single()
    
  const { data: figures } = await supabase
    .from('historical_figures')
    .select('*')
    .eq('event_id', params.eventId)
  
  if (!event) {
    notFound()
  }

  return <EventDetails event={event} figures={figures || []} />
} 