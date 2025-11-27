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
import {
  Calendar,
  Clock,
  BookOpen,
  Trophy,
  LogOut,
  User,
  Menu,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { parse, format } from "date-fns";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
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
  id: number;
  name: string;
  email: string;
  avatar: string;
  registered_date: string;
  total_exp: number;
  level_id: number;
  level_name: string;
  min_exp: number;
  max_exp: number;
  progress_percent: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuiz: 0,
    quizzesSubmitted: 0,
    trainingsParticipated: 0,
  });
  const [usern, setUsern] = useState<UserData | null>(null);
  const [recentTrainings, setRecentTrainings] = useState<any[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentParticipant, setParticipant] = useState<TrainingSummary | null>(
    null
  );

  const [totalProducts, setTotalProducts] = useState<any[]>([]);

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

  const [tanggal, setTanggal] = useState("");

  useEffect(() => {
    const today = new Date();

    const formatted = today.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    setTanggal(formatted);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getUserData();
        console.log("User:", userData);
        setUsern(userData); // misal kamu punya state
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();

    const loadDashboardData = async () => {
      try {
        const userLog = localStorage.getItem("lms_user");
        const users = JSON.parse(userLog!);
        const usersId = users.id;
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
        setTotalProducts(products);
        setParticipant(participations);

        const savedUser = localStorage.getItem("lms_user");
        if (!savedUser) return;

        const user = JSON.parse(savedUser);
        const userId = user.id;

        // 🔥 ambil data quiz & training paralel
        Promise.all([
          fetch(
            `https://roynaldkalele.com/wp-json/lms/v1/user/${userId}/quiz`
          ).then((res) => res.json()),
          // fetch(`https://roynaldkalele.com/wp-json/lms/v1/user/${userId}/training`).then(res => res.json())
        ])
          .then(([quizData]) => {
            const submissions = quizData?.quizzes || [];
            // const participations = trainingData?.data || []

            setStats({
              totalQuiz: quizzes.total,
              quizzesSubmitted: submissions.length, // jumlah quiz dikerjakan
              trainingsParticipated: 2, // jumlah training diikuti
            });
          })
          .catch((err) => {
            console.error("Error fetching stats:", err);
          });
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
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded-md w-3/4 mx-auto"></div>

          <div className="p-6 border border-gray-200 rounded-2xl shadow-sm space-y-4">
            <div className="w-full h-40 bg-gray-200 rounded-xl"></div>

            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded-md w-4/6"></div>
            </div>

            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded-md w-full"></div>
              <div className="h-3 bg-gray-200 rounded-md w-11/12"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-gray-900 mb-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8">
        <div className="pb-8 flex justify-between items-center mt-14 lg:mt-0">
          <h1 className="font-bold text-2xl">Dashboard</h1>
          <p className="text-sm text-[#0B1C3F] px-4 py-2 font-semibold bg-white rounded-lg">
            {tanggal}
          </p>
        </div>
        <div className="w-full rounded-2xl bg-gradient-to-r from-[#0B1C3F] to-[#112B6B] px-6 py-8 flex items-center justify-between overflow-hidden relative">
          <div className="z-10">
            <p className=" text-blue-200 mb-1">
              Hi, <span className="font-semibold text-white">{user.name}</span>{" "}
              👋
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-white max-w-md">
              Stay on track with your drone training schedule.
            </h2>
          </div>

          <div className="hidden lg:absolute right-4 md:right-8 bottom-0 h-[90%] w-[180px] md:w-[220px]">
            <Image
              src="/drone-illus.png"
              alt="Dashboard Illustration"
              fill
              className="object-contain"
            />
          </div>

          <div className="absolute overflow-visible right-20 top-20 w-[140%] h-[140%] bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Cards */}
        <div className="grid mb-8 mt-4 grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="gap-1 shadow-none h-fit  border-[#008169] border-r-1 bg-[#d8f3ee] rounded-xl">
            <div className="flex flex-row">
              <CardHeader className="flex flex-row items-center w-[25%] justify-between space-y-0">
                <Trophy className="h-12 w-12 text-[#008169] bg-white p-3 rounded" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold">
                  {stats.quizzesSubmitted}
                  <span className="text-xs text-gray-700">
                    {" "}
                    / {stats.totalQuiz} Total Quiz
                  </span>
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  Jumlah Quiz Dikerjakan
                </p>
              </CardContent>
            </div>
            <div className="px-6 mt-3">
              <hr className="border-t border-[#008169] w-full mb-3" />
              <a href="/quizzes" className=" text-black font-bold  text-sm">
                Lihat Detail
              </a>
            </div>
          </Card>

          <Card className="gap-1 shadow-none h-fit  border-[#ff7700] border-r-1 bg-[#fee4cd] rounded-xl">
            <div className="flex flex-row">
              <CardHeader className="flex flex-row items-center w-[25%] justify-between space-y-0">
                <Calendar className="h-12 w-12 text-[#ff7700] bg-white p-3 rounded" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold">
                  {recentParticipant?.completedTrainings}{" "}
                  <span className="text-xs text-gray-600">
                    / {recentParticipant?.totalTrainings} Total Training
                  </span>
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  Jumlah Training Diikuti
                </p>
              </CardContent>
            </div>
            <div className="px-6 mt-3">
              <hr className="border-t border-[#ff7700] mb-3 w-full" />
              <a href="/trainings" className=" text-black font-bold  text-sm">
                Lihat Detail
              </a>
            </div>
          </Card>

          {/* <Card className="gap-1 shadow-none flex flex-row h-fit border-[#0097fb] bg-[#ccebff] rounded-xl">
              <CardHeader className="flex flex-row items-center w-[25%] justify-between space-y-0 ">
                <BookOpen className="h-12 w-12 text-[#0097fb] bg-white p-3 rounded" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold">
                  {Math.round(
                    ((stats.quizzesSubmitted / stats.totalQuiz) * 0.5 +
                      (recentParticipant?.completedTrainings! /
                        recentParticipant?.totalTrainings!) *
                        0.5) *
                      100
                  )}
                  %
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  Progress Belajar
                </p>
              </CardContent>
            </Card> */}

          <Card className="gap-1 shadow-none h-fit  border-[#0097fb] border-r-1 bg-[#ccebff] rounded-xl">
            <div className="flex flex-row">
              <CardHeader className="flex flex-row items-center w-[25%] justify-between space-y-0">
                <BookOpen className="h-12 w-12 text-[#0097fb] bg-white p-3 rounded" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold">
                  {totalProducts.length}{" "}
                  <span className="text-xs text-gray-600">Produk Drone</span>
                </div>
                <p className="text-xs mt-2 text-muted-foreground">
                  Jumlah Product Drone
                </p>
              </CardContent>
            </div>
            <div className="px-6 mt-3">
              <hr className="border-t border-[#0097fb] mb-3 w-full" />
              <a href="/products" className=" text-black font-bold  text-sm">
                Lihat Detail
              </a>
            </div>
          </Card>
        </div>

        {/* Recent Trainings */}
        <div className="bg-white p-6 rounded-2xl  border mt-6">
          <div className="flex-col lg:flex-row flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              PELATIHAN TERBARU
            </h3>
            <Link href="/trainings">
              <Button
                variant="outline"
                className="cursor-pointer bg-gradient-to-r from-[#0B1C3F] to-[#112B6B] mt-5 sm:mt-0 text-white"
              >
                View All Training
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {recentTrainings.map((training) => {
              const matchedTraining = recentParticipant?.trainings.find(
                (t) => t.training_id === training.id
              );

              const isCompleted =
                matchedTraining &&
                matchedTraining.total_modules > 0 &&
                matchedTraining.completed_modules ===
                  matchedTraining.total_modules;

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
                    {/* <Badge
                      variant={
                        training.type === "online" ? "default" : "secondary"
                      }
                    >
                      {training.type}
                    </Badge> */}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatTrainingDate(training.date)}
                      </div>
                    </div> */}

                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {training.short_description}
                    </p>

                    {isCompleted ? (
                      <p className="w-full mt-5 text-sm p-2 bg-gray-300 text-center text-black font-semibold rounded-lg">
                        Training Selesai
                      </p>
                    ) : (
                      <Link href={`/trainings/${training.id}`}>
                        <Button
                          size="sm"
                          className="w-full mt-5 cursor-pointer"
                        >
                          Lihat Detail
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quiz Section */}
        <div className="bg-white p-6 rounded-2xl  border mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">QUIZ TERBARU</h3>
            <Link href="/quizzes">
              <Button className="bg-gradient-to-r from-[#0B1C3F] to-[#112B6B] text-white hover:bg-[#27467d] cursor-pointer">
                View All Quiz
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentQuizzes.map((quiz, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition"
              >
                {/* LEFT */}
                <div className="flex flex-col gap-1 max-w-[65%]">
                  <h4
                    className="font-semibold text-sm text-gray-800"
                    dangerouslySetInnerHTML={{ __html: quiz.title }}
                  />

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {quiz.time_limit_minutes} menit
                    </div>
                    <div>{quiz.questions.length} pertanyaan</div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-3">
                  {quiz.completed ? (
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-semibold text-white
              ${quiz.status === "Tidak Lulus" ? "bg-red-500" : "bg-green-500"}`}
                    >
                      Score {quiz.score}%
                    </div>
                  ) : (
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="cursor-pointer"
                    >
                      <Button size="sm" className="cursor-pointer">
                        Mulai Quiz
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Knowledge */}
        <div className="bg-white p-6 rounded-2xl  border mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              PRODUCT KNOWLEDGE
            </h3>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-[#0B1C3F] to-[#112B6B] text-white hover:bg-[#27467d] cursor-pointer">
                View All Products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl overflow-hidden border hover:shadow-lg transition flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-600 transition flex items-center justify-center gap-3">
                    <Link href={`/products/${product.id}`}>
                      <Button
                        size="sm"
                        className="bg-white text-black cursor-pointer hover:bg-gray-300"
                      >
                        Detail
                      </Button>
                    </Link>

                    {product.pdf_download && (
                      <Button size="sm" className="bg-white text-black" asChild>
                        <a
                          href={product.pdf_download}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          PDF
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-1">
                  <h4
                    className="font-semibold text-sm text-gray-900 line-clamp-2 mb-2"
                    dangerouslySetInnerHTML={{ __html: product.product_name }}
                  />

                  {/* Optional Summary */}
                  {/* 
          <p
            className="text-xs text-gray-500 line-clamp-2 mb-3"
            dangerouslySetInnerHTML={{ __html: product.summary }}
          ></p> 
          */}

                  <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                    <span>ID: {product.id}</span>
                    {product.pdf_download && <span>PDF Available</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
