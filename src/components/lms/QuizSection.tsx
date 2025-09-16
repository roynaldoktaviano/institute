"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  Trophy,
  Target
} from "lucide-react"

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer_type: "multiple_choice"
}

interface QuizScoring {
  show_correct_answer: boolean
  result?: {
    score: number
    status: string
  }
}

interface WeeklyQuiz {
  week: number
  title: string
  time_limit_minutes: number
  questions: QuizQuestion[]
  scoring: QuizScoring
}

interface QuizSectionProps {
  quiz: WeeklyQuiz
  onStartQuiz?: () => void
}

export function QuizSection({ quiz, onStartQuiz }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit_minutes * 60)
  const [showResults, setShowResults] = useState(false)
  const [hasAttempted, setHasAttempted] = useState(false)

  // Check if quiz has been attempted before
  useEffect(() => {
    const attempted = localStorage.getItem(`quiz_${quiz.week}_attempted`)
    if (attempted) {
      setHasAttempted(true)
    }
  }, [quiz.week])

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      finishQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const startQuiz = () => {
    if (hasAttempted) {
      return // Prevent retaking
    }
    
    setQuizStarted(true)
    setQuizCompleted(false)
    setShowResults(false)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setTimeRemaining(quiz.time_limit_minutes * 60)
    onStartQuiz?.()
    
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          finishQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const finishQuiz = () => {
    setQuizCompleted(true)
    // Calculate score (mock calculation)
    const answeredQuestions = Object.keys(selectedAnswers).length
    const score = Math.round((answeredQuestions / quiz.questions.length) * 100)
    
    if (quiz.scoring.result) {
      quiz.scoring.result.score = score
      quiz.scoring.result.status = score >= 70 ? "Lulus" : "Tidak Lulus"
    }

    // Mark as attempted
    localStorage.setItem(`quiz_${quiz.week}_attempted`, 'true')
    setHasAttempted(true)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: string) => {
    return status === "Lulus" ? "default" : "destructive"
  }

  if (!quizStarted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              Kuis Mingguan
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Uji pengetahuan Anda dengan kuis mingguan kami
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>{quiz.title}</span>
            </CardTitle>
            <CardDescription>
              Week {quiz.week} • {quiz.questions.length} pertanyaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {quiz.time_limit_minutes} menit waktu pengerjaan
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {quiz.questions.length} pertanyaan
                  </span>
                </div>
              </div>

              {quiz.scoring.result && (
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4" />
                    <span className="text-sm font-medium">Hasil Sebelumnya:</span>
                  </div>
                  <Badge variant={getStatusColor(quiz.scoring.result.status)}>
                    {quiz.scoring.result.status} ({quiz.scoring.result.score}%)
                  </Badge>
                </div>
              )}

              <div className="flex space-x-2">
                <Button 
                  onClick={startQuiz} 
                  className="flex-1"
                  disabled={hasAttempted}
                >
                  <Play className="h-4 w-4 mr-2" />
                  {hasAttempted ? "Sudah Dikerjakan" : "Mulai Kuis"}
                </Button>
              </div>

              {hasAttempted && (
                <Alert>
                  <AlertDescription>
                    Kuis ini hanya dapat dikerjakan satu kali. Anda telah menyelesaikan kuis ini dengan skor {quiz.scoring.result?.score}%.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Kuis Selesai!
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Berikut adalah hasil Anda untuk {quiz.title}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Hasil Kuis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {quiz.scoring.result?.score || 0}%
                </div>
                <Badge variant={getStatusColor(quiz.scoring.result?.status || "")} className="text-lg px-4 py-2">
                  {quiz.scoring.result?.status || "Belum Dinilai"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pertanyaan Dijawab:</span>
                  <span>{Object.keys(selectedAnswers).length}/{quiz.questions.length}</span>
                </div>
                <Progress 
                  value={(Object.keys(selectedAnswers).length / quiz.questions.length) * 100} 
                  className="h-2"
                />
              </div>

              <Alert>
                <AlertDescription>
                  {quiz.scoring.result?.status === "Lulus" 
                    ? "Selamat! Anda telah lulus kuis. Teruskan pekerjaan yang baik!"
                    : "Jangan khawatir! Pelajari materi lagi untuk meningkatkan skor Anda."
                  }
                </AlertDescription>
              </Alert>

              <div className="text-center text-sm text-slate-500">
                Kuis ini hanya dapat dikerjakan satu kali dan tidak dapat diulangi.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          {quiz.title}
        </h2>
        <div className="flex items-center space-x-2 text-sm">
          <Clock className="h-4 w-4" />
          <span className={timeRemaining < 60 ? "text-red-500 font-medium" : ""}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Pertanyaan {currentQuestion + 1} dari {quiz.questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedAnswers[currentQ.id] || ""}
            onValueChange={(value) => handleAnswerSelect(currentQ.id, value)}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Sebelumnya
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={!selectedAnswers[currentQ.id]}
            >
              {currentQuestion === quiz.questions.length - 1 ? "Selesaikan Kuis" : "Berikutnya"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}