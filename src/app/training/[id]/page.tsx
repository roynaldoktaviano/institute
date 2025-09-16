'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft,
  Share2,
  Bookmark
} from 'lucide-react'
import Link from 'next/link'

// Mock training data - in a real app, this would come from an API
const trainingData = {
  1: {
    id: 1,
    title: "Drone Mapping Basic",
    type: "offline",
    date: "2025-09-20",
    topic: "Pengenalan Mapping Drone & Workflow",
    location: "Jakarta",
    image: "https://roynaldkalele.com/wp-content/uploads/training1.jpg",
    description: "Training dasar penggunaan drone untuk mapping skala kecil.",
    fullDescription: "Training ini dirancang untuk pemula yang ingin mempelajari dasar-dasar penggunaan drone untuk pemetaan area kecil. Peserta akan belajar tentang perencanaan misi, operasional drone, pengolahan data, dan pembuatan peta dasar menggunakan software khusus.",
    duration: "2 hari",
    maxParticipants: 20,
    price: "Rp 2.500.000",
    instructor: "Dr. Ahmad Wijaya",
    requirements: [
      "Drone dengan kamera (minimal 12MP)",
      "Laptop dengan spesifikasi minimal i5, 8GB RAM",
      "Software pemetaan (akan disediakan)",
      "Pengetahuan dasar fotografi"
    ],
    agenda: [
      {
        day: 1,
        sessions: [
          { time: "09:00-10:00", title: "Registrasi & Opening", description: "Pembukaan dan perkenalan peserta" },
          { time: "10:00-12:00", title: "Teori Drone Mapping", description: "Pengenalan konsep dasar mapping dengan drone" },
          { time: "12:00-13:00", title: "Istirahat", description: "Makan siang" },
          { time: "13:00-15:00", title: "Perencanaan Misi", description: "Membuat flight plan menggunakan software" },
          { time: "15:00-17:00", title: "Praktik Lapangan", description: "Penerbangan drone sesuai flight plan" }
        ]
      },
      {
        day: 2,
        sessions: [
          { time: "09:00-11:00", title: "Pengolahan Data", description: "Memproses hasil foto menjadi orthophoto" },
          { time: "11:00-12:00", title: "Analisis Hasil", description: "Evaluasi kualitas peta yang dihasilkan" },
          { time: "12:00-13:00", title: "Istirahat", description: "Makan siang" },
          { time: "13:00-15:00", title: "Export & Presentasi", description: "Mengexport hasil dan presentasi" },
          { time: "15:00-16:00", title: "Q&A & Closing", description: "Sesi tanya jawab dan penutupan" }
        ]
      }
    ]
  }
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

export default function TrainingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isBookmarked, setIsBookmarked] = useState(false)

  const trainingId = params.id as string
  const training = trainingData[trainingId as keyof typeof trainingData]

  if (!user) {
    router.push('/login')
    return null
  }

  if (!training) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Training Not Found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'online': return 'bg-blue-100 text-blue-800'
      case 'offline': return 'bg-green-100 text-green-800'
      case 'hybrid': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold">Training Details</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setIsBookmarked(!isBookmarked)}>
                <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img 
                src={training.image} 
                alt={training.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title and Basic Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getTypeColor(training.type)}>
                  {training.type}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Training ID: #{training.id}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{training.title}</h1>
              <p className="text-lg text-muted-foreground mb-4">{training.topic}</p>
              <p className="text-base leading-relaxed">{stripHtml(training.fullDescription)}</p>
            </div>

            {/* Agenda */}
            <Card>
              <CardHeader>
                <CardTitle>Training Agenda</CardTitle>
                <CardDescription>Detailed schedule for the training program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {training.agenda.map((day) => (
                    <div key={day.day}>
                      <h3 className="font-semibold text-lg mb-3">Day {day.day}</h3>
                      <div className="space-y-3">
                        {day.sessions.map((session, index) => (
                          <div key={index} className="flex gap-4 p-3 bg-muted rounded-lg">
                            <div className="flex-shrink-0 w-20 text-sm font-medium text-primary">
                              {session.time}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{session.title}</h4>
                              <p className="text-sm text-muted-foreground">{session.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>What you need to bring and prepare</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {training.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(training.date).toLocaleDateString('id-ID', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{training.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{training.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Max Participants</p>
                    <p className="text-sm text-muted-foreground">{training.maxParticipants} people</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
                    <span className="text-xs text-primary-foreground font-bold">Rp</span>
                  </div>
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">{training.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-semibold">
                      {training.instructor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{training.instructor}</p>
                    <p className="text-sm text-muted-foreground">Drone Mapping Expert</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" size="lg">
                Register Now
              </Button>
              <Button variant="outline" className="w-full">
                Contact Organizer
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}