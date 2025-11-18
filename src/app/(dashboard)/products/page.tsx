'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, ProductKnowledge } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, ArrowLeft, BookOpen, LogOut, Menu,User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import Image from 'next/image'
import { Sheet, SheetTrigger, SheetTitle, SheetContent } from '@/components/ui/sheet'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu'

export default function ProductsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<ProductKnowledge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
        const menus = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Trainings", href: "/trainings" },
        { name: "Quizzes", href: "/quizzes" },
        { name: "Products", href: "/products" },
        // { name: "Profile", href: "/profile" },
      ];
  
      const handleLogout = () => {
      logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      router.push("/");
    };

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const loadProducts = async () => {
      try {
        const data = await lmsApi.getProductKnowledge()
        setProducts(data)
      } catch (error) {
        toast({
          title: "Error loading products",
          description: "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [user, router, toast])

  if (!user) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Drone Product Knowledge
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore detailed information about the latest drone technology and specifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
  key={product.id}
  className="flex flex-col rounded-xl overflow-hidden border hover:shadow-xl transition-shadow bg-white"
>
  {/* IMAGE */}
  <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
    <img
      src={product.image}
      alt={product.product_name}
      className="w-4/5 h-auto object-contain transition-transform duration-300 hover:scale-105"
    />
  </div>

  {/* CONTENT */}
  <div className="flex flex-col flex-1 p-4">
    {/* TITLE */}
    <h3
      className="text-lg font-semibold line-clamp-2 min-h-[3.3em]"
      dangerouslySetInnerHTML={{ __html: product.product_name }}
    />

    {/* SPACER agar tombol tetap di bawah */}
    <div className="flex-1" />

    {/* BUTTON SECTION */}
    <div className="mt-4 flex items-center gap-2">
      <Link href={`/products/${product.id}`} className="flex-1">
        <Button className="w-full hover:bg-blue-800">
          <BookOpen className="h-4 w-4 mr-2" />
          Lihat Detail
        </Button>
      </Link>

      <Button variant="outline" size="sm" asChild>
        <a
          href={product.pdf_download}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <Download className="h-4 w-4" />
        </a>
      </Button>
    </div>
  </div>
</Card>

          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new product knowledge articles.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}