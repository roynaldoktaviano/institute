"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useLogout } from "@/hooks/use-logout"
import { LogoutButton } from "@/components/ui/logout-button"
import { 
  Menu, 
  Home, 
  BookOpen, 
  Brain, 
  Package, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Bell
} from "lucide-react"

interface DashboardNavigationProps {
  user: {
    displayName: string
    email: string
    avatar?: string
  }
  activeTab: string
  onTabChange: (tab: string) => void
}

export function DashboardNavigation({ user, activeTab, onTabChange }: DashboardNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout, loading } = useLogout()

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "training", label: "Training", icon: BookOpen },
    { id: "quiz", label: "Quiz", icon: Brain },
    { id: "knowledge", label: "Product Knowledge", icon: Package },
    // { id: "profile", label: "Profile", icon: User },
    // { id: "settings", label: "Settings", icon: Settings },
  ]

  const NavItem = ({ item, mobile = false }: { item: typeof navigationItems[0], mobile?: boolean }) => (
    <button
      onClick={() => {
        onTabChange(item.id)
        if (mobile) setMobileMenuOpen(false)
      }}
      className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg transition-colors ${
        activeTab === item.id
          ? "bg-primary text-primary-foreground"
          : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      }`}
    >
      <item.icon className="h-5 w-5" />
      <span className="font-medium">{item.label}</span>
    </button>
  )

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="relative w-8 h-8 mr-3">
              <img
                src="/logo.svg"
                alt="LMS Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Learning Management System
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>

            {/* Desktop User Menu */}
            <div className="hidden sm:flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.displayName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <LogoutButton onLogout={logout} loading={loading} variant="ghost" size="sm" />
              </div>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center space-x-3 pb-6 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex-1 py-6 space-y-2">
                    {navigationItems.map((item) => (
                      <NavItem key={item.id} item={item} mobile />
                    ))}
                  </nav>

                  {/* Mobile Footer */}
                  <div className="border-t pt-6 space-y-3">
                    <LogoutButton onLogout={logout} loading={loading} variant="outline" className="w-full justify-start" />
                    <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                      © 2025 LMS. All rights reserved.
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden border-t bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {navigationItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}