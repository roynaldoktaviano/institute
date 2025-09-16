"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Package, ExternalLink, FileText, Image } from "lucide-react"

interface ProductKnowledge {
  id: number
  product_name: string
  summary: string
  image: string
  pdf_download: string
}

interface ProductKnowledgeSectionProps {
  products: ProductKnowledge[]
  onDownloadPDF?: (productId: number, pdfUrl: string) => void
  onViewProduct?: (productId: number) => void
}

export function ProductKnowledgeSection({ 
  products, 
  onDownloadPDF, 
  onViewProduct 
}: ProductKnowledgeSectionProps) {
  const handleDownload = (productId: number, pdfUrl: string) => {
    onDownloadPDF?.(productId, pdfUrl)
    // Fallback: open in new tab
    window.open(pdfUrl, '_blank')
  }

  const handleViewProduct = (productId: number) => {
    onViewProduct?.(productId)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          No Products Available
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          There are no product knowledge resources available at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Product Knowledge
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Explore our products and download detailed specifications
          </p>
        </div>
        <Badge variant="outline" className="hidden sm:flex">
          {products.length} Products
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
            {/* Product Image */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
              <img
                src={product.image}
                alt={product.product_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  // Fallback for broken images
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    const fallback = document.createElement('div')
                    fallback.className = 'w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700'
                    fallback.innerHTML = `
                      <div class="text-center">
                        <Image class="h-12 w-12 text-slate-400 mx-auto mb-2" />
                        <p class="text-sm text-slate-500">Image not available</p>
                      </div>
                    `
                    parent.appendChild(fallback)
                  }
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-white/90 dark:bg-slate-800/90">
                  <FileText className="h-3 w-3 mr-1" />
                  PDF Available
                </Badge>
              </div>
            </div>

            {/* Product Information */}
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {product.product_name}
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {product.summary}
              </CardDescription>
            </CardHeader>

            {/* Actions */}
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* Quick Info */}
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Spec Sheet
                  </span>
                  <Badge variant="outline" className="text-xs">
                    ID: {product.id}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewProduct(product.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDownload(product.id, product.pdf_download)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info Section */}
      <Card className="bg-slate-50 dark:bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                Available Resources
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Product specifications and technical details
                </li>
                <li className="flex items-center">
                  <Image className="h-4 w-4 mr-2" alt="" />
                  High-resolution product images
                </li>
                <li className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Downloadable PDF documentation
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">
                How to Use
              </h4>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Click "View Details" to see comprehensive product information</li>
                <li>• Download PDFs for offline reference</li>
                <li>• All resources are available in English and Indonesian</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}