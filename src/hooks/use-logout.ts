"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import AuthService from "@/lib/auth"

export function useLogout() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const authService = AuthService.getInstance()

  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      await authService.logoutAndRedirect("/")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed"
      setError(errorMessage)
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } finally {
      setLoading(false)
    }
  }

  return {
    logout,
    loading,
    error
  }
}