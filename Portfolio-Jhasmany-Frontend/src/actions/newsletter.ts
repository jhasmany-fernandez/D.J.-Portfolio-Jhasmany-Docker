'use server'

import { newsletterSubscribeSchema } from '@/schemas/newsletter.schema'

const API_URL = process.env.API_URL || 'http://localhost:3001'

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
    console.log('📧 Attempting newsletter subscription:', {
      email: validatedFields.data.email,
      API_URL,
      url: `${API_URL}/api/newsletter/subscribe`
    })

    const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data),
    })

    console.log('📧 Response status:', response.status, response.ok)

    const data = await response.json()
    console.log('📧 Response data:', data)

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Please check your email to confirm your subscription.',
        alreadySubscribed: data.alreadySubscribed || false,
      }
    } else {
      console.error('📧 Backend error response:', data)
      return {
        success: false,
        error: data.message || 'Failed to subscribe to newsletter. Please try again.',
      }
    }
  } catch (error) {
    console.error('📧 Newsletter subscription error:', error)
    console.error('📧 Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : typeof error,
      cause: error instanceof Error ? error.cause : undefined
    })
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}