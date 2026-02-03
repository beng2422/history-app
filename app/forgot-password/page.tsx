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

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`
    })
    setIsLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setSent(true)
    toast.success('Check your email for the reset link.')
  }

  if (sent) {
    return (
      <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white/95 p-8 shadow-lg shadow-stone-200/50 dark:border-stone-700 dark:bg-stone-900/95 dark:shadow-stone-900/50">
          <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
            Check your email
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            We sent a password reset link to <strong>{email}</strong>. Click the
            link to set a new password.
          </p>
          <Link href="/sign-in" className="mt-6 block">
            <Button variant="outline" className="w-full">
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.16))] flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white/95 p-8 shadow-lg shadow-stone-200/50 dark:border-stone-700 dark:bg-stone-900/95 dark:shadow-stone-900/50">
      <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
        Forgot password?
      </h1>
      <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex flex-col gap-y-2">
          <Label htmlFor="email" className="text-stone-700 dark:text-stone-300">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border-stone-200 bg-white dark:border-stone-600 dark:bg-stone-800"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
        >
          {isLoading && <IconSpinner className="mr-2 animate-spin" />}
          Send reset link
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
