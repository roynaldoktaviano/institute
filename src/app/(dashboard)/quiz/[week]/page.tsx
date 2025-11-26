'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Clock, 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Trophy,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

// Mock quiz data - in a real app, this would come from an API
const quizData = {
  1: {
    week: 1,
    title: "Quiz Mingguan Drone Basic",
    time_limit_minutes: 20,
    questions: [
      {
        id: 1,
        question: "Apa fungsi utama GPS pada drone?",
        options: [
          "Menentukan posisi drone",
          "Meningkatkan kualitas kamera",
          "Mengurangi getaran propeller",
          "Menambah daya baterai"
        ],
        answer_type: "multiple_choice",
        correct_answer: "Menentukan posisi drone"
      },
      {
        id: 2,
        question: "Berapa ketinggian maksimal drone untuk pemetaan area kecil?",
        options: [
          "50 meter",
          "100 meter",
          "150 meter",
          "200 meter"
        ],
        answer_type: "multiple_choice",
        correct_answer: "150 meter"
      },
      {
        id: 3,
        question: "Software apa yang umum digunakan untuk processing hasil foto drone?",
        options: [
          "Adobe Photoshop",
          "DroneDeploy",
          "Microsoft Word",
          "Google Chrome"
        ],
        answer_type: "multiple_choice",
        correct_answer: "DroneDeploy"
      },
      {
        id: 4,
        question: "Apa yang dimaksud dengan overlap dalam pemetaan drone?",
        options: [
          "Tumpang tindih area foto",
          "Kecepatan drone",
          "Ketinggian terbang",
          "Durasi baterai"
        ],
        answer_type: "multiple_choice",
        correct_answer: "Tumpang tindih area foto"
      },
      {
        id: 5,
        question: "Berapa persen overlap yang direkomendasikan untuk pemetaan?",
        options: [
          "50-60%",
          "60-70%",
          "70-80%",
          "80-90%"
        ],
        answer_type: "multiple_choice",
        correct_answer: "70-80%"
      }
    ],
    scoring: {
      show_correct_answer: false,
      passing_score: 70
    }
  }
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [quizState, setQuizState] = useState<'intro' | 'taking' | 'finished'>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizResult, setQuizResult] = useState<{ score: number; totalQuestions: number; correctAnswers: number } | null>(null)

  const week = params.week as string
  const quiz = quizData[week as keyof typeof quizData]

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!quiz) {
      router.push('/dashboard')
      return
    }

    // Check if user has already taken this quiz (in real app, this would be from backend)
    const hasTakenQuiz = localStorage.getItem(`quiz_${week}_taken`)
    if (hasTakenQuiz) {
      setQuizState('finished')
      const savedResult = localStorage.getItem(`quiz_${week}_result`)
      if (savedResult) {
        setQuizResult(JSON.parse(savedResult))
      }
    }
  }, [user, quiz, week, router])

  useEffect(() => {
    if (quizState === 'taking' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (quizState === 'taking' && timeLeft === 0) {
      handleSubmitQuiz()
    }
  }, [quizState, timeLeft])

  const startQuiz = () => {
    setQuizState('taking')
    setTimeLeft(quiz.time_limit_minutes * 60)
    setCurrentQuestion(0)
    setAnswers({})
  }

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmitQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmitQuiz = () => {
    let correctAnswers = 0
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correct_answer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / quiz.questions.length) * 100)
    const result = { score, totalQuestions: quiz.questions.length, correctAnswers }
    
    setQuizResult(result)
    setQuizState('finished')
    
    // Save quiz completion
    localStorage.setItem(`quiz_${week}_taken`, 'true')
    localStorage.setItem(`quiz_${week}_result`, JSON.stringify(result))
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!user || !quiz) {
    return null
  }

  if (quizState === 'intro') {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">Quiz Details</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {quiz.title}
                </CardTitle>
                <CardDescription>
                  Week {quiz.week} • Time limit: {quiz.time_limit_minutes} minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Quiz Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Questions:</span>
                        <span className="ml-2 font-medium">{quiz.questions.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time Limit:</span>
                        <span className="ml-2 font-medium">{quiz.time_limit_minutes} min</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Attempts:</span>
                        <span className="ml-2 font-medium">One time only</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Passing Score:</span>
                        <span className="ml-2 font-medium">{quiz.scoring.passing_score}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">Important Notice</h4>
                    <p className="text-sm text-yellow-700">
                      This quiz can only be taken once. Please ensure you have enough time and a stable internet connection before starting.
                    </p>
                  </div>

                  <Button className="w-full" size="lg" onClick={startQuiz}>
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (quizState === 'taking') {
    const question = quiz.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <h1 className="text-xl font-semibold">{quiz.title}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span className={`font-medium ${timeLeft < 60 ? 'text-red-600' : ''}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentQuestion + 1} of {quiz.questions.length}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1}
                </CardTitle>
                <CardDescription>
                  {question.question}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <RadioGroup 
                    value={answers[currentQuestion] || ''} 
                    onValueChange={handleAnswerChange}
                  >
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={handleNextQuestion}
                      disabled={!answers[currentQuestion]}
                    >
                      {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  if (quizState === 'finished' && quizResult) {
    const passed = quizResult.score >= quiz.scoring.passing_score

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">Quiz Results</h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 mb-4">
                  {passed ? (
                    <CheckCircle className="w-full h-full text-green-600" />
                  ) : (
                    <XCircle className="w-full h-full text-red-600" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {passed ? 'Congratulations!' : 'Quiz Completed'}
                </CardTitle>
                <CardDescription>
                  You have completed the {quiz.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {quizResult.score}%
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {quizResult.correctAnswers} out of {quizResult.totalQuestions} correct
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Status:</span>
                      <Badge className={passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {passed ? 'Passed' : 'Failed'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Passing Score:</span>
                      <span>{quiz.scoring.passing_score}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Time Taken:</span>
                      <span>{quiz.time_limit_minutes - Math.floor(timeLeft / 60)} minutes</span>
                    </div>
                  </div>

                  <Alert>
                    <AlertDescription>
                      This quiz can only be taken once. Your result has been recorded.
                    </AlertDescription>
                  </Alert>

                  <div className="flex space-x-3">
                    <Link href="/dashboard">
                      <Button className="flex-1">
                        Back to Dashboard
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" className="flex-1">
                        View Certificate
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return null
}