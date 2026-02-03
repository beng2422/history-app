import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getHistoricalEvents, groupEventsByCentury } from '@/lib/historical-events'
import { Button } from '@/components/ui/button'

function EventSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-border bg-card dark:border-stone-700 dark:bg-stone-900">
      <div className="h-48 bg-muted dark:bg-stone-800" />
      <div className="p-6">
        <div className="mb-2 h-6 w-3/4 rounded bg-muted dark:bg-stone-700" />
        <div className="mb-3 h-4 w-1/4 rounded bg-muted dark:bg-stone-700" />
        <div className="h-4 w-full rounded bg-muted dark:bg-stone-700" />
      </div>
    </div>
  )
}

function EventCard({ event }: { event: any }) {
  return (
    <Link
      key={event.id}
      href={`/history/${event.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-warm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-warm-lg dark:border-stone-700 dark:bg-stone-900 dark:shadow-none dark:hover:border-stone-600 dark:hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-muted dark:bg-stone-800">
        <Image
          src={event.image_url}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          quality={60}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLi44QjhAOEA4Qi4tMkYyLlFUUVRHVFxcXFRUVFRUVFT/2wBDAR"
        />
      </div>
      <div className="p-6">
        <h2 className="mb-2 text-xl font-semibold text-foreground dark:text-stone-100">
          {event.title}
        </h2>
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          {event.date}
        </p>
        <p className="line-clamp-3 text-muted-foreground">
          {event.summary}
        </p>
      </div>
    </Link>
  )
}

export default async function HistoryPage({
  searchParams
}: {
  searchParams: { page?: string }
}) {
  const page = Number(searchParams.page) || 1
  const ITEMS_PER_PAGE = 20
  
  const { events, totalCount, envMissing } = await getHistoricalEvents(page, ITEMS_PER_PAGE)
  const groupedEvents = groupEventsByCentury(events)
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE))

  if (envMissing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Historical Events</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="font-medium text-amber-800 dark:text-amber-200">No events (Supabase not configured locally)</p>
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
            Add <code className="rounded bg-amber-200/50 px-1 py-0.5 dark:bg-amber-800/50">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-amber-200/50 px-1 py-0.5 dark:bg-amber-800/50">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to a{' '}
            <strong>.env</strong> file in the project root (same folder as <code className="rounded bg-amber-200/50 px-1 py-0.5 dark:bg-amber-800/50">package.json</code>), then restart the dev server (<code className="rounded bg-amber-200/50 px-1 py-0.5 dark:bg-amber-800/50">pnpm dev</code>).
          </p>
        </div>
      </div>
    )
  }

  if (page < 1 || page > totalPages) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Historical Events</h1>
        <p className="text-center text-gray-600">Invalid page number. <Link href="/history" className="text-blue-600 hover:underline">Go back to first page</Link></p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight text-foreground dark:text-stone-100">
        Historical Events
      </h1>

      {totalPages > 1 && (
        <div className="mb-8 flex justify-center gap-2">
          {page > 1 && (
            <Link href={`/history?page=${page - 1}`} prefetch={true}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/history?page=${page + 1}`} prefetch={true}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}

      <Suspense fallback={
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => <EventSkeleton key={i} />)}
        </div>
      }>
        {groupedEvents.map(({ century, events }) => (
          <div key={century} className="mb-16">
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground dark:text-stone-300">
              {century}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {events.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <Link href={`/history?page=${page - 1}`} prefetch={true}>
                <Button variant="outline">Previous</Button>
              </Link>
            )}
            <span className="px-4 py-2 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/history?page=${page + 1}`} prefetch={true}>
                <Button variant="outline">Next</Button>
              </Link>
            )}
          </div>
        )}
      </Suspense>
    </div>
  )
} 