'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { lmsApi, ProductKnowledge } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import DOMPurify from 'isomorphic-dompurify'

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
      } catch {
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
    if (!product) return

    const res = await fetch(`/api/products/${product.id}/pdf`)
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${product.product_name}-specs.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()

    toast({
      title: "Download started",
      description: "Your PDF is being prepared.",
    })
  }


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Content */}
        <div className="lg:col-span-2 space-y-5">

          {/* Image */}
          <Card className="overflow-hidden shadow-sm">
            <div className="w-full bg-gray-200 dark:bg-gray-800">
              <img
                src={product.image}
                alt={product.product_name}
                className="w-full h-[360px] object-cover rounded-md"
              />
            </div>
          </Card>

          {/* Product Summary */}
          <Card className="shadow-sm">
            <CardContent className="p-5 space-y-3">
              <h1
                className="text-2xl font-bold leading-tight"
                dangerouslySetInnerHTML={{ __html: product.product_name }}
              />

              <p
                className="text-sm text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: product.summary }}
              />
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Key Features</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.features?.map((f: any, i: number) => (
                <div
                  key={i}
                  className="border rounded-md p-3 bg-white dark:bg-gray-800"
                >
                  <h3 className="font-medium text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {f.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

      

        </div>


        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-6 h-fit">

                  {/* Specs */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Technical Specifications</CardTitle>
            </CardHeader>

            <CardContent className="text-sm">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.spesification),
                }}
              />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Product Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF Specs
              </Button>
            </CardContent>
          </Card>

        </div>

      </main>
    </div>
  )
}
