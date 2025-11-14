'use client';

import { useState } from 'react';
import './globals.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Menu, 
  X, 
  User, 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  Target,
  CheckCircle,
  Star,
  Plane,
  Camera,
  Navigation,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  ArrowRight,
  Play
} from 'lucide-react';

export default function DroneInstituteLMS() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
   <html>
    <body>
       <div className="min-h-screen bg-background mx-auto w-full max-w-[1600px]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-20">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-blue-900">Drone Institute</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-sm font-medium hover:text-blue-600 transition-colors">Home</a>
            <a href="#about" className="text-sm font-medium hover:text-blue-600 transition-colors">About</a>
            <a href="#courses" className="text-sm font-medium hover:text-blue-600 transition-colors">Courses</a>
            <a href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#contact" className="text-sm font-medium hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center space-x-4">
            {/* <Button variant="ghost" size="sm" className="hidden md:flex">
              Login
            </Button> */}
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              Log In
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container flex flex-col space-y-4 px-4 py-4">
              <a href="#home" className="text-sm font-medium hover:text-blue-600 transition-colors">Home</a>
              <a href="#about" className="text-sm font-medium hover:text-blue-600 transition-colors">About</a>
              <a href="#courses" className="text-sm font-medium hover:text-blue-600 transition-colors">Courses</a>
              <a href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-sm font-medium hover:text-blue-600 transition-colors">Contact</a>
              <div className="flex space-x-2 pt-2">
                <Button variant="ghost" size="sm" className="flex-1">Sign In</Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 lg:py-32 px-20">
        <div className="container px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* <Badge className="w-fit bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Award className="mr-2 h-4 w-4" />
                FAA Certified Training
              </Badge> */}
              <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
                Belajar Terbang Lebih Cerdas dengan
                <span className="text-blue-600"> Pelatihan Drone Terlengkap</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Tingkatkan skill menerbangkan drone dengan kurikulum modern yang dirancang untuk kebutuhan hobi, industri, hingga sertifikasi resmi. Akses pembelajaran kapan saja, dibimbing oleh instruktur berpengalaman.
              </p>
              {/* <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Begin Your Journey Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div> */}
              {/* <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4 text-blue-600" />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-blue-600" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4 text-blue-600" />
                  <span>FAA Approved</span>
                </div>
              </div> */}
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
                <div className="aspect-video bg-blue-200 rounded-lg flex items-center justify-center">
                  <Plane className="h-24 w-24 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-blue-50 px-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
              Why Choose Drone Institute?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of drone education with our cutting-edge platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Precision Training</CardTitle>
                <CardDescription>
                  Learn from industry experts with hands-on flight experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Aerial Photography</CardTitle>
                <CardDescription>
                  Master cinematic drone shots and professional photography techniques
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Navigation className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">GPS Navigation</CardTitle>
                <CardDescription>
                  Advanced navigation and autonomous flight control systems
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Safety First</CardTitle>
                <CardDescription>
                  Comprehensive safety protocols and emergency procedures
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Fast Track</CardTitle>
                <CardDescription>
                  Accelerated learning paths for quick certification
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Global Recognition</CardTitle>
                <CardDescription>
                  Internationally recognized certifications and credentials
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
              They are already flying high!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of successful drone pilots who started their journey with us
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">John Davis</CardTitle>
                    <CardDescription>Commercial Drone Pilot</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Drone Institute gave me the skills and confidence to start my own aerial photography business. 
                  The instructors are top-notch!"
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Sarah Martinez</CardTitle>
                    <CardDescription>Real Estate Photographer</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "The comprehensive curriculum and hands-on training helped me triple my income in just 6 months. 
                  Best investment I've made!"
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback>MW</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Mike Wilson</CardTitle>
                    <CardDescription>Inspection Specialist</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "From zero knowledge to FAA certified in 3 months! The platform is intuitive and the support 
                  team is always there to help."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-blue-50">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
              Choose Your Flight Path
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing plans designed for every aspiring drone pilot
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Starter</CardTitle>
                <div className="text-3xl font-bold text-blue-900">$29<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <CardDescription>Perfect for beginners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic Flight Training</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>10 Video Lessons</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Community Access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Mobile App Access</span>
                </div>
                <Button className="w-full" variant="outline">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-blue-500 border-2 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Professional</CardTitle>
                <div className="text-3xl font-bold text-blue-900">$75<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <CardDescription>For serious pilots</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Everything in Starter</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced Flight Maneuvers</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>FAA Test Preparation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>1-on-1 Mentorship</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Certificate of Completion</span>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Enterprise</CardTitle>
                <div className="text-3xl font-bold text-blue-900">$150<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <CardDescription>For teams and organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Everything in Professional</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Team Management</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Custom Training Programs</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>API Access</span>
                </div>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Story Highlight */}
      <section className="py-20">
        <div className="container px-4">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardContent className="p-12 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="bg-white/20 text-white mb-4 w-fit">Success Story</Badge>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                    How AeroVision tripled their revenue in a year!
                  </h2>
                  <p className="text-lg mb-8 text-blue-100">
                    "After completing the Professional program at Drone Institute, 
                    we expanded our services and saw a 300% increase in revenue. 
                    The training was comprehensive and immediately applicable."
                  </p>
                  <div className="flex items-center space-x-6 mb-8">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/api/placeholder/64/64" />
                      <AvatarFallback>AV</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-lg">AeroVision Solutions</div>
                      <div className="text-blue-200">Commercial Drone Services</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div>
                      <div className="text-3xl font-bold">300%</div>
                      <div className="text-blue-200">Revenue Growth</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">50+</div>
                      <div className="text-blue-200">Projects Completed</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold">12</div>
                      <div className="text-blue-200">Certified Pilots</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-2xl p-8">
                  <TrendingUp className="h-32 w-32 text-white/50 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Plane className="h-8 w-8" />
                <span className="text-xl font-bold">Drone Institute</span>
              </div>
              <p className="text-blue-200">
                Empowering the next generation of drone pilots with world-class education.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Certification</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Stay Connected</h3>
              <p className="text-blue-200 mb-4">
                Subscribe to get updates on new courses and special offers.
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-800 border border-blue-700 text-white placeholder-blue-300 focus:outline-none focus:border-blue-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2025 Drone Institute. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </body>
   </html>
  );
}