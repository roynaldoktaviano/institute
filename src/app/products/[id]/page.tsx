'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, ProductKnowledge } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Download, ArrowLeft, BookOpen, Share2, Heart, Camera, Battery, Wifi, HardDrive } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

export default function ProductDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [product, setProduct] = useState<ProductKnowledge | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const productId = parseInt(params.id as string)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const loadProduct = async () => {
      try {
        const products = await lmsApi.getProductKnowledge()
        const foundProduct = products.find(p => p.id === productId)
        
        if (!foundProduct) {
          toast({
            title: "Product not found",
            description: "The requested product could not be found.",
            variant: "destructive",
          })
          router.push('/products')
          return
        }
        
        setProduct(foundProduct)
      } catch (error) {
        toast({
          title: "Error loading product",
          description: "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [user, router, toast, productId])

  const handleDownload = () => {
    if (product) {
      window.open(product.pdf_download, '_blank')
      toast({
        title: "Download started",
        description: "The product specification PDF is being downloaded.",
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
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
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
              <Link href="/products">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Details</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-square bg-gray-200">
                <img 
                  src={product.image} 
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.product_name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {product.summary}
                  </p>
                </div>

                <Separator className="my-6" />

                {/* Product Overview */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Product Overview</h2>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p>
                      The {product.product_name} represents the pinnacle of drone technology, combining cutting-edge innovation with user-friendly design. This professional-grade drone is engineered for photographers, videographers, and industrial applications who demand uncompromising quality and reliability.
                    </p>
                    <p>
                      With advanced flight controls, superior camera systems, and intelligent features, this drone sets new standards in aerial imaging and data collection. Whether you're capturing cinematic footage or conducting professional surveys, this device delivers exceptional performance in every scenario.
                    </p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Camera className="h-8 w-8 text-blue-500" />
                          <div>
                            <h3 className="font-medium">Professional Camera</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              High-resolution imaging with advanced stabilization
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Battery className="h-8 w-8 text-green-500" />
                          <div>
                            <h3 className="font-medium">Extended Flight Time</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Long-lasting battery for extended operations
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Wifi className="h-8 w-8 text-purple-500" />
                          <div>
                            <h3 className="font-medium">Advanced Connectivity</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Reliable transmission over long distances
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <HardDrive className="h-8 w-8 text-orange-500" />
                          <div>
                            <h3 className="font-medium">Smart Storage</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Ample storage for all your media files
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-3">Camera System</h3>
                        <ul className="space-y-2 text-sm">
                          <li><strong>Sensor:</strong> 4/3" CMOS</li>
                          <li><strong>Resolution:</strong> 20MP</li>
                          <li><strong>Video:</strong> 5.4K at 30fps</li>
                          <li><strong>Stabilization:</strong> 3-axis mechanical</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Flight Performance</h3>
                        <ul className="space-y-2 text-sm">
                          <li><strong>Max Flight Time:</strong> 46 minutes</li>
                          <li><strong>Max Range:</strong> 30 km</li>
                          <li><strong>Max Speed:</strong> 21 m/s</li>
                          <li><strong>Wind Resistance:</strong> 12 m/s</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Physical Specifications</h3>
                        <ul className="space-y-2 text-sm">
                          <li><strong>Weight:</strong> 895g</li>
                          <li><strong>Dimensions:</strong> 221×96.3×90.3 mm</li>
                          <li><strong>Folded:</strong> 180×97×77 mm</li>
                          <li><strong>Material:</strong> Magnesium alloy</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3">Battery & Charging</h3>
                        <ul className="space-y-2 text-sm">
                          <li><strong>Capacity:</strong> 5000 mAh</li>
                          <li><strong>Voltage:</strong> 15.4 V</li>
                          <li><strong>Charging Time:</strong> 90 minutes</li>
                          <li><strong>Battery Type:</strong> LiPo 4S</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applications */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Applications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Badge variant="outline" className="mb-2">Photography</Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Professional aerial photography and cinematography
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Badge variant="outline" className="mb-2">Mapping</Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          High-precision surveying and mapping applications
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Badge variant="outline" className="mb-2">Inspection</Badge>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Infrastructure and industrial inspection
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Actions Card */}
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Product Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full" 
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Specs
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Product
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Favorites
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Product ID</span>
                    <p className="text-sm">#{product.id.toString().padStart(4, '0')}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <p className="text-sm">Professional Drone</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Availability</span>
                    <Badge variant="default" className="text-xs">In Stock</Badge>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-500">Last Updated</span>
                    <p className="text-sm">{new Date().toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Related Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Related Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                        <img 
                          src="https://roynaldkalele.com/wp-content/uploads/mini3pro.jpg" 
                          alt="Related product"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">DJI Mini 3 Pro</h4>
                        <p className="text-xs text-gray-500">Lightweight drone</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                        <img 
                          src="https://roynaldkalele.com/wp-content/uploads/air2s.jpg" 
                          alt="Related product"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">DJI Air 2S</h4>
                        <p className="text-xs text-gray-500">All-in-one drone</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}