import Image from 'next/image'
import Link from 'next/link'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function HistoricalFiguresPage() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Chat with Historical Figures</h1>
        <p className="text-muted-foreground">
          Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in
          .env to view figures.
        </p>
      </div>
    )
  }
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: figures } = await supabase
    .from('historical_figures')
    .select('*')
    .order('name')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Chat with Historical Figures</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {figures?.map(figure => (
          <Link 
            key={figure.id}
            href={`/historical-figures/${figure.id}`}
            className="block group"
          >
            <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
              <Image
                src={figure.avatar_url}
                alt={figure.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <h2 className="text-xl font-semibold">{figure.name}</h2>
            <p className="text-muted-foreground">{figure.brief_description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
} 