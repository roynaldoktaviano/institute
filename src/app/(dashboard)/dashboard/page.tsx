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
        const userData = await getUserData();
        console.log("User:", userData);
        setUsern(userData); // misal kamu punya state
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
    // if (!user) {
    //   router.push("/login");
    //   return;
    // }

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
    <div className="min-h-screen bg-[#f7f8fa] dark:bg-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8">
         <h3 className="text-2xl font-bold text-black dark:text-white">
              Course Overview
          </h3>
          {/* Stats Cards */}
          <div className="grid mb-8 mt-4 grid-cols-1 md:grid-cols-3 gap-6">
            {/* <Card className="gap-1 shadow-none flex-row h-fit items-center border-[#008169] flex  border-r-1 bg-[#d8f3ee] rounded-xl">
              <div className="flex flex-row">
                <CardHeader className="flex flex-row w-[25%] items-center justify-between space-y-0 ">
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
                <hr className="border-t border-[#ff7700] w-full" />
                <p className="mt-3 text-black font-bold  text-sm">
                  Lihat Detail
                </p>
              </div>
            </Card> */}

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
                  {recentParticipant?.completedTrainings}{" "}
                  <span className="text-xs text-gray-600">
                    Produk Drone
                  </span>
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
        <div className="mb-8 bg-white px-10 py-8 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              PELATIHAN TERBARU
            </h3>
            <Link href="/trainings">
              <Button variant="outline" className="cursor-pointer bg-[#31569A] text-white">
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

        <div className="flex flex-row justify-between gap-8">
          {/* Recent Quizzes */}
          <div className="mb-8 bg-white px-10 py-8 w-[50%] rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                QUIZ TERBARU
              </h3>
              <Link href="/quizzes">
                <Button variant="outline" className="cursor-pointer bg-[#31569A] text-white">
                  View All Quiz
                </Button> 
              </Link>
            </div>

            <div className="grid grid-rows gap-4">
              {recentQuizzes.map((quiz, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow py-6 gap-[10px]"
                >
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
                        <p
                          className={`${
                            quiz.status == "Tidak Lulus"
                              ? "bg-red-600"
                              : "bg-green-600"
                          } p-1 font-bold  text-sm text-white rounded text-center`}
                        >
                          Score: {quiz.score} % ({quiz.status})
                        </p>
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
          <div className="mb-8 bg-white px-10 py-8 w-[50%] rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                PRODUCT KNOWLEDGE
              </h3>
              <Link href="/products">
                <Button variant="outline" className="cursor-pointer bg-[#31569A] text-white">
                  View All Product
                </Button>
              </Link>
            </div>

            <div className="grid grid-row gap-4">
              {recentProducts.map((product) => (
                <Card
                  key={product.id}
                  className="hover:shadow-md transition-shadow pt-0 items-center gap-[8px] flex flex-row justify-around "
                >
                  <div className=" bg-gray-200 rounded-t-lg w-[30%]">
                    <img
                      src={product.image}
                      alt={product.product_name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div>
                    <CardHeader className="pb-0">
                      <CardTitle
                        className=""
                        dangerouslySetInnerHTML={{ __html: product.product_name }}
                      />
                    </CardHeader>
                    <CardContent>
                      {/* <p
                        className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3"
                        dangerouslySetInnerHTML={{ __html: product.summary }}
                      ></p> */}
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
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
