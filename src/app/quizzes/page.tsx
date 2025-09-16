'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, Quiz, QuizSubmission } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Clock, CheckCircle, ArrowLeft, Trophy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function QuizzesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Quizzes</h1>
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
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <CardDescription className="text-sm">Week {quiz.week}</CardDescription>
                    </div>
                    <Badge 
                      variant={status.status === 'completed' ? 'default' : 'secondary'}
                      className={status.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {status.status === 'completed' ? 'Completed' : 'Available'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      {quiz.time_limit_minutes} minutes
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.questions.length} questions
                    </div>

                    {status.status === 'completed' && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            Quiz Completed
                          </span>
                          <Trophy className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                          {status.score}%
                        </div>
                        <Progress value={status.score} className="mt-2 h-2" />
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Completed on {new Date(status.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    )}

                    <div className="pt-2">
                      {status.status === 'completed' ? (
                        <Button variant="outline" className="w-full" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Quiz Completed
                        </Button>
                      ) : (
                        <Link href={`/quizzes/${quizId}`}>
                          <Button className="w-full">
                            Start Quiz
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