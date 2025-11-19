'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, Training, TrainingSummary } from '@/lib/api'
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
     const [recentParticipant, setParticipant] = useState<TrainingSummary | null>(null);
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
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6 animate-pulse">

        <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto"></div>

        <div className="p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
          
          <div className="w-full h-40 bg-gray-200 rounded-xl"></div>

          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
          </div>

          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded-md w-full"></div>
            <div className="h-3 bg-gray-200 rounded-md w-11/12"></div>
          </div>

          <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
        </div>
      </div>
    </div>
  );
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
          {trainings.map((training) => {
            const matchedTraining = recentParticipant?.trainings.find(
              (t) => t.training_id === training.id
            )

              const isCompleted =
              matchedTraining &&
              matchedTraining.total_modules > 0 &&
              matchedTraining.completed_modules === matchedTraining.total_modules
            return (
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
                  
                  {isCompleted ? (
  <p className="w-full mt-5 text-sm p-2 bg-green-400 text-center text-white font-semibold rounded-2xl">
    Sudah Menyelesaikan Training Ini
  </p>
) : (
  <Link href={`/trainings/${training.id}`}>
    <Button size="sm" className="w-full mt-5 cursor-pointer">
      Lihat Detail
    </Button>
  </Link>
)}
                </div>
              </CardContent>
            </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}