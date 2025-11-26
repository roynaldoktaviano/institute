"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { getUserData, lmsApi, TrainingSummary } from "@/lib/api";
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
import { Calendar, Clock, BookOpen, Trophy, LogOut, User, Menu,  } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { parse, format } from "date-fns";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import {Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { stat } from "fs";
import Sidebar from "@/components/lms/Sidebar";

interface DashboardStats {
  totalQuiz: number;
  quizzesSubmitted: number;
  trainingsParticipated: number;
}

function formatTrainingDate(dateStr: string) {
  // API: "28/09/2025 4:00 pm"
  const parsed = parse(dateStr, "dd/MM/yyyy h:mm a", new Date());
  return format(parsed, "dd MMMM yyyy - hh.mm aaaa");
}

export interface UserData {
  id: number
  name: string
  email: string
  avatar: string
  registered_date: string
  total_exp: number
  level_id: number
  level_name: string
  min_exp: number
  max_exp: number
  progress_percent: number
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuiz:0,
    quizzesSubmitted: 0,
    trainingsParticipated: 0,
  });
  const [usern, setUsern] = useState<UserData | null>(null)
  const [recentTrainings, setRecentTrainings] = useState<any[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
   const [recentParticipant, setParticipant] = useState<TrainingSummary | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menus = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Trainings", href: "/trainings" },
    { name: "Quizzes", href: "/quizzes" },
    { name: "Products", href: "/products" },
    // { name: "Profile", href: "/profile" },
  ];

  useEffect(() => {
  const loadUser = async () => {
    try {
      const userData = await getUserData()
      console.log("User:", userData)
      setUsern(userData) // misal kamu punya state
    } catch (err) {
      console.error(err)
    }
  }

  loadUser()
    if (!user) {
      router.push("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        const userLog = localStorage.getItem("lms_user");
        const users = JSON.parse(userLog!)
        const usersId = users.id
        const [trainings, quizzes, products, submissions, participations] =
          await Promise.all([
            lmsApi.getTrainings(),
            lmsApi.getQuizzes(),
            lmsApi.getProductKnowledge(),
            lmsApi.getQuizSubmissions(),
            lmsApi.getTrainingParticipation(usersId),
          ]);

        setRecentTrainings(trainings.slice(0, 4));
        setRecentQuizzes(quizzes.quizzes.slice(0, 4));
        setRecentProducts(products.slice(0, 4));
        setParticipant(participations);
        

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
        totalQuiz : quizzes.total,
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
    <div className="min-h-screen bg-[#f1f5f8] dark:bg-gray-900">
      {/* Header */}


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-white px-8 py-7 rounded-2xl">
         <div className="flex gap-8 items-center">
  <img
    src={usern?.avatar}
    alt="User Avatar"
    className="w-30 h-30 rounded-full"
  />
  <div className="w-full">
    {/* <p className="text-sm italic">{usern?.email}</p> */}
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white my-2">
      {usern?.name}
    </h2>
    <p className="text-sm text-gray-400">
      Tanggal Daftar : {usern?.registered_date}
    </p>

    <div className="mt-3 w-full">
      <div className=" text-sm text-gray-600 mb-1 w-full">
        <span className="mt-4 mb-8">
          <span className="px-2 py-1 bg-amber-300 rounded"><strong>{usern?.level_name}</strong></span>
        </span>
        

      <div className="w-full bg-gray-200 mt-4 mb-2 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
          style={{
            width: `${usern?.progress_percent ?? 0}%`,
          }}
        ></div>
       
      </div>
       <span className="">
  {(usern ? usern.total_exp : 0)} / {(usern ? usern.max_exp : 0)} EXP
</span>
      </div>
    </div>
  </div>
</div>

          {/* Stats Cards */}
          <div className="grid mt-10 grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="gap-1 shadow-none  border-r-1 bg-gray-100 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Trophy className="h-6 w-6 text-blue-900 bg-white p-1 rounded" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.quizzesSubmitted} 
                <span className="text-sm text-gray-500"> / {stats.totalQuiz} Total Quiz</span> 
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  Jumlah Quiz Dikerjakan
                </p>
              </CardContent>
            </Card>

            <Card className="gap-1 shadow-none  border-r-1 bg-gray-100 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                
                <Calendar className="h-6 w-6 text-blue-900 bg-white p-1 rounded"  />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {recentParticipant?.completedTrainings} <span className="text-sm text-gray-500">/ {recentParticipant?.totalTrainings} Total Training</span> 
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  Jumlah Training Diikuti
                </p>
              </CardContent>
            </Card>

            <Card className="gap-1 shadow-none bg-gray-100 rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               
                <BookOpen className="h-6 w-6 text-blue-900 bg-white p-1 rounded" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    ((stats.quizzesSubmitted / stats.totalQuiz) * 0.5 + (recentParticipant?.completedTrainings! / recentParticipant?.totalTrainings!) * 0.5 ) *
                      100
                  )}
                  %
                </div>
                <p className="text-xs mt-2 text-muted-foreground">Progress Belajar</p>
              </CardContent>
            </Card>
          </div>
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
           {recentTrainings.map((training) => {
  // Cari progress untuk training ini
  const matchedTraining = recentParticipant?.trainings.find(
    (t) => t.training_id === training.id
  )

  // Cek apakah semua modulnya sudah selesai
  const isCompleted =
    matchedTraining &&
    matchedTraining.total_modules > 0 &&
    matchedTraining.completed_modules === matchedTraining.total_modules

  return (
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
          variant={training.type === 'online' ? 'default' : 'secondary'}
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

      {isCompleted ? (
  <p className="w-full mt-5 text-sm p-2 bg-green-400 text-center text-white font-semibold rounded-2xl">
    Sudah Menyelesaikan Training Ini
  </p>
) : (
  <Link href={`/trainings/${training.id}`}>
    <Button size="sm" className="w-full mt-5 cursor-pointer">
      Lihat Detail
    </Button>
  </Link>
)}

      </CardContent>
    </Card>
  )
})}

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
                  <CardTitle
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: product.product_name }}
                  />
                </CardHeader>
                <CardContent>
                  <p
                  className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3"
                  dangerouslySetInnerHTML={{ __html: product.summary }}
                ></p>
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
