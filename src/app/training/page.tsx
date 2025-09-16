"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardNavigation } from "@/components/lms/DashboardNavigation"
import { TrainingSection } from "@/components/lms/TrainingSection"
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

export default function TrainingPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [trainings, setTrainings] = useState<ProductTraining[]>([]);

  // Mock data for training programs
  // const productsTraining: ProductTraining[] = [
  //   {
  //     id: 1,
  //     title: "Drone Mapping Basic",
  //     type: "offline",
  //     date: "2025-09-20",
  //     topic: "Pengenalan Mapping Drone & Workflow",
  //     location: "Jakarta",
  //     image: "https://roynaldkalele.com/wp-content/uploads/training1.jpg",
  //     description: "Training dasar penggunaan drone untuk mapping skala kecil."
  //   },
  //   {
  //     id: 2,
  //     title: "Advanced Drone Photography",
  //     type: "online",
  //     date: "2025-09-25",
  //     topic: "Teknik Fotografi Drone Profesional",
  //     location: "Online",
  //     image: "https://roynaldkalele.com/wp-content/uploads/training2.jpg",
  //     description: "Pelajari teknik fotografi drone tingkat lanjut untuk hasil yang profesional."
  //   },
  //   {
  //     id: 3,
  //     title: "Drone Cinematography Masterclass",
  //     type: "offline",
  //     date: "2025-10-01",
  //     topic: "Membuat Film Cinematic dengan Drone",
  //     location: "Bali",
  //     image: "https://roynaldkalele.com/wp-content/uploads/training3.jpg",
  //     description: "Masterclass untuk membuat video cinematic profesional menggunakan drone."
  //   },
  //   {
  //     id: 4,
  //     title: "Drone Maintenance & Repair",
  //     type: "offline",
  //     date: "2025-10-05",
  //     topic: "Perawatan dan Perbaikan Drone",
  //     location: "Surabaya",
  //     image: "https://roynaldkalele.com/wp-content/uploads/training4.jpg",
  //     description: "Pelajari teknik perawatan dan perbaikan drone untuk menjaga performa optimal."
  //   },
  //   {
  //     id: 5,
  //     title: "Commercial Drone Operations",
  //     type: "online",
  //     date: "2025-10-10",
  //     topic: "Operasional Drone Komersial",
  //     location: "Online",
  //     image: "https://roynaldkalele.com/wp-content/uploads/training5.jpg",
  //     description: "Panduan lengkap untuk menjalankan bisnis drone komersial yang sukses."
  //   },
  //   {
  //     id: 6,
  //     title: "Drone Survey & Mapping Pro",
  //     type: "offline",
  //     date: "2025-10-15",
  //     topic: "Survey dan Pemetaan Drone Profesional",
  //     location: "Bandung",
  //     image: "https://roynaldkalele.com/wp-content/uploads/training6.jpg",
  //     description: "Teknik survey dan pemetaan tingkat profesional untuk berbagai industri."
  //   }
  // ]

   useEffect(() => {
    async function fetchTrainings() {
      try {
        const res = await fetch("https://roynaldkalele.com/wp-json/wp/v2/traning");
        const data = await res.json();

        // mapping supaya sesuai dengan ProductTraining
        const mapped = data.map((item: any) => ({
          id: item.id,
          title: item.title.rendered,
          type: item.acf?.jenis_training || "offline", 
          date: item.acf?.tanggal_dan_waktu || "",
          topic: item.acf?.kategori_training || "",
          location: item.acf?.kota || "",
          image: item.featured_media_url || "https://via.placeholder.com/400",
          description: item.acf?.isi_detail_training || "",
        }));

        setTrainings(mapped);
      } catch (err) {
        console.error("Gagal fetch trainings:", err);
      }
    }

    fetchTrainings();
  }, []);

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

  const handleViewTrainingDetails = (trainingId: number) => {
    console.log("View training details:", trainingId)
    // Implement training details view logic
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600 dark:text-slate-400">Loading training programs...</p>
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
          activeTab="training"
          onTabChange={(tab) => {
            if (tab === "dashboard") {
              router.push("/dashboard")
            } else if (tab === "quiz") {
              router.push("/quiz")
            } else if (tab === "knowledge") {
              router.push("/products")
            } else if (tab === "profile") {
              router.push("/dashboard?tab=profile")
            } else if (tab === "settings") {
              router.push("/dashboard?tab=settings")
            } else {
              // Stay on training page
            }
          }}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrainingSection
          trainings={trainings}
          onViewDetails={handleViewTrainingDetails}
        />
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