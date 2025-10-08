'use client'

import { registerAction } from '@/actions/auth-form'
import { useActionState } from 'react'
import Button from '../UI/Button'
import Input from '../UI/Input'
import Link from 'next/link'

const RegisterForm = () => {
  const [status, formAction, isPending] = useActionState(registerAction, null)

  if (status?.success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-secondary border-border rounded-lg border p-8 shadow-lg text-center">
          <div className="mb-6">
            <div className="text-accent mx-auto mb-4 text-5xl">✓</div>
            <h2 className="text-neutral text-2xl font-semibold">Account Created!</h2>
            <p className="text-tertiary-content mt-2">{status.message}</p>
          </div>
          <Link
            href="/auth/login"
            className="bg-accent hover:bg-accent/80 text-secondary inline-block w-full cursor-pointer rounded-lg px-4 py-2 transition-colors duration-300"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-secondary border-border rounded-lg border p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-neutral text-2xl font-semibold">Create Account</h2>
          <p className="text-tertiary-content mt-2">Join us and start your journey</p>
        </div>

        <form action={formAction} className="space-y-4">
          <Input
            label="Full name"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
          />
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
            placeholder="Create a password"
            required
          />
          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
          />

          {status && !status.success && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{status.message}</p>
            </div>
          )}

          <Button
            text={isPending ? 'Creating Account...' : 'Create Account'}
            disabled={isPending}
          />
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="text-accent hover:text-accent/80 text-sm transition-colors"
          >
            Already have an account? Sign in
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

export default RegisterForm