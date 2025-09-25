'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, Quiz, QuizSubmission } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, CheckCircle, ArrowLeft, Trophy, BookOpen, LogOut, Menu, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import Image from 'next/image'
import { Sheet, SheetTrigger, SheetTitle, SheetContent } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'

export default function QuizzesPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([])
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

    const loadData = async () => {
      try {
        const [quizzesData, submissionsData] = await Promise.all([
          lmsApi.getQuizzes(),
          lmsApi.getQuizSubmissions()
        ])
        setQuizzes(quizzesData)
        setSubmissions(submissionsData)
      } catch (error) {
        toast({
          title: "Error loading quizzes",
          description: "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user, router, toast])

  const getQuizStatus = (quizIndex: number) => {
    const quizId = quizIndex + 1
    const submission = submissions.find(s => s.quiz_id === quizId)
    
    if (submission) {
      return {
        status: 'completed',
        score: submission.score,
        submittedAt: submission.submitted_at
      }
    }
    return { status: 'available' }
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-[#31569A] py-2 rounded-b-xl dark:bg-gray-800 shadow-xs border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/logo-test.png"
                width={150}
                height={100}
                alt="Logo Test"
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {menus.map((menu) => (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all
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

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-md p-2 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-white">
                      Hello, {user.name}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Navigation Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                 <SheetTitle className="hidden">Menu</SheetTitle>
                <SheetContent side="right" className="w-64 bg-[#31569A] text-white border-white/20">
                  <div className="flex flex-col space-y-4 mt-8">
                    <nav className="space-y-2 px-3 mt-3">
                      {menus.map((menu) => (
                        <Link
                          key={menu.href}
                          href={menu.href}
                          className={`block px-4 py-3 rounded-md text-sm font-medium transition-all
                            ${
                              pathname === menu.href
                                ? "bg-white text-black"
                                : "text-white hover:bg-white/10 hover:text-white"
                            }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {menu.name}
                        </Link>
                      ))}
                    </nav>
                    
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex items-center space-x-3 px-4 py-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Hello, {user.name}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 px-4">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-md p-2 transition-colors hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Available Quizzes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Test your knowledge with our weekly drone quizzes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz, index) => {
            const status = getQuizStatus(index)
            const quizId = index + 1
            

            return (
              <Card key={index} className="hover:shadow-lg transition-shadow gap-[2px]">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle
                      className="text-lg"
                      dangerouslySetInnerHTML={{ __html: quiz.title }}
                    />
                      {/* <CardDescription className="text-sm">Week {quiz.week}</CardDescription> */}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      <Badge 
                      variant={quiz.completed  ? 'default' : 'secondary'}
                      className={quiz.completed ? 'bg-green-100 text-green-800 px-4' : 'px-4'}
                    >
                      {quiz.completed ? 'Selesai' : 'Belum Selesai'}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      {quiz.time_limit_minutes} minutes
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="h-4 w-4 mr-2" />
                      {quiz.questions.length} questions
                    </div>

                    {quiz.completed && (
                      <div className={`${quiz.status === 'Lulus' ? 'bg-green-50 dark:bg-green-900/20': 'bg-red-50 dark:bg-red-900/20'} rounded-lg p-3`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`${quiz.status === 'Lulus' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'} text-sm font-medium `}>
                            Quiz Score
                          </span>
                          <Trophy className={`${quiz.status === 'Lulus' ? 'text-green-600' : 'text-red-600'} h-4 w-4 `} />
                        </div>
                        <div className={`${quiz.status === 'Lulus' ? 'text-green-800 dark:text-green-200': 'text-red-800 dark:text-red-200'} text-2xl font-bold `}>
                          {quiz.score} / 100
                        </div>
                        <Progress value={quiz.score} className="mt-2 h-2" />
                        <div className={`${quiz.status === 'Lulus' ? 'bg-green-600 dark:bg-green-400' : 'bg-red-600 dark:bg-red-400'} w-fit mt-4 mb-2 px-2 py-1 text-sm text-white rounded`}>
                          {quiz.status}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      {quiz.completed ? (
                        <Button variant="outline" className="w-full" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Quiz Sudah Dikerjakan
                        </Button>
                      ) : (
                        <Link href={`/quizzes/${quiz.id}`}>
                          <Button className="w-full cursor-pointer">
                            Kerjakan Quiz
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Clock className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No quizzes available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new quizzes.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}