import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getHistoricalEvents, groupEventsByCentury } from '@/lib/historical-events'
import { Button } from '@/components/ui/button'

function EventSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="bg-muted h-48"/>
      <div className="p-6">
        <div className="h-6 bg-muted rounded w-3/4 mb-2"/>
        <div className="h-4 bg-muted rounded w-1/4 mb-3"/>
        <div className="h-4 bg-muted rounded w-full"/>
      </div>
    </div>
  )
}

function EventCard({ event }: { event: any }) {
  return (
    <Link 
      key={event.id} 
      href={`/history/${event.id}`}
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card"
    >
      <div className="relative h-48 bg-muted">
        <Image
          src={event.image_url}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="object-cover"
          quality={60}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkLzYvLy0vLi44QjhAOEA4Qi4tMkYyLlFUUVRHVFxcXFRUVFRUVFT/2wBDAR"
        />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
        <p className="text-gray-600 mb-3">{event.date}</p>
        <p className="text-gray-700 line-clamp-3">{event.summary}</p>
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
  
  const { events, totalCount } = await getHistoricalEvents(page, ITEMS_PER_PAGE)
  const groupedEvents = groupEventsByCentury(events)
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

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
      <h1 className="text-4xl font-bold mb-8">Historical Events</h1>
      
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-8">
          {page > 1 && (
            <Link href={`/history?page=${page - 1}`} prefetch={true}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="px-4 py-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(ITEMS_PER_PAGE)].map((_, i) => <EventSkeleton key={i} />)}
        </div>
      }>
        {groupedEvents.map(({ century, events }) => (
          <div key={century} className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center bg-muted py-4 rounded-lg">
              {century}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <span className="px-4 py-2">
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