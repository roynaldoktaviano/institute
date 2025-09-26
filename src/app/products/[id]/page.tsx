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
import DOMPurify from 'isomorphic-dompurify';

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

  const handleDownload = async () => {
  if (!product) return;

  const res = await fetch(`/api/products/${product.id}/pdf`);
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${product.product_name}-specs.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  toast({
    title: "Download started",
    description: "The product specification PDF is being generated.",
  });
};

  function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
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
          <div id='product-detail' className="lg:col-span-2">
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
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  dangerouslySetInnerHTML={{ __html: product.product_name }}
                  >
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: product.summary }}>
                  </p>
                </div>

                <Separator className="my-6" />

                {/* Product Overview */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Product Overview</h2>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p
                    dangerouslySetInnerHTML={{ __html: product.description}}
                    >
                    </p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {product.features.map((f: any, i: number) => (
    <Card key={i}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="font-medium">{f.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {f.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

                </div>

                {/* Technical Specifications */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Technical Specifications</h2>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                    <div
                    className="prose max-w-none grid grid-cols-2 gap-[45px]"
      dangerouslySetInnerHTML={{
        
        __html: DOMPurify.sanitize(product.spesification),
      }}
    />
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
                    className="w-full cursor-pointer" 
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF Specs
                  </Button>
                </CardContent>
              </Card>

           

           
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}