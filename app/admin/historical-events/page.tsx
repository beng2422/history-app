import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AddHistoricalEventForm } from 'components/add-historical-event-form'

export default async function AdminHistoricalEventsPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Manage Historical Events</h1>
        <p className="text-muted-foreground">
          Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
          .env.
        </p>
      </div>
    )
  }
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: events } = await supabase
    .from('historical_events')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Historical Events</h1>
      <AddHistoricalEventForm />
      
      <div className="mt-8 grid gap-6">
        {events?.map(event => (
          <div key={event.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-600">{event.date}</p>
            <p className="mt-2">{event.summary}</p>
            {event.image_url && (
              <img 
                src={event.image_url} 
                alt={event.title}
                className="mt-4 rounded-lg max-w-md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 