import { auth } from '@/auth'
import { LoginButton } from '@/components/login-button'
import { LoginForm } from '@/components/login-form'
import { Separator } from '@/components/ui/separator'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const cookieStore = cookies()
  const session = await auth({ cookieStore })
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-stone-100/80 py-10 dark:from-stone-950 dark:to-stone-900/80">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white/95 p-8 shadow-lg shadow-stone-200/50 dark:border-stone-700 dark:bg-stone-900/95 dark:shadow-stone-900/50">
        <h1 className="mb-6 text-xl font-semibold text-stone-900 dark:text-stone-100">
          Sign in
        </h1>
        <LoginForm action="sign-in" />
        <Separator className="my-6 bg-stone-200 dark:bg-stone-700" />
        <div className="flex justify-center">
          <LoginButton />
        </div>
      </div>
    </div>
  )
}
