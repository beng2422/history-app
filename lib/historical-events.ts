import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export interface HistoricalEvent {
  id: string
  title: string
  date: string
  summary: string
  image_url: string
  sortKey?: number
}

export async function getHistoricalEvents(page = 1, limit = 10): Promise<{
  events: HistoricalEvent[]
  totalCount: number
  envMissing?: boolean
}> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { events: [], totalCount: 0, envMissing: true }
  }
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const from = (page - 1) * limit
  const to = from + limit - 1

  // Get total count
  const { count } = await supabase
    .from('historical_events')
    .select('*', { count: 'exact', head: true })

  // Get paginated events with proper sorting
  const { data: events } = await supabase
    .from('historical_events')
    .select('id, title, date, summary, image_url')
    .order('date', { ascending: false })
    .range(from, to)

  // Process events
  const processedEvents = events?.map(event => ({
    ...event,
    sortKey: getSortKey(event.date)
  })) || []

  return { 
    events: processedEvents,
    totalCount: count || 0 
  }
}

export function groupEventsByCentury(events: HistoricalEvent[]) {
  const grouped = events.reduce((acc: { [key: string]: HistoricalEvent[] }, event) => {
    const century = getCentury(event.date)
    
    if (!acc[century]) {
      acc[century] = []
    }
    acc[century].push(event) // event already has sortKey
    return acc
  }, {})

  return Object.entries(grouped)
    .sort(([a], [b]) => {
      const aNum = parseInt(a.split('th')[0].split('st')[0])
      const bNum = parseInt(b.split('th')[0].split('st')[0])
      return bNum - aNum
    })
    .map(([century, events]) => ({
      century,
      events: events.sort((a, b) => (b.sortKey || 0) - (a.sortKey || 0))
    }))
}

function getSortKey(dateStr: string): number {
  try {
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.getTime()
    }
    const yearMatch = dateStr.match(/\d{4}/)
    if (yearMatch) {
      return new Date(parseInt(yearMatch[0]), 0, 1).getTime()
    }
    return 0
  } catch {
    return 0
  }
}

function getCentury(dateStr: string): string {
  try {
    // First try to extract year from the date string
    const yearMatch = dateStr.match(/\d{4}/)
    if (!yearMatch) return 'Unknown Century'
    
    const year = parseInt(yearMatch[0])
    // Calculate century (e.g., 1850 -> 19th, 1901 -> 20th)
    const century = Math.ceil(year / 100)
    
    // Handle ordinal suffix
    const suffix = century === 21 ? 'st' : 'th'
    return `${century}${suffix} Century`
  } catch {
    return 'Unknown Century'
  }
}
