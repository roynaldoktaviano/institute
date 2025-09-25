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
        <header className="bg-[#31569A] py-2 rounded-b-xl dark:bg-gray-800 shadow-xs border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/logo-test.png"
                width={150}
                height={100}
                alt="Logo Test"
                className="h-10 w-auto"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4">
              {menus.map((menu) => (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${
                      pathname === menu.href
                        ? "bg-white text-black"
                        : "text-white hover:bg-white hover:text-black"
                    }`}
                >
                  {menu.name}
                </Link>
              ))}
            </nav>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-md p-2 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-white">
                      Hello, {user.name}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Navigation Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                 <SheetTitle className="hidden">Menu</SheetTitle>
                <SheetContent side="right" className="w-64 bg-[#31569A] text-white border-white/20">
                  <div className="flex flex-col space-y-4 mt-8">
                    <nav className="space-y-2 px-3 mt-3">
                      {menus.map((menu) => (
                        <Link
                          key={menu.href}
                          href={menu.href}
                          className={`block px-4 py-3 rounded-md text-sm font-medium transition-all
                            ${
                              pathname === menu.href
                                ? "bg-white text-black"
                                : "text-white hover:bg-white/10 hover:text-white"
                            }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {menu.name}
                        </Link>
                      ))}
                    </nav>
                    
                    <div className="border-t border-white/20 pt-4">
                      <div className="flex items-center space-x-3 px-4 py-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Hello, {user.name}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1 px-4">
                        <Link
                          href="/profile"
                          className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm hover:bg-white/10 transition-colors text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Mobile User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-md p-2 transition-colors hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Drone Product Knowledge
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Explore detailed information about the latest drone technology and specifications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow pt-0 pb-6 gap-2">
              <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.product_name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 mb-2"
                />
              </div>
              <CardHeader className='gap-0 mt-2'>
                <CardTitle className="text-lg">{product.product_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                    {product.summary}
                  </p>
                  
                  <div className="flex space-x-2">
                    <Link href={`/products/${product.id}`}>
                      <Button className="flex-1 cursor-pointer hover:bg-blue-800">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Lihat Detail
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <a 
                        href={product.pdf_download} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
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