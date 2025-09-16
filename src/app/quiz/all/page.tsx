'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BookOpen, 
  Clock,
  Search,
  Filter,
  ArrowLeft,
  User,
  LogOut,
  Play,
  Trophy,
  Target
} from 'lucide-react'
import Link from 'next/link'

// Mock quiz data - in a real app, this would come from an API
const mockQuizData = [
  {
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
      }
    ],
    scoring: {
      show_correct_answer: false,
      result: {
        score: 80,
        status: "Lulus"
      }
    },
    difficulty: "Easy",
    category: "Basic Knowledge"
  },
  {
    week: 2,
    title: "Quiz Drone Photography",
    time_limit_minutes: 25,
    questions: [
      {
        id: 1,
        question: "Setting kamera terbaik untuk landscape drone?",
        options: [
          "f/2.8, ISO 100, 1/1000s",
          "f/8, ISO 100, 1/500s",
          "f/16, ISO 200, 1/250s",
          "f/4, ISO 400, 1/2000s"
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
    },
    difficulty: "Medium",
    category: "Photography"
  },
  {
    week: 3,
    title: "Quiz Drone Safety",
    time_limit_minutes: 15,
    questions: [
      {
        id: 1,
        question: "Ketinggian maksimal drone di area perkotaan?",
        options: [
          "100 meter",
          "150 meter",
          "200 meter",
          "300 meter"
        ],
        answer_type: "multiple_choice"
      }
    ],
    scoring: {
      show_correct_answer: false,
      result: null
    },
    difficulty: "Easy",
    category: "Safety"
  },
  {
    week: 4,
    title: "Quiz Advanced Drone Operations",
    time_limit_minutes: 30,
    questions: [
      {
        id: 1,
        question: "Apa yang harus dilakukan saat drone kehilangan sinyal GPS?",
        options: [
          "Lanjutkan terbang manual",
          "Aktifkan return to home",
          "Cari area terbuka",
          "Matikan drone"
        ],
        answer_type: "multiple_choice"
      }
    ],
    scoring: {
      show_correct_answer: false,
      result: null
    },
    difficulty: "Hard",
    category: "Advanced Operations"
  },
  {
    week: 5,
    title: "Quiz Drone Regulations",
    time_limit_minutes: 20,
    questions: [
      {
        id: 1,
        question: "Dokumen yang diperlukan untuk operasional drone komersial?",
        options: [
          "Sertifikat pilot saja",
          "Izin operasional dan asuransi",
          "Hanya registrasi drone",
          "Tidak perlu dokumen"
        ],
        answer_type: "multiple_choice"
      }
    ],
    scoring: {
      show_correct_answer: false,
      result: null
    },
    difficulty: "Medium",
    category: "Regulations"
  },
  {
    week: 6,
    title: "Quiz Drone Maintenance",
    time_limit_minutes: 25,
    questions: [
      {
        id: 1,
        question: "Seberapa sering drone harus di-servis?",
        options: [
          "Setiap terbang",
          "Setiap 20 jam terbang",
          "Setiap 50 jam terbang",
          "Tidak perlu servis"
        ],
        answer_type: "multiple_choice"
      }
    ],
    scoring: {
      show_correct_answer: false,
      result: null
    },
    difficulty: "Medium",
    category: "Maintenance"
  }
]

export default function AllQuizPage() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  if (!user) {
    return null
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800'
    return status === 'Lulus' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  // Filter quiz data
  const filteredQuiz = mockQuizData.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || quiz.category === filterCategory
    const matchesDifficulty = filterDifficulty === 'all' || quiz.difficulty === filterDifficulty
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && quiz.scoring.result) ||
                         (filterStatus === 'pending' && !quiz.scoring.result)
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus
  })

  const completedQuizzes = mockQuizData.filter(quiz => quiz.scoring.result).length
  const totalQuizzes = mockQuizData.length
  const averageScore = completedQuizzes > 0 
    ? Math.round(mockQuizData.reduce((sum, quiz) => sum + (quiz.scoring.result?.score || 0), 0) / completedQuizzes)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">All Weekly Quizzes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar_urls?.['96']} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedQuizzes}/{totalQuizzes}</p>
                    <p className="text-xs text-muted-foreground">Quizzes Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{averageScore}%</p>
                    <p className="text-xs text-muted-foreground">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalQuizzes - completedQuizzes}</p>
                    <p className="text-xs text-muted-foreground">Pending Quizzes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Basic Knowledge">Basic Knowledge</option>
                <option value="Photography">Photography</option>
                <option value="Safety">Safety</option>
                <option value="Advanced Operations">Advanced Operations</option>
                <option value="Regulations">Regulations</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              <select 
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found {filteredQuiz.length} quiz{filteredQuiz.length !== 1 ? 'zes' : ''}
            </p>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuiz.map((quiz) => (
            <Card key={quiz.week} className="card-hover hover:shadow-lg transition-all-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      {quiz.title}
                    </CardTitle>
                    <CardDescription>
                      Week {quiz.week} • {quiz.time_limit_minutes} minutes
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                    {quiz.scoring.result && (
                      <Badge className={getStatusColor(quiz.scoring.result.status)}>
                        {quiz.scoring.result.status}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Questions:</span>
                        <span className="ml-1 font-medium">{quiz.questions.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <span className="ml-1 font-medium">{quiz.time_limit_minutes}m</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <span className="ml-1 font-medium">{quiz.category}</span>
                      </div>
                      {quiz.scoring.result && (
                        <div>
                          <span className="text-muted-foreground">Score:</span>
                          <span className="ml-1 font-medium">{quiz.scoring.result.score}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Link href={`/quiz/${quiz.week}`}>
                    <Button className="w-full button-hover" size="sm">
                      {quiz.scoring.result ? (
                        <>
                          <Trophy className="w-4 h-4 mr-2" />
                          Review Results
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Quiz
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuiz.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => { 
              setSearchTerm(''); 
              setFilterCategory('all'); 
              setFilterDifficulty('all'); 
              setFilterStatus('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}