"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { lmsApi, Training, TrainingSummary } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { parse, format } from "date-fns";

export default function TrainingDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [training, setTraining] = useState<Training | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modul, setModul] = useState<any[]>([]);
  const [lastModuleViewed, setLastModuleViewed] = useState<any>(null);
  const [isCompletedAll, setIsCompletedAll] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [materi, setMateri] = useState<any>([]);
  let modulFinished;
  const trainingId = parseInt(params.id as string);
  
  function stripHtml(html: string) {
    return html.replace(/<[^>]*>?/gm, "");
  }

  function formatTrainingDate(dateStr: string) {
    const parsed = parse(dateStr, "dd/MM/yyyy h:mm a", new Date());
    return format(parsed, "dd MMMM yyyy - hh.mm aaaa");
  }

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const loadTraining = async () => {
      try {
        const userLog = localStorage.getItem("lms_user");
        if (!userLog) return;

        const users = JSON.parse(userLog);
        const usersId = users.id;

        const trainings = await lmsApi.getTrainings();
        const foundTraining = trainings.find((t) => t.id === trainingId);

        if (!foundTraining) {
          toast({
            title: "Training not found",
            description: "Training tidak ditemukan.",
            variant: "destructive",
          });
          router.push("/trainings");
          return;
        }

        setTraining(foundTraining);

  
        let modulesData: any[] = [];

        if (foundTraining.modul?.length) {
          const modules = await Promise.all(
            foundTraining.modul.map(async (id: number) => {
              const res = await fetch(
                `https://roynaldkalele.com/wp-json/wp/v2/modul/${id}`
              );
              return res.json();
            })
          );
          const summary = await lmsApi.getTrainingParticipation(usersId);
          
          modulesData = modules;
          setModul(modules);
          console.log(summary.module);
          console.log(summary.trainings);

        }

const summary = await lmsApi.getTrainingParticipation(usersId);




modulFinished = summary.totalTrainings;
setCompletedCount(modulFinished);

const currentTraining = summary.trainings.find(
  t => String(t.training_id) === String(trainingId)
);

setMateri(currentTraining?.modules || []);
console.log(materi);


if (!currentTraining) {
  setLastModuleViewed(modulesData[0] || null);
  setCompletedCount(0);
  return;
}

const modulesProgress = Array.isArray(currentTraining.modules)
  ? currentTraining.modules
  : [];

setCompletedCount(Number(currentTraining.completed_modules || 0));

if (
  Number(currentTraining.completed_modules) ===
  Number(currentTraining.total_modules)
) {
  setIsCompletedAll(true);
  return;
}

const nextModule = modulesProgress.find(
  (m: any) => m.completed === false
);

const matchedModule = modulesData.find(
  (wpModule) => wpModule.id === nextModule?.module_id
);

if (matchedModule) {
  setLastModuleViewed(matchedModule);
} else {
  setLastModuleViewed(modulesData[0] || null);
}

      } catch (error) {
        console.error("ERROR:", error);
        toast({
          title: "Error loading training",
          description: "Terjadi kesalahan saat memuat data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTraining();
  }, [user, router, toast, trainingId]);

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading training...
      </div>
    );
  }

  if (!training) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* HEADER */}
      <header className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/trainings">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </Link>

            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Detail Pelatihan
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* HERO */}
          <div className="relative h-[280px] rounded-xl overflow-hidden shadow">
            <img
              src={training.image}
              alt={training.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
            <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
              <h1
                className="text-3xl font-bold mb-1"
                dangerouslySetInnerHTML={{ __html: training.title }}
              />
              <p className="text-sm opacity-90">{training.topic}</p>
            </div>
          </div>

          {/* DESKRIPSI */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">Tentang Pelatihan</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {stripHtml(training.description)}
              </p>

              {/* PROGRESS */}
              {training.modul?.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm">
                      {completedCount}/{training.modul.length} modul
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="bg-[#ffbf1d] h-full"
                      style={{
                        width: `${
                          (completedCount / training.modul.length) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div>
          <Card className="sticky top-8 shadow-sm rounded-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Book className="w-4 h-4" /> Materi Pelatihan 
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {modul.length > 0 ? (
                <>
                  {/* LIST MODUL */}
                  <div className="space-y-2">
                    {modul.map((m: any, index: number) => {
  const isCompleted = materi?.[index]?.completed;

  return (
    <div
      key={m.id}
      className={`flex items-start gap-3 p-3 rounded-lg border transition
        ${isCompleted
          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          : "bg-white text-gray-900 border-gray-300"
        }`}
    >
      <div
        className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-semibold
          ${isCompleted ? "bg-gray-400 text-white" : "bg-blue-900 text-white"}
        `}
      >
        {index + 1}
      </div>

      <div
        className="text-sm"
        dangerouslySetInnerHTML={{
          __html: m.title?.rendered ?? m.title,
        }}
      />

      {isCompleted && (
        <div className="ml-auto text-xs font-medium text-gray-500">
          Selesai
        </div>
      )}
    </div>
  );
})}

                  </div>

                  <div className="pt-4 border-t space-y-2">
                    {isCompletedAll ? (
                      <Button disabled className="w-full bg-gray-300">
                        Training sudah selesai
                      </Button>
                    ) : lastModuleViewed ? (
                      <Button
                        onClick={() =>
                          window.open(
                            `/modul/${lastModuleViewed.id}?trainingId=${training.id}`,
                            "_blank"
                          )
                        }
                        className="w-full bg-blue-900 text-white"
                      >
                        Lanjutkan Modul Terakhir
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          window.open(
                            `/modul/${modul[0].id}?trainingId=${training.id}`,
                            "_blank"
                          )
                        }
                        className="w-full bg-blue-900 text-white"
                      >
                        Mulai Training
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <Button disabled className="w-full bg-gray-200">
                  Training belum memiliki modul
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
