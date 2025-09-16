'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BookOpen, 
  Search,
  Filter,
  ArrowLeft,
  User,
  LogOut,
  FileText,
  Download,
  Star,
  Weight,
  Battery
} from 'lucide-react'
import Link from 'next/link'

// Mock product data - in a real app, this would come from an API
const mockProductData = [
  {
    id: 1,
    product_name: "DJI Mavic 3",
    summary: "Drone lipat profesional dengan kamera Hasselblad.",
    image: "https://roynaldkalele.com/wp-content/uploads/mavic3.jpg",
    pdf_download: "https://roynaldkalele.com/wp-content/uploads/mavic3-specs.pdf",
    price: "$2,199",
    rating: 4.8,
    category: "Professional",
    weight: "895g",
    battery_life: "46 min",
    features: ["4/3 CMOS Sensor", "5.1K Video", "43min Flight Time", "O3+ Transmission"]
  },
  {
    id: 2,
    product_name: "DJI Mini 3 Pro",
    summary: "Drone compact dengan kamera profesional yang ringkas.",
    image: "https://roynaldkalele.com/wp-content/uploads/mini3pro.jpg",
    pdf_download: "https://roynaldkalele.com/wp-content/uploads/mini3pro-specs.pdf",
    price: "$759",
    rating: 4.6,
    category: "Consumer",
    weight: "249g",
    battery_life: "34 min",
    features: ["1/1.3-inch CMOS", "4K/60fps Video", "34min Flight Time", "Tri-directional Obstacle Sensing"]
  },
  {
    id: 3,
    product_name: "DJI Air 2S",
    summary: "Drone all-in-one dengan kamera 1-inch sensor.",
    image: "https://roynaldkalele.com/wp-content/uploads/air2s.jpg",
    pdf_download: "https://roynaldkalele.com/wp-content/uploads/air2s-specs.pdf",
    price: "$999",
    rating: 4.5,
    category: "Consumer",
    weight: "595g",
    battery_life: "31 min",
    features: ["1-inch CMOS Sensor", "5.4K Video", "31min Flight Time", "MasterShots"]
  },
  {
    id: 4,
    product_name: "DJI Phantom 4 Pro",
    summary: "Drone profesional untuk mapping dan survei.",
    image: "https://roynaldkalele.com/wp-content/uploads/phantom4pro.jpg",
    pdf_download: "https://roynaldkalele.com/wp-content/uploads/phantom4pro-specs.pdf",
    price: "$1,799",
    rating: 4.7,
    category: "Professional",
    weight: "1,388g",
    battery_life: "30 min",
    features: ["1-inch CMOS Sensor", "4K/60fps Video", "30min Flight Time", "5-direction Obstacle Avoidance"]
  },
  {
    id: 5,
    product_name: "DJI Inspire 2",
    summary: "Drone cinematography profesional dengan dual operator.",
    image: "https://roynaldkalele.com/wp-content/uploads/inspire2.jpg",
    pdf_download: "https://roynaldkalele.com/wp-content/uploads/inspire2-specs.pdf",
    price: "$2,999",
    rating: 4.9,
    category: "Cinematography",
    weight: "3,290g",
    battery_life: "27 min",
    features: ["Zenmuse X5S Camera", "5.2K CinemaDNG", "27min Flight Time", "Dual Operator Control"]
  },
  {
    id: 6,
    product_name: "DJI FPV",
    summary: "Drone FPV immersive experience dengan kamera 4K.",
    image: "https://roynaldkalele.com/wp-content/uploads/fpv.jpg",
    pdf_download: "https://roynaldkalele.com/wp-content/uploads/fpv-specs.pdf",
    price: "$1,299",
    rating: 4.4,
    category: "FPV",
    weight: "795g",
    battery_life: "20 min",
    features: ["4K/60fps Video", "150° FOV", "20min Flight Time", "Emergency Brake and Hover"]
  },
  {
    id: 7,
    product_name: "DJI Mini SE",
    summary: "Drone entry-level ringkas dan mudah digunakan.",
    image: "https://roynaldkalele.com/wp-content/uploads/minise.jpg",
    pdf_download: "https://roynaldkalele.com/wp-content/uploads/minise-specs.pdf",
    price: "$299",
    rating: 4.2,
    category: "Consumer",
    weight: "249g",
    battery_life: "30 min",
    features: ["2.7K Video", "30min Flight Time", "Return to Home", "Find My Drone"]
  },
  {
    id: 8,
    product_name: "DJI Mavic Air 2",
    summary: "Drone serbaguna dengan kamera 48MP.",
    image: "https://roynaldkalele.com/wp-content/uploads/mavicair2.jpg",
    pdf_download: "https://roynaldkalele.com/wp-content/uploads/mavicair2-specs.pdf",
    price: "$799",
    rating: 4.5,
    category: "Consumer",
    weight: "570g",
    battery_life: "34 min",
    features: ["48MP Camera", "4K/60fps Video", "34min Flight Time", "OcuSync 2.0"]
  }
]

export default function AllProductsPage() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  if (!user) {
    return null
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Professional': return 'bg-blue-100 text-blue-800'
      case 'Consumer': return 'bg-green-100 text-green-800'
      case 'Cinematography': return 'bg-purple-100 text-purple-800'
      case 'FPV': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter and sort product data
  const filteredProducts = mockProductData
    .filter(product => {
      const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.product_name.localeCompare(b.product_name)
      } else if (sortBy === 'price-low') {
        return parseInt(a.price.replace(/\D/g, '')) - parseInt(b.price.replace(/\D/g, ''))
      } else if (sortBy === 'price-high') {
        return parseInt(b.price.replace(/\D/g, '')) - parseInt(a.price.replace(/\D/g, ''))
      } else if (sortBy === 'rating') {
        return b.rating - a.rating
      } else if (sortBy === 'weight') {
        return parseInt(a.weight.replace(/\D/g, '')) - parseInt(b.weight.replace(/\D/g, ''))
      }
      return 0
    })

  const averageRating = filteredProducts.length > 0 
    ? (filteredProducts.reduce((sum, product) => sum + product.rating, 0) / filteredProducts.length).toFixed(1)
    : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">All Product Knowledge</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar_urls?.['96']} />
                  <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{filteredProducts.length}</p>
                    <p className="text-xs text-muted-foreground">Total Products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{averageRating}</p>
                    <p className="text-xs text-muted-foreground">Average Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{filteredProducts.length}</p>
                    <p className="text-xs text-muted-foreground">PDF Downloads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Professional">Professional</option>
                <option value="Consumer">Consumer</option>
                <option value="Cinematography">Cinematography</option>
                <option value="FPV">FPV</option>
              </select>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Sort by Rating</option>
                <option value="weight">Sort by Weight</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="card-hover hover:shadow-lg transition-all-300">
              <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-2 right-2 ${getCategoryColor(product.category)}`}>
                  {product.category}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.product_name}</CardTitle>
                    <CardDescription>{product.summary}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Weight className="w-3 h-3" />
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium">{product.weight}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Battery className="w-3 h-3" />
                        <span className="text-muted-foreground">Battery:</span>
                        <span className="font-medium">{product.battery_life}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="ml-1 font-medium text-lg">{product.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Key Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {product.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button variant="outline" className="w-full button-hover" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                    </Link>
                    <a href={product.pdf_download} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="button-hover">
                        <Download className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => { 
              setSearchTerm(''); 
              setFilterCategory('all'); 
              setSortBy('name');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}