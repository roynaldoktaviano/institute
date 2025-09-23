'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, Quiz } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function QuizDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [score, setScore] = useState(0)
  const [hasTakenQuiz, setHasTakenQuiz] = useState(false)

  const quizId = parseInt(params.id as string)

  useEffect(() => {
  if (!user) {
    router.push('/login')
    return
  }

  const loadQuiz = async () => {
    try {
      const quizzes = await lmsApi.getQuizzes()

      // Cari quiz berdasarkan ID
      const foundQuiz = quizzes.find(q => q.id === quizId)

      if (!foundQuiz) {
        toast({
          title: "Quiz not found",
          description: "The requested quiz could not be found.",
          variant: "destructive",
        })
        router.push('/quizzes')
        return
      }

      setQuiz(foundQuiz)

      // Check if user has already taken this quiz
      const submissions = await lmsApi.getQuizSubmissions()
      const hasTaken = submissions.some(s => s.quiz_id === quizId)
      setHasTakenQuiz(hasTaken)

      // Initialize answers array
      setAnswers(new Array(foundQuiz.questions.length).fill(-1))
      setTimeRemaining(foundQuiz.time_limit_minutes * 60)
    } catch (error) {
      toast({
        title: "Error loading quiz",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  loadQuiz()
}, [user, router, toast, quizId])


  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [quizStarted, quizCompleted, timeRemaining])

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }
  
  const handleSubmitQuiz = async () => {

    if (!quiz) return

    try {
      const savedUser = localStorage.getItem("lms_user")!
       const savedToken = localStorage.getItem("lms_token")

       const user = JSON.parse(savedUser)
       const userId = user.id 
      const result = await lmsApi.submitQuiz(userId,quizId, answers)
      setScore(result.score)
      setQuizCompleted(true)
      setQuizStarted(false)
      
      toast({
        title: "Quiz submitted",
        description: `Your score: ${result.score}% (${result.status})`,
      })
    } catch (error) {
      toast({
        title: "Error submitting quiz",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!quiz) return 0
    const answeredQuestions = answers.filter(answer => answer !== -1).length
    return (answeredQuestions / quiz.questions.length) * 100
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz not found</h1>
          <Link href="/quizzes">
            <Button>Back to Quizzes</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (hasTakenQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Quiz Already Taken</CardTitle>
            <CardDescription>
              You have already completed this quiz. Each quiz can only be taken once.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/quizzes">
              <Button className="w-full">Back to Quizzes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>Quiz Completed!</CardTitle>
            <CardDescription>
              {quiz.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {score}%
            </div>
            <Badge 
              variant={score >= 70 ? 'default' : 'destructive'}
              className="mb-4"
            >
              {score >= 70 ? 'Passed' : 'Failed'}
            </Badge>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Thank you for completing the quiz. Your results have been recorded.
            </p>
            <Link href="/quizzes">
              <Button className="w-full">Back to Quizzes</Button>
            </Link>
          </CardContent>
        </Card>
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
              <Link href="/quizzes">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Quizzes
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {quiz.title}
              </h1>
            </div>
            
            {quizStarted && (
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(timeRemaining)}
                </Badge>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!quizStarted ? (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Ready to start the quiz?</CardTitle>
                <CardDescription className="text-center">
                  Week {quiz.week} • {quiz.questions.length} questions • {quiz.time_limit_minutes} minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Quiz Instructions:</h3>
                  <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• You have {quiz.time_limit_minutes} minutes to complete all questions</li>
                    <li>• Each question has multiple choice answers</li>
                    <li>• You can navigate between questions before submitting</li>
                    <li>• Once submitted, you cannot retake this quiz</li>
                    <li>• Passing score is 70% or higher</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Button 
                    size="lg" 
                    onClick={() => setQuizStarted(true)}
                    className="w-full sm:w-auto"
                  >
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {answers.filter(a => a !== -1).length} of {quiz.questions.length} answered
                  </span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </CardContent>
            </Card>

            {/* Question */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1}
                </CardTitle>
                <CardDescription className="text-base font-medium text-gray-900 dark:text-white">
                  {quiz.questions[currentQuestion].question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={answers[currentQuestion]?.toString()} 
                  onValueChange={(value) => handleAnswerSelect(currentQuestion, parseInt(value))}
                >
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentQuestion + 1} / {quiz.questions.length}
              </div>
              
              {currentQuestion === quiz.questions.length - 1 ? (
                <Button 
                  onClick={handleSubmitQuiz}
                  disabled={answers[currentQuestion] === -1}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button 
                  onClick={handleNextQuestion}
                  disabled={answers[currentQuestion] === -1}
                >
                  Next
                </Button>
              )}
            </div>

            {/* Question Navigator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Question Navigator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {quiz.questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={currentQuestion === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentQuestion(index)}
                      className={answers[index] !== -1 ? "bg-green-100 border-green-300" : ""}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}