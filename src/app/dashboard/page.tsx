"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { lmsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, BookOpen, Trophy, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { parse, format } from "date-fns";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface DashboardStats {
  quizzesSubmitted: number;
  trainingsParticipated: number;
}

function formatTrainingDate(dateStr: string) {
  // API: "28/09/2025 4:00 pm"
  const parsed = parse(dateStr, "dd/MM/yyyy h:mm a", new Date());
  return format(parsed, "dd MMMM yyyy - hh.mm aaaa");
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    quizzesSubmitted: 0,
    trainingsParticipated: 0,
  });
  const [recentTrainings, setRecentTrainings] = useState<any[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const menus = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Trainings", href: "/trainings" },
    { name: "Quizzes", href: "/quizzes" },
    { name: "Products", href: "/products" },
    // { name: "Profile", href: "/profile" },
  ];

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        const [trainings, quizzes, products, submissions, participations] =
          await Promise.all([
            lmsApi.getTrainings(),
            lmsApi.getQuizzes(),
            lmsApi.getProductKnowledge(),
            lmsApi.getQuizSubmissions(),
            lmsApi.getTrainingParticipations(),
          ]);

        setRecentTrainings(trainings.slice(0, 4));
        setRecentQuizzes(quizzes.slice(0, 4));
        setRecentProducts(products.slice(0, 4));

        const savedUser = localStorage.getItem("lms_user")
  if (!savedUser) return

  const user = JSON.parse(savedUser)
  const userId = user.id

  // 🔥 ambil data quiz & training paralel
  Promise.all([
    fetch(`https://roynaldkalele.com/wp-json/lms/v1/user/${userId}/quiz`).then(res => res.json()),
    // fetch(`https://roynaldkalele.com/wp-json/lms/v1/user/${userId}/training`).then(res => res.json())
  ])
    .then(([quizData]) => {
      const submissions = quizData?.quizzes || []
      // const participations = trainingData?.data || []

      setStats({
        quizzesSubmitted: submissions.length,   // jumlah quiz dikerjakan
        trainingsParticipated: 2 // jumlah training diikuti
      })
    })
    .catch(err => {
      console.error("Error fetching stats:", err)
    })
      } catch (error) {
        toast({
          title: "Error loading dashboard",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, router, toast]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    router.push("/");
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-[#31569A] py-2 rounded-b-xl dark:bg-gray-800 shadow-xs border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex w-full justify-between items-center">
              {/* <h1 className="text-2xl font-bold text-white dark:text-white">
                Doran Institute
              </h1> */}
              <Image
              src="/logo-test.png"
              width={150}
              height={`100`}
              alt="Logo Test"
              />
               <nav className="hidden md:flex space-x-4">
      {menus.map((menu) => (
        <Link
          key={menu.href}
          href={menu.href}
          className={`px-4 py-1 rounded text-sm transition-all
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
              <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_urls?.["96"]} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-white dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Hello, {user.name}
                </Link>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            </div>

            
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Selamat Pagi, {user.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Teruskan tahapan pelatihan drone Anda menuju tingkat pemahaman dan keahlian yang lebih tinggi.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="gap-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Jumlah Quiz Dikerjakan
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.quizzesSubmitted}</div>
              <p className="text-xs text-muted-foreground">
                Keep up the good work!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Jumlah Training Diikuti
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.trainingsParticipated}
              </div>
              <p className="text-xs text-muted-foreground">
                Expand your skills
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Progress Belajar
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  ((stats.quizzesSubmitted) /
                    10) *
                    100
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trainings */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pelatihan Terbaru
            </h3>
            <Link href="/trainings">
              <Button variant="outline" className="cursor-pointer">See All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentTrainings.map((training) => (
              <Card
                key={training.id}
                className="hover:shadow-md transition-shadow pt-0 pb-6 gap-[8px]"
              >
                <div className="aspect-video bg-gray-200 rounded-t-lg">
                  <img
                    src={training.image}
                    alt={training.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader className="pb-2 flex justify-between mt-3">
                  <div>
          <CardTitle
  className="text-sm"
  dangerouslySetInnerHTML={{ __html: training.title }}
/>
                    <CardDescription className="text-xs mt-2">
                      {training.topic}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      training.type === "online" ? "default" : "secondary"
                    }
                  >
                    {training.type}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatTrainingDate(training.date)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                    {training.short_description}
                  </p>
                  <Link href={`/trainings/${training.id}`}>
                    <Button size="sm" className="w-full mt-5 cursor-pointer">
                      Lihat Detail
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Quizzes */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quiz Terbaru
            </h3>
            <Link href="/quizzes">
              <Button variant="outline" className="cursor-pointer">See All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentQuizzes.map((quiz, index) => (
  <Card key={index} className="hover:shadow-md transition-shadow gap-[10px]">
    <CardHeader className="pb-2">
      <CardTitle
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: quiz.title }}
      />
    </CardHeader>
    <CardContent>
      <div className="flex items-center text-xs text-gray-500 mb-2">
        <Clock className="h-3 w-3 mr-1" />
        {quiz.time_limit_minutes} menit
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
        {quiz.questions.length} pertanyaan
      </div>

      {quiz.completed ? (
        <>
        <p className={`${quiz.status == 'Tidak Lulus' ? 'bg-red-600' : 'bg-green-600'} p-1 font-bold  text-sm text-white rounded text-center`}>Score: {quiz.score} % ({quiz.status})</p>
        {/* <Button size="sm" className="w-full bg-white text-black" disabled>
          Quiz Sudah Dikerjakan
        </Button> */}
        </>
      ) : (
        <Link href={`/quizzes/${quiz.id}`}>
          <Button size="sm" className="w-full cursor-pointer">
            Mulai Quiz
          </Button>
        </Link>
      )}
    </CardContent>
  </Card>
))}

          </div>
        </div>

        {/* Recent Products */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Product Knowledge
            </h3>
            <Link href="/products">
              <Button variant="outline" className="cursor-pointer">See All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProducts.map((product) => (
              <Card
                key={product.id}
                className="hover:shadow-md transition-shadow pt-0 pb-6 gap-[8px]"
              >
                <div className="aspect-square bg-gray-200 rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.product_name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader className="pb-0 mt-3">
                  <CardTitle className="text-sm pb-0">
                    {product.product_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {product.summary}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm" className="flex-1 cursor-pointer">
                        Baca Detail
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={product.pdf_download}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
