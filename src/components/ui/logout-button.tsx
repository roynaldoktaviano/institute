"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  onLogout: () => Promise<void>
  loading?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({
  onLogout,
  loading = false,
  variant = "ghost",
  size = "sm",
  className = "",
  children
}: LogoutButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onLogout}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
      ) : (
        <LogOut className="h-4 w-4 mr-2" />
      )}
      {children || "Logout"}
    </Button>
  )
}