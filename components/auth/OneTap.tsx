'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

// ✅ Fix 1: Proper type instead of `any`
interface PromptNotification {
  isNotDisplayed: () => boolean
  isSkippedMoment: () => boolean
  isDismissedMoment: () => boolean
  getNotDisplayedReason: () => string
  getSkippedReason: () => string
  getDismissedReason: () => string
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string
    callback: (response: { credential: string }) => void
    auto_select: boolean
    cancel_on_tap_outside: boolean
  }) => void
  prompt: (callback?: (notification: PromptNotification) => void) => void  // ← optional callback
  renderButton: (element: HTMLElement, config: object) => void
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: GoogleAccountsId
      }
    }
  }
}

export function OneTap() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  // ✅ Fix 2 & 4: useCallback + removed unused `data`
  const handleCredential = useCallback(
    async (response: { credential: string }) => {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      })

      if (error) {
        console.error('Auth error:', error.message)
        return
      }

      router.refresh()
    },
    [supabase, router]
  )

  // ✅ Fix 2 & 3: useCallback so it can be a stable useEffect dependency
  const initializeOneTap = useCallback(() => {
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: handleCredential, // ✅ now declared above, no stale closure
      auto_select: false,
      cancel_on_tap_outside: true,
    })

    const authRequired = searchParams.get('auth') === 'required'

    if (authRequired) {
      window.google.accounts.id.prompt()
    } else {
      setTimeout(() => {
        window.google.accounts.id.prompt()
      }, 1000)
    }
  }, [handleCredential, searchParams])

  // ✅ Fix 3: initializeOneTap now in deps array
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => initializeOneTap()

    return () => {
      document.body.removeChild(script)
    }
  }, [initializeOneTap])

  return null
}