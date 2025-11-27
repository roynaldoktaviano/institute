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
        setQuizzes(quizzesData.quizzes)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Available Quizzes
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Test your knowledge with our weekly drone quizzes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => {
            const status = getQuizStatus(index)
            const quizId = index + 1
            

            return (
              <Card
  key={index}
  className="
    bg-white dark:bg-zinc-900 
    border border-gray-100 dark:border-zinc-800
    rounded-xl overflow-hidden
    shadow-sm hover:shadow-lg transition-all duration-300
  "
>
  {/* HEADER */}
  <CardHeader className="">
    <div className="space-y-2">

      {/* BADGE STATUS */}
      <Badge 
        variant="secondary"
        className={`w-fit text-xs px-3 py-1 rounded-full
          ${quiz.completed 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400'}
        `}
      >
        {quiz.completed ? 'Selesai' : 'Belum Selesai'}
      </Badge>

      {/* TITLE */}
      <CardTitle
        className="text-base font-semibold leading-snug line-clamp-2"
        dangerouslySetInnerHTML={{ __html: quiz.title }}
      />
    </div>
  </CardHeader>

  {/* CONTENT */}
  <CardContent className="space-y-4">

    {/* INFO */}
    <div className="flex justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        {quiz.time_limit_minutes} Menit
      </div>
      <div className="flex items-center gap-1.5">
        <BookOpen className="h-4 w-4" />
        {quiz.questions.length} Soal
      </div>
    </div>

    {/* SCORE */}
    {quiz.completed && (
      <div className={`
        mt-2 rounded-lg p-3 space-y-2
        ${quiz.status === 'Lulus' 
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-100' 
          : 'bg-red-50 dark:bg-red-900/20 border border-red-100'}
      `}>
        <div className="flex items-center justify-between text-sm font-medium">
          <span className={quiz.status === 'Lulus'
            ? 'text-green-700 dark:text-green-300'
            : 'text-red-700 dark:text-red-300'}
          >
            Quiz Score
          </span>
          <Trophy className={`h-4 w-4 ${
            quiz.status === 'Lulus' ? 'text-green-600' : 'text-red-600'
          }`} />
        </div>

        <div className={`
          text-xl font-bold
          ${quiz.status === 'Lulus' 
            ? 'text-green-700 dark:text-green-300' 
            : 'text-red-700 dark:text-red-300'}
        `}>
          {quiz.score} / 100
        </div>

        <Progress value={quiz.score} className="h-2" />

        <span className={`
          inline-block text-xs px-3 py-1 rounded-full text-white mt-1
          ${quiz.status === 'Lulus' ? 'bg-green-600' : 'bg-red-600'}
        `}>
          {quiz.status}
        </span>
      </div>
    )}

    {/* BUTTON */}
    <div>
      {quiz.completed ? (
        <Button
          variant="outline"
          disabled
          className="w-full cursor-not-allowed text-sm"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Quiz Sudah Dikerjakan
        </Button>
      ) : (
        <Link href={`/quizzes/${quiz.id}`}>
          <Button className="w-full text-sm font-medium">
            Mulai Quiz
          </Button>
        </Link>
      )}
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