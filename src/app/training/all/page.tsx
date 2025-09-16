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
  Calendar,
  MapPin,
  Search,
  Filter,
  ArrowLeft,
  User,
  LogOut
} from 'lucide-react'
import Link from 'next/link'

// Mock training data - in a real app, this would come from an API
const mockTrainingData = [
  {
    id: 1,
    title: "Drone Mapping Basic",
    type: "offline",
    date: "2025-09-20",
    topic: "Pengenalan Mapping Drone & Workflow",
    location: "Jakarta",
    image: "https://roynaldkalele.com/wp-content/uploads/training1.jpg",
    description: "Training dasar penggunaan drone untuk mapping skala kecil.",
    instructor: "Dr. Ahmad Wijaya",
    price: "Rp 2.500.000",
    maxParticipants: 20,
    duration: "2 hari"
  },
  {
    id: 2,
    title: "Advanced Drone Photography",
    type: "online",
    date: "2025-09-25",
    topic: "Teknik Fotografi Drone Tingkat Lanjut",
    location: "Online",
    image: "https://roynaldkalele.com/wp-content/uploads/training2.jpg",
    description: "Pelajari teknik fotografi drone profesional untuk hasil maksimal.",
    instructor: "Budi Santoso",
    price: "Rp 1.500.000",
    maxParticipants: 50,
    duration: "1 hari"
  },
  {
    id: 3,
    title: "Drone Maintenance Workshop",
    type: "offline",
    date: "2025-10-01",
    topic: "Perawatan dan Troubleshooting Drone",
    location: "Surabaya",
    image: "https://roynaldkalele.com/wp-content/uploads/training3.jpg",
    description: "Workshop intensif perawatan drone dan troubleshooting umum.",
    instructor: "Teknisi Drone Pro",
    price: "Rp 3.000.000",
    maxParticipants: 15,
    duration: "3 hari"
  },
  {
    id: 4,
    title: "Commercial Drone Operations",
    type: "hybrid",
    date: "2025-10-05",
    topic: "Operasional Drone Komersial",
    location: "Bandung",
    image: "https://roynaldkalele.com/wp-content/uploads/training4.jpg",
    description: "Pelatihan operasional drone untuk keperluan komersial.",
    instructor: "Ahmad Yani",
    price: "Rp 4.000.000",
    maxParticipants: 25,
    duration: "4 hari"
  },
  {
    id: 5,
    title: "Drone Cinematography Masterclass",
    type: "offline",
    date: "2025-10-10",
    topic: "Teknik Sinematografi Drone",
    location: "Bali",
    image: "https://roynaldkalele.com/wp-content/uploads/training5.jpg",
    description: "Masterclass teknik sinematografi drone untuk film profesional.",
    instructor: "Director Film",
    price: "Rp 5.000.000",
    maxParticipants: 12,
    duration: "5 hari"
  },
  {
    id: 6,
    title: "Drone Survey & Mapping Pro",
    type: "offline",
    date: "2025-10-15",
    topic: "Survey dan Pemetaan Profesional",
    location: "Yogyakarta",
    image: "https://roynaldkalele.com/wp-content/uploads/training6.jpg",
    description: "Training survey dan pemetaan menggunakan drone untuk proyek profesional.",
    instructor: "Surveyor Expert",
    price: "Rp 6.000.000",
    maxParticipants: 18,
    duration: "6 hari"
  }
]

export default function AllTrainingPage() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  if (!user) {
    return null
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'online': return 'bg-blue-100 text-blue-800'
      case 'offline': return 'bg-green-100 text-green-800'
      case 'hybrid': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter and sort training data
  const filteredTraining = mockTrainingData
    .filter(training => {
      const matchesSearch = training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           training.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || training.type === filterType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'price') {
        return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''))
      }
      return 0
    })

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
              <h1 className="text-xl font-semibold">All Training Programs</h1>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search training programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="all">All Types</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found {filteredTraining.length} training program{filteredTraining.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Training Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTraining.map((training) => (
            <Card key={training.id} className="card-hover hover:shadow-lg transition-all-300">
              <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                <img 
                  src={training.image} 
                  alt={training.title}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${getTypeColor(training.type)}`}>
                  {training.type}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{training.title}</CardTitle>
                <CardDescription>{training.topic}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(training.date).toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {training.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{training.price}</span>
                    <span className="text-xs">{training.duration}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm line-clamp-2">{training.description}</p>
                <div className="flex gap-2 mt-4">
                  <Link href={`/training/${training.id}`} className="flex-1">
                    <Button className="w-full button-hover" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTraining.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No training programs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => { setSearchTerm(''); setFilterType('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}