'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, Training } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, ArrowLeft, LogOut } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { parse, format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import Image from 'next/image'

export default function TrainingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [trainings, setTrainings] = useState<Training[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname();
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
           <header className="bg-[#31569A] py-2 rounded-b-xl dark:bg-gray-800 shadow-xs border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex w-full justify-between items-center">
              {/* <h1 className="text-2xl font-bold text-white dark:text-white">
                Doran Institute
              </h1> */}
              <Image
              src="/logo-test.png"
              width={150}
              height={`100`}
              alt="Logo Test"
              />
               <nav className="hidden md:flex space-x-4">
      {menus.map((menu) => (
        <Link
          key={menu.href}
          href={menu.href}
          className={`px-4 py-1 rounded text-sm transition-all
            ${
              pathname === menu.href
                ? "bg-white text-black"
                : "text-white hover:bg-white hover:text-black"
            }`}
        >
          {menu.name}
        </Link>
      ))}
    </nav>
              <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-white dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Hello, {user.name}
                </Link>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            </div>

            
          </div>
        </div>
      </header>

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
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {training.short_description}
                  </p>
                  
                  <Link href={`/trainings/${training.id}`}>
                    <Button className="w-full">
                      View Details
                    </Button>
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