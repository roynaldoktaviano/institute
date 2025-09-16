"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardNavigation } from "@/components/lms/DashboardNavigation"
import { QuizSection } from "@/components/lms/QuizSection"
import { Loader2 } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  username: string
  displayName: string
  roles: string[]
  avatar_urls?: {
    [key: string]: string
  }
  bio?: string
  phone?: string
  location?: string
  company?: string
  joinDate?: string
}

interface WeeklyQuiz {
  id: number
  week: number
  title: string
  time_limit_minutes: number
  questions: Array<{
    id: number
    question: string
    options: string[]
    answer_type: string
  }>
  scoring: {
    show_correct_answer: boolean
    result: {
      score: number
      status: string
    }
  }
}

export default function QuizPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedQuiz, setSelectedQuiz] = useState<WeeklyQuiz | null>(null)

  // Mock data for multiple quizzes
  const allQuizzes: WeeklyQuiz[] = [
    {
      id: 1,
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
          answer_type: "multiple_choice"
        },
        {
          id: 2,
          question: "Komponen apa yang paling penting untuk stabilitas drone?",
          options: [
            "Kamera",
            "GPS",
            "Gimbal",
            "Baterai"
          ],
          answer_type: "multiple_choice"
        }
      ],
      scoring: {
        show_correct_answer: false,
        result: {
          score: 80,
          status: "Lulus"
        }
      }
    },
    {
      id: 2,
      week: 2,
      title: "Quiz Teknik Fotografi Drone",
      time_limit_minutes: 25,
      questions: [
        {
          id: 1,
          question: "Setting aperture yang disarankan untuk landscape photography dengan drone?",
          options: [
            "f/2.8",
            "f/5.6",
            "f/8",
            "f/16"
          ],
          answer_type: "multiple_choice"
        },
        {
          id: 2,
          question: "Waktu terbaik untuk aerial photography adalah?",
          options: [
            "Siang hari terik",
            "Golden hour",
            "Malam hari",
            "Hujan deras"
          ],
          answer_type: "multiple_choice"
        }
      ],
      scoring: {
        show_correct_answer: false,
        result: {
          score: 90,
          status: "Lulus"
        }
      }
    },
    {
      id: 3,
      week: 3,
      title: "Quiz Safety & Regulations",
      time_limit_minutes: 30,
      questions: [
        {
          id: 1,
          question: "Ketinggian maksimal terbang drone di area pemukiman menurut regulasi?",
          options: [
            "90 meter",
            "150 meter",
            "200 meter",
            "300 meter"
          ],
          answer_type: "multiple_choice"
        },
        {
          id: 2,
          question: "Dokumen yang diperlukan untuk operasional drone komersial?",
          options: [
            "SIM saja",
            "Sertifikat registrasi drone",
            "Izin operasional",
            "Semua jawaban benar"
          ],
          answer_type: "multiple_choice"
        }
      ],
      scoring: {
        show_correct_answer: false,
        result: {
          score: 70,
          status: "Lulus"
        }
      }
    }
  ]

  useEffect(() => {
    const token = localStorage.getItem("lms_token")
    const userData = localStorage.getItem("lms_user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser({
        ...parsedUser,
        id: 12,
        name: parsedUser.displayName,
        roles: ["subscriber"],
        joinDate: "2024-01-15"
      })
    } catch (err) {
      setError("Failed to load user data")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleStartQuiz = () => {
    console.log("Quiz started")
  }

  const handleQuizSelect = (quiz: WeeklyQuiz) => {
    setSelectedQuiz(quiz)
  }

  const handleBackToList = () => {
    setSelectedQuiz(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600 dark:text-slate-400">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {user && (
        <DashboardNavigation
          user={{
            displayName: user.displayName,
            email: user.email,
            avatar: user.avatar_urls?.["96"]
          }}
          activeTab="quiz"
          onTabChange={(tab) => {
            if (tab === "dashboard") {
              router.push("/dashboard")
            } else if (tab === "training") {
              router.push("/training")
            } else if (tab === "knowledge") {
              router.push("/products")
            } else if (tab === "profile") {
              router.push("/dashboard?tab=profile")
            } else if (tab === "settings") {
              router.push("/dashboard?tab=settings")
            } else {
              // Stay on quiz page
            }
          }}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedQuiz ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                All Quizzes
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Test your knowledge with our comprehensive quiz collection
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border hover:shadow-lg transition-all duration-200 cursor-pointer p-6"
                  onClick={() => handleQuizSelect(quiz)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {quiz.title}
                    </h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Week {quiz.week}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Questions:</span>
                      <span className="ml-2">{quiz.questions.length}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Time Limit:</span>
                      <span className="ml-2">{quiz.time_limit_minutes} minutes</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        quiz.scoring.result.status === "Lulus" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}>
                        {quiz.scoring.result.status} ({quiz.scoring.result.score}%)
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-primary text-primary-foreground rounded-lg py-2 px-4 hover:bg-primary/90 transition-colors">
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={handleBackToList}
              className="mb-6 flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              ← Back to All Quizzes
            </button>
            
            <QuizSection
              quiz={selectedQuiz}
              onStartQuiz={handleStartQuiz}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 Learning Management System. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}