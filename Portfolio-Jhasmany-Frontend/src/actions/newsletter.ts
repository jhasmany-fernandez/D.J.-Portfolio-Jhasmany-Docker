'use server'

import { newsletterSubscribeSchema } from '@/schemas/newsletter.schema'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:3001'

export async function subscribeNewsletterAction(prevState: unknown, formData: FormData) {
  const validatedFields = newsletterSubscribeSchema.safeParse({
    email: formData.get('email'),
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    company: formData.get('company'),
    source: formData.get('source'),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    }
  }

  try {
    const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data),
    })

    const data = await response.json()

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Please check your email to confirm your subscription.',
        alreadySubscribed: data.alreadySubscribed || false,
      }
    } else {
      return {
        success: false,
        error: data.message || 'Failed to subscribe to newsletter. Please try again.',
      }
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}