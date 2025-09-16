'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, Training } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { parse, format } from "date-fns";

export default function TrainingDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [training, setTraining] = useState<Training | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasParticipated, setHasParticipated] = useState(false)

  const trainingId = parseInt(params.id as string)


  function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}
function formatTrainingDate(dateStr: string) {
  // API: "28/09/2025 4:00 pm"
  const parsed = parse(dateStr, "dd/MM/yyyy h:mm a", new Date());
  return format(parsed, "dd MMMM yyyy - hh.mm aaaa");
}

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const loadTraining = async () => {
      try {
        const trainings = await lmsApi.getTrainings()
        const foundTraining = trainings.find(t => t.id === trainingId)
        
        if (!foundTraining) {
          toast({
            title: "Training not found",
            description: "The requested training could not be found.",
            variant: "destructive",
          })
          router.push('/trainings')
          return
        }
        
        setTraining(foundTraining)
        
        // Check if user has participated in this training
        const participations = await lmsApi.getTrainingParticipations()
        setHasParticipated(participations.some(p => p.training_id === trainingId))
      } catch (error) {
        toast({
          title: "Error loading training",
          description: "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTraining()
  }, [user, router, toast, trainingId])

  const handleParticipate = async () => {
    try {
      await lmsApi.participateInTraining(trainingId)
      setHasParticipated(true)
      toast({
        title: "Participation confirmed",
        description: "You have successfully registered for this training.",
      })
    } catch (error) {
      toast({
        title: "Error registering",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading training details...</p>
        </div>
      </div>
    )
  }

  if (!training) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Training not found</h1>
          <Link href="/trainings">
            <Button>Back to Trainings</Button>
          </Link>
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
              <Link href="/trainings">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Trainings
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training Details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <img 
                  src={training.image} 
                  alt={training.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {training.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {training.topic}
                    </p>
                  </div>
                  <Badge variant={training.type === 'online' ? 'default' : 'secondary'} className="text-sm">
                    {training.type}
                  </Badge>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h3 className="text-lg font-semibold mb-3">About this training</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {stripHtml(training.description)}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-3 mt-6">What you'll learn</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Fundamental concepts of drone operations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Safety protocols and best practices</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Hands-on practical experience</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Industry standards and regulations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Training Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">
                    {formatTrainingDate(training.date)}
                  </span>
                </div>
                
                {/* <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Duration:</span>
                  <span className="ml-2">8 hours</span>
                </div> */}
                
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{training.location}</span>
                </div>
{/*                 
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium">Capacity:</span>
                  <span className="ml-2">20 participants</span>
                </div>
                 */}
                <div className="pt-4 border-t">
                  {training.url === "" ? (
                    <div className="text-center">
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => window.open(training.url, "_blank")}
                    >
                      Lihat Training
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}