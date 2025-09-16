"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Calendar, Eye } from "lucide-react"

interface ProductTraining {
  id: number
  title: string
  type: string
  date: string
  topic: string
  location: string
  image: string
  description: string
}

interface TrainingSectionProps {
  trainings: ProductTraining[]
  onViewDetails?: (trainingId: number) => void
}

export function TrainingSection({ trainings, onViewDetails }: TrainingSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const getTypeColor = (type: string) => {
    return type === "offline" ? "secondary" : "default"
  }

  if (trainings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          Tidak Ada Pelatihan Tersedia
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Saat ini tidak ada pelatihan yang tersedia.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Program Pelatihan
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Tingkatkan skill Anda dengan program pelatihan komprehensif kami
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trainings.map((training) => (
          <Card key={training.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700">
            <div className="aspect-video bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <img
                src={training.image}
                alt={training.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg line-clamp-2">{training.title}</CardTitle>
                <Badge variant={getTypeColor(training.type)} className="ml-2 flex-shrink-0">
                  {training.type}
                </Badge>
              </div>
              <CardDescription className="line-clamp-3 text-sm">
                {training.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {formatDate(training.date)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{training.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{training.topic}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onViewDetails?.(training.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Lihat Detail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}