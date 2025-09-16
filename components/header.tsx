import Link from 'next/link'
import { auth } from '@/auth'
import { clearChats } from '@/app/actions'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { Button } from './ui/button'
import { cookies } from 'next/headers'

export async function Header() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <Link href="/" className="mr-6 flex items-center">
          <span className="text-lg font-bold">Historical AI Chat</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link href="/history">
            <Button variant="ghost">Historical Events</Button>
          </Link>
          <Link href="/personal-stories">
            <Button variant="ghost">Personal Stories</Button>
          </Link>
        </nav>
      </div>
      <div className="flex items-center justify-end space-x-2">
        {session?.user ? (
          <>
            <ClearHistory clearChats={clearChats} />
            <UserMenu user={session.user} />
          </>
        ) : (
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  )
}
