"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardNavigation } from "@/components/lms/DashboardNavigation"
import { ProductKnowledgeSection } from "@/components/lms/ProductKnowledgeSection"
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
}

interface ProductKnowledge {
  id: number
  product_name: string
  summary: string
  image: string
  pdf_download: string
  category: string
  price?: string
  features?: string[]
  specifications?: {
    [key: string]: string
  }
}

export default function KnowledgePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Data product knowledge lengkap
  const productKnowledge: ProductKnowledge[] = [
    {
      id: 1,
      product_name: "DJI Mavic 3",
      summary: "Drone lipat profesional dengan kamera Hasselblad 4/3 CMOS 20MP, waktu terbang 46 menit, dan omni-directional obstacle sensing.",
      image: "https://roynaldkalele.com/wp-content/uploads/mavic3.jpg",
      pdf_download: "https://roynaldkalele.com/wp-content/uploads/mavic3-specs.pdf",
      category: "Professional Drone",
      price: "$2,199",
      features: [
        "Kamera Hasselblad 4/3 CMOS 20MP",
        "Waktu terbang 46 menit",
        "Omni-directional obstacle sensing",
        "4K/60fps video recording",
        "10-bit D-Log color profile"
      ],
      specifications: {
        "Berat": "895g",
        "Range Transmisi": "15 km",
        "Max Flight Time": "46 menit",
        "Max Speed": "21 m/s",
        "Sensor": "4/3 CMOS",
        "Video Resolution": "5.1K/50fps"
      }
    },
    {
      id: 2,
      product_name: "DJI Mini 3 Pro",
      summary: "Drone mini dengan kamera profesional di bawah 249g, perfect untuk pemula dan content creator.",
      image: "https://roynaldkalele.com/wp-content/uploads/mini3pro.jpg",
      pdf_download: "https://roynaldkalele.com/wp-content/uploads/mini3pro-specs.pdf",
      category: "Consumer Drone",
      price: "$759",
      features: [
        "Di bawah 249g (no registration needed)",
        "Kamera 1/1.3-inch CMOS 48MP",
        "Tri-directional obstacle sensing",
        "4K/60fps HDR video",
        "Vertical shooting"
      ],
      specifications: {
        "Berat": "249g",
        "Range Transmisi": "12 km",
        "Max Flight Time": "34 menit",
        "Max Speed": "16 m/s",
        "Sensor": "1/1.3-inch CMOS",
        "Video Resolution": "4K/60fps"
      }
    },
    {
      id: 3,
      product_name: "DJI Air 3",
      summary: "Drone all-in-one dengan dual camera system, perfect untuk aerial photography dan videography.",
      image: "https://roynaldkalele.com/wp-content/uploads/air3.jpg",
      pdf_download: "https://roynaldkalele.com/wp-content/uploads/air3-specs.pdf",
      category: "Hybrid Drone",
      price: "$1,099",
      features: [
        "Dual primary camera system",
        "Wide-angle 24mm & medium tele 70mm",
        "Waktu terbang 46 menit",
        "Omni-directional obstacle sensing",
        "O4 HD video transmission"
      ],
      specifications: {
        "Berat": "720g",
        "Range Transmisi": "20 km",
        "Max Flight Time": "46 menit",
        "Max Speed": "21 m/s",
        "Sensor 1": "1/1.3-inch CMOS",
        "Sensor 2": "1/1.3-inch CMOS"
      }
    },
    {
      id: 4,
      product_name: "DJI Avata",
      summary: "Drone FPV cinewhoop yang compact dan powerful untuk immersive flight experience.",
      image: "https://roynaldkalele.com/wp-content/uploads/avata.jpg",
      pdf_download: "https://roynaldkalele.com/wp-content/uploads/avata-specs.pdf",
      category: "FPV Drone",
      price: "$629",
      features: [
        "Propeller guard built-in",
        "155° super-wide FOV",
        "RockSteady 2.0 & HorizonSteady",
        "4K/60fps slow motion",
        "Turtle mode for recovery"
      ],
      specifications: {
        "Berat": "410g",
        "Range Transmisi": "10 km",
        "Max Flight Time": "18 menit",
        "Max Speed": "18 m/s",
        "Sensor": "1/1.7-inch CMOS",
        "Video Resolution": "4K/60fps"
      }
    },
    {
      id: 5,
      product_name: "DJI Mavic 3 Enterprise Series",
      summary: "Drone enterprise-grade untuk industrial applications dengan berbagai payload options.",
      image: "https://roynaldkalele.com/wp-content/uploads/mavic3-enterprise.jpg",
      pdf_download: "https://roynaldkalele.com/wp-content/uploads/mavic3-enterprise-specs.pdf",
      category: "Enterprise Drone",
      price: "$3,199",
      features: [
        "Mechanical shutter & wide camera",
        "RTK module for centimeter accuracy",
        "Multiple payload options",
        "O3 Enterprise transmission",
        "IP55 weather resistance"
      ],
      specifications: {
        "Berat": "920g",
        "Range Transmisi": "15 km",
        "Max Flight Time": "41 menit",
        "Max Speed": "21 m/s",
        "Sensor": "4/3 CMOS",
        "Video Resolution": "5.1K/50fps"
      }
    },
    {
      id: 6,
      product_name: "DJI Mini 4 Pro",
      summary: "Drone mini terbaru dengan full-direction obstacle sensing dan professional imaging capabilities.",
      image: "https://roynaldkalele.com/wp-content/uploads/mini4pro.jpg",
      pdf_download: "https://roynaldkalele.com/wp-content/uploads/mini4pro-specs.pdf",
      category: "Consumer Drone",
      price: "$579",
      features: [
        "Full-direction obstacle sensing",
        "4K/60fps HDR video",
        "10-bit D-Log M color",
        "Waypoint 3.0",
        "Advanced RTH"
      ],
      specifications: {
        "Berat": "249g",
        "Range Transmisi": "20 km",
        "Max Flight Time": "34 menit",
        "Max Speed": "16 m/s",
        "Sensor": "1/1.3-inch CMOS",
        "Video Resolution": "4K/60fps"
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

  const handleDownloadPDF = (productId: number, pdfUrl: string) => {
    console.log("Downloading PDF for product:", productId, pdfUrl)
    // Implement PDF download logic
    window.open(pdfUrl, '_blank')
  }

  const handleViewProduct = (productId: number) => {
    console.log("Viewing product:", productId)
    // Implement product view logic
    // Bisa redirect ke halaman detail product
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-slate-600 dark:text-slate-400">Loading product knowledge...</p>
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
          activeTab="knowledge"
          onTabChange={(tab) => {
            if (tab === "training") router.push("/training")
            else if (tab === "quiz") router.push("/quiz")
            else if (tab === "profile") router.push("/dashboard?tab=profile")
            else if (tab === "settings") router.push("/dashboard?tab=settings")
            else router.push("/dashboard")
          }}
        />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Product Knowledge
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Jelajahi produk drone dan download spesifikasi lengkap
          </p>
        </div>

        <ProductKnowledgeSection
          products={productKnowledge}
          onDownloadPDF={handleDownloadPDF}
          onViewProduct={handleViewProduct}
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