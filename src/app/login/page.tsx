'use client'

import { auth, googleProvider } from '@/lib/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from '@react-hook/window-size'

export default function LoginPage() {
  const router = useRouter()
  const [width, height] = useWindowSize()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard')
      }
    })
    return () => unsubscribe()
  }, [])

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log('User signed in:', result.user)
      router.push('/dashboard')
    } catch (err) {
      console.error('Google sign-in error:', err)
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 overflow-hidden">
      {mounted && <Confetti width={width} height={height} numberOfPieces={150} recycle />}

      <h1 className="text-5xl md:text-6xl font-light mb-4 text-brand-hotpink text-center">
        Let’s Celebrate!
      </h1>
      <p className="text-lg text-gray-700 mb-10 text-center">
        Sign in to make your friends make your birthday wishes come true!
      </p>

      <button
        onClick={handleGoogleLogin}
        className="px-8 py-4 bg-brand-hotpink text-white font-bold rounded-full shadow-lg transform transition hover:scale-105 hover:bg-pink-600 "
      >
        🎂 Sign in with Google
      </button>
    </main>
  )
}
