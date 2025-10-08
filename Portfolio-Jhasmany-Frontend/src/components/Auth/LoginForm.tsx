'use client'

import { loginAction } from '@/actions/auth-form'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '../UI/Button'
import Input from '../UI/Input'
import Link from 'next/link'

const LoginForm = () => {
  const [status, formAction, isPending] = useActionState(loginAction, null)
  const router = useRouter()

  useEffect(() => {
    if (status?.success && status.redirect) {
      router.push(status.redirect)
    }
  }, [status, router])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-secondary border-border rounded-lg border p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-neutral text-2xl font-semibold">Welcome Back</h2>
          <p className="text-tertiary-content mt-2">Sign in to your account</p>
        </div>

        <form action={formAction} className="space-y-4">
          <Input
            label="Email address"
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
          <Input
            label="Password"
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />

          {status && (
            <div className={`rounded-md p-3 ${
              status.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm ${
                status.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {status.message}
              </p>
            </div>
          )}

          <Button
            text={isPending ? 'Signing in...' : 'Sign In'}
            disabled={isPending}
          />
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/forgot-password"
            className="text-accent hover:text-accent/80 text-sm transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/auth/register"
            className="text-accent hover:text-accent/80 text-sm transition-colors"
          >
            Don't have an account? Sign up
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-tertiary-content hover:text-neutral text-sm transition-colors"
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginForm