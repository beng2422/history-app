'use client'

import * as React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { IconSpinner } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  const [noSession, setNoSession] = React.useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setReady(true)
      else setNoSession(true)
    }
    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setIsLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setIsLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Password updated. Sign in with your new password.')
    router.push('/sign-in')
    router.refresh()
  }

  if (!ready && !noSession) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 bg-white/95 p-8 shadow-lg dark:border-stone-700 dark:bg-stone-900/95">
          <IconSpinner className="h-8 w-8 animate-spin text-stone-500" />
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Loading…
          </p>
        </div>
      </div>
    )
  }

  if (noSession && !ready) {
    return (
      <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-stone-100/80 py-10 dark:from-stone-950 dark:to-stone-900/80">
        <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white/95 p-8 shadow-lg dark:border-stone-700 dark:bg-stone-900/95">
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Invalid or expired link
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            This password reset link is invalid or has expired. Request a new one
            below.
          </p>
          <Link href="/forgot-password" className="mt-6 block">
            <Button className="w-full">Request new reset link</Button>
          </Link>
          <Link
            href="/sign-in"
            className="mt-4 block text-center text-sm text-stone-600 hover:underline dark:text-stone-400"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center bg-gradient-to-b from-stone-50 to-stone-100/80 py-10 dark:from-stone-950 dark:to-stone-900/80">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white/95 p-8 shadow-lg shadow-stone-200/50 dark:border-stone-700 dark:bg-stone-900/95 dark:shadow-stone-900/50">
        <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
          Set new password
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label
                htmlFor="password"
                className="text-stone-700 dark:text-stone-300"
              >
                New password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border-stone-200 bg-white dark:border-stone-600 dark:bg-stone-800"
              />
            </div>
            <div className="flex flex-col gap-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-stone-700 dark:text-stone-300"
              >
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="border-stone-200 bg-white dark:border-stone-600 dark:bg-stone-800"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
          >
            {isLoading && <IconSpinner className="mr-2 animate-spin" />}
            Update password
          </Button>
        </form>
        <Link
          href="/sign-in"
          className="mt-4 block text-center text-sm text-stone-600 hover:underline dark:text-stone-400"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
