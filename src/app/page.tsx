"use client";

import { useState } from "react";
import "./globals.css";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Play,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function DroneInstituteLMS() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    router.push("/login");
  };
  return (
    <html>
      <body>
        <div className="min-h-screen bg-background mx-auto w-full max-w-[1600px]">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-20">
            <div className="container grid grid-cols-3 h-16 items-center justify-between px-4">
              <div className="">
                <Image
                  src="/logo-biru.png"
                  width={1920}
                  height={1080}
                  alt="Logo Drone Institute Biru"
                  className="w-[20%] h-auto"
                />
              </div>

              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="#home"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  About
                </a>
                <a
                  href="#courses"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Courses
                </a>
                <a
                  href="#features"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#contact"
                  className="text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
              </nav>

              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="relative ml-auto">
                    <div
                      className="flex gap-4 items-center cursor-pointer"
                      onClick={() => setOpen(!open)}
                    >
                      <img
                        src={user?.avatar_urls?.["96"]}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <p className="font-bold text-[#31569A]">
                        Hi, {user?.name}
                      </p>
                    </div>

                    {open && (
                      <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg w-40">
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Dashboard
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login" className="ml-auto">
                    <Button
                      size="sm"
                      className="bg-[#31569A] hover:bg-blue-700 cursor-pointer"
                    >
                      Log In
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden border-t bg-background">
                <nav className="container flex flex-col space-y-4 px-4 py-4">
                  <a
                    href="#home"
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="#about"
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    About
                  </a>
                  <a
                    href="#courses"
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    Courses
                  </a>
                  <a
                    href="#features"
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#pricing"
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    Pricing
                  </a>
                  <a
                    href="#contact"
                    className="text-sm font-medium hover:text-blue-600 transition-colors"
                  >
                    Contact
                  </a>
                  <div className="flex space-x-2 pt-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      Log In
                    </Button>
                    {/* <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">Get Started</Button> */}
                  </div>
                </nav>
              </div>
            )}
          </header>

          {/* Hero Section */}
          <section id="home" className="relative py-20 lg:py-20 px-8 lg:px-20">
            <div className="container px-4">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  {/* <Badge className="w-fit bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Award className="mr-2 h-4 w-4" />
                FAA Certified Training
              </Badge> */}
                  <h1 className="text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
                    Belajar Terbang Lebih Cerdas dengan
                    <span className="text-blue-600">
                      {" "}
                      Pelatihan Drone Terlengkap
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Tingkatkan skill menerbangkan drone dengan kurikulum modern
                    yang dirancang untuk kebutuhan hobi, industri, hingga
                    sertifikasi resmi. Akses pembelajaran kapan saja, dibimbing
                    oleh instruktur berpengalaman.
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
                      <Image
                        src="/bg-drone.jpg"
                        width={1920}
                        height={1080}
                        alt="Drone Insitute"
                        className="w-full h-auto rounded-2xl"
                      ></Image>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-blue-50 px-8 lg:px-20">
            <div className="container px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
                  Kenapa Memilih Drone Institute?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Experience the future of drone education with our cutting-edge
                  platform
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-blue-900">
                      Penilaian Skill yang Akurat
                    </CardTitle>
                    <CardDescription>
                      Platform ini dirancang untuk mengukur kemampuan Anda
                      secara tepat—mulai dari dasar hingga tingkat mahir. Setiap
                      modul memiliki evaluasi terstruktur sehingga Anda dapat
                      melihat progres secara jelas dan objektif.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Camera className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-blue-900">
                      Pemahaman Produk yang Mendalam
                    </CardTitle>
                    <CardDescription>
                      Pelajari fitur, fungsi, komponen, hingga perawatan drone
                      melalui materi yang dibuat oleh praktisi berpengalaman.
                      Cocok untuk meningkatkan product knowledge dan kesiapan
                      penggunaan drone di lapangan.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Navigation className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-blue-900">
                      Simulasi Penerbangan yang Realistis
                    </CardTitle>
                    <CardDescription>
                      Asah kemampuan menerbangkan drone melalui simulasi
                      interaktif yang aman. Baik pemula maupun pilot
                      berpengalaman dapat meningkatkan teknik tanpa risiko
                      kerusakan perangkat.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-blue-900">
                      Fokus pada Keamanan & Regulasi
                    </CardTitle>
                    <CardDescription>
                      Keselamatan adalah prioritas utama. Anda akan mempelajari
                      standar keamanan, prosedur darurat, serta aturan
                      penerbangan drone agar lebih siap menghadapi kondisi
                      nyata.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-blue-900">
                      Jalur Belajar yang Terarah
                    </CardTitle>
                    <CardDescription>
                      Drone Institute menyediakan jalur pembelajaran yang telah
                      disesuaikan dengan tujuan Anda—baik untuk meningkatkan
                      skill teknis, product knowledge, maupun pengoperasian
                      drone secara profesional.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-blue-900">
                      Materi Terupdate Sesuai Perkembangan Teknologi
                    </CardTitle>
                    <CardDescription>
                      Dunia drone berkembang cepat. Materi di Drone Institute
                      selalu diperbarui agar pengguna mendapatkan informasi
                      terkini mengenai teknologi, fitur, dan tren terbaru di
                      industri drone.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section className="py-20 px-8 lg:px-20">
            <div className="container px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-4">
                  They are already flying high!
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thousands of successful drone pilots who started their
                  journey with us
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
                        <CardDescription>
                          Commercial Drone Pilot
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      "Drone Institute gave me the skills and confidence to
                      start my own aerial photography business. The instructors
                      are top-notch!"
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
                        <CardTitle className="text-lg">
                          Sarah Martinez
                        </CardTitle>
                        <CardDescription>
                          Real Estate Photographer
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      "The comprehensive curriculum and hands-on training helped
                      me triple my income in just 6 months. Best investment I've
                      made!"
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
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground">
                      "From zero knowledge to FAA certified in 3 months! The
                      platform is intuitive and the support team is always there
                      to help."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Success Story Highlight */}
          <section className="py-20 px-8 lg:px-20">
            <div className="container px-4">
              <Card className="bg-gradient-to-r from-[#0B1C3F] to-[#112B6B] text-white">
                <CardContent className="p-12 lg:p-16">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <Badge className="bg-white/20 text-white mb-4 w-fit">
                        Success Story
                      </Badge>
                      <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                        How AeroVision tripled their revenue in a year!
                      </h2>
                      <p className="text-lg mb-8 text-blue-100">
                        "After completing the Professional program at Drone
                        Institute, we expanded our services and saw a 300%
                        increase in revenue. The training was comprehensive and
                        immediately applicable."
                      </p>
                      <div className="flex items-center space-x-6 mb-8">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src="/api/placeholder/64/64" />
                          <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-lg">
                            AeroVision Solutions
                          </div>
                          <div className="text-blue-200">
                            Commercial Drone Services
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-8">
                        <div>
                          <div className="text-3xl font-bold">300%</div>
                          <div className="text-blue-200">Revenue Growth</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold">50+</div>
                          <div className="text-blue-200">
                            Projects Completed
                          </div>
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
          <footer className="bg-gradient-to-r from-[#0B1C3F] to-[#112B6B] text-white py-12 px-20">
            <div className="container px-4">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Image
                      src="/logo-test.png"
                      width={1920}
                      height={1080}
                      alt="Logo Drone Institute"
                      className="w-[55%] h-auto"
                    ></Image>
                  </div>
                  <p className="text-blue-200 ">
                    Tingkatkan skill menerbangkan drone dengan kurikulum modern
                    yang dirancang untuk kebutuhan hobi, industri, hingga
                    sertifikasi resmi.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-blue-200">
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        Courses
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        Certification
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        Blog
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Support</h3>
                  <ul className="space-y-2 text-blue-200">
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="hover:text-white transition-colors"
                      >
                        Terms of Service
                      </a>
                    </li>
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
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
                <p>&copy; PT Doran Sukses Indonesia. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
