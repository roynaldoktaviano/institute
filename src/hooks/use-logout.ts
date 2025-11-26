"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/auth" // <-- pakai ini, bukan AuthService

export function useLogout() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { logout } = useAuth() // <-- ini dia logout dari provider

  const doLogout = async () => {
    setLoading(true)
    setError(null)

    try {
      await logout()              // <-- panggil logout yang sudah ada
      router.push("/login")       // <-- sama seperti logic kamu
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed"
      setError(message)

      setTimeout(() => {
        router.push("/login")
      }, 800)
    } finally {
      setLoading(false)
    }
  }

  return {
    logout: doLogout,
    loading,
    error
  }
}
