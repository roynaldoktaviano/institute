'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, Training } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, ArrowLeft, LogOut, Menu, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { parse, format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import Image from 'next/image'
import { Sheet, SheetTrigger, SheetTitle, SheetContent } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'

export default function TrainingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [trainings, setTrainings] = useState<Training[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
        const menus = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Trainings", href: "/trainings" },
        { name: "Quizzes", href: "/quizzes" },
        { name: "Products", href: "/products" },
        // { name: "Profile", href: "/profile" },
      ];

       const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    router.push("/");
  };

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    

    const loadTrainings = async () => {
      try {
        const data = await lmsApi.getTrainings()
        setTrainings(data)
      } catch (error) {
        toast({
          title: "Error loading trainings",
          description: "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTrainings()
  }, [user, router, toast])

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading trainings...</p>
        </div>
      </div>
    )
  }

  function formatTrainingDate(dateStr: string) {
    // API: "28/09/2025 4:00 pm"
    const parsed = parse(dateStr, "dd/MM/yyyy h:mm a", new Date());
    return format(parsed, "dd MMMM yyyy - hh.mm aaaa");
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Available Trainings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore our comprehensive drone training programs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <Card key={training.id} className="hover:shadow-lg transition-shadow pt-0 pb-6">
              <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={training.image} 
                  alt={training.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: training.title }}
                  />
                  <Badge variant={training.type === 'online' ? 'default' : 'secondary'}>
                    {training.type}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{training.topic}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                   {formatTrainingDate(training.date)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    {training.location}
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4 dark:text-gray-300 line-clamp-3">
                    {training.short_description}
                  </p>
                  
                  <Link href={`/trainings/${training.id}`} className='cursor-pointer bg-black mt-5 text-white text-sm py-1 rounded-lg'>
                    <button className="w-full cursor-pointer">
                      View Details
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}