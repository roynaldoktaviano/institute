"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, BookOpen, FileText, Trophy, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Modul {
  id: number;
  title: { rendered: string };
  acf: {
    materi_ppt?: string;       // PPT / materi modul
    soal_evaluasi_modul?: {             // quiz evaluasi
      soal: string;
      jawaban: string[];
      kunci_jawaban: string;
    }[];
    deskripsi?: string;
  };
}

interface Evaluasi {
  soal_evaluasi_modul?: {             // quiz evaluasi
      soal: string;
      jawaban: string[];
      kunci_jawaban: string;
    }[];
}


export default function ModulPage({ params }: { params: Promise<{ id: string }> }) {
const [modul, setModul] = useState<Modul | null>(null);
const [soal, setSoal] = useState<Evaluasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [allModules, setAllModules] = useState<Modul[]>([]);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(-1);
  const [isLastModule, setIsLastModule] = useState(false);

  const searchParams = useSearchParams();
  const trainingId = searchParams.get("trainingId");

  useEffect(() => {
  if (modul) {
    setQuizAnswers({});
    setScore(0);
    setShowResults(false);
    setStep(1); 
  }
}, [modul]);


  useEffect(() => {
    params.then(({ id }) => {
      // Fetch current module
      fetch(`https://roynaldkalele.com/wp-json/wp/v2/modul/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setModul(data);
          
          // Fetch all modules to determine position
          fetch(`https://roynaldkalele.com/wp-json/wp/v2/traning/${trainingId}`)
            .then((res) => res.json())
            .then((trainingData) => {
              // ambil array modul id dari ACF
              const modulIds = trainingData.acf?.pilih_modul || [];

              // fetch detail modul berdasarkan id
              Promise.all(
                modulIds.map((id: number) =>
                  fetch(`https://roynaldkalele.com/wp-json/wp/v2/modul/${id}`).then((res) => res.json())
                )
              ).then((modulDetails) => {
                setAllModules(modulDetails);

                // cari index modul sekarang
                const currentIndex = modulDetails.findIndex((m: Modul) => m.id === data.id);
                setCurrentModuleIndex(currentIndex);
                setIsLastModule(currentIndex === modulDetails.length - 1);
              });
            });

          
          setLoading(false);
        });
    });
  }, [params]);

  
 useEffect(() => {
  if (modul?.acf?.soal_evaluasi_modul) {
    const soalModul = modul.acf.soal_evaluasi_modul;

    const soalData = Object.keys(soalModul)
      .filter((key) => key.startsWith("soal_"))
      .map((key) => {
        const i = key.split("_")[1];
        const soal = soalModul[`soal_${i}`];
        const jawaban = soalModul[`jawaban_${i}`]?.split(",") ?? [];
        const kunci_jawaban = soalModul[`kunci_jawaban_${i}`];

        return { soal, jawaban, kunci_jawaban };
      })
      // filter soal kosong (tidak terisi)
      .filter(
        (item) =>
          item.soal?.trim() !== "" &&
          (item.jawaban.length > 0 || item.kunci_jawaban?.trim() !== "")
      );

    setSoal({ soal_evaluasi_modul: soalData });
  }
}, [modul]);


  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-muted-foreground">Memuat modul pembelajaran...</p>
      </div>
    </div>
  );
  
  if (!modul) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Modul Tidak Ditemukan</CardTitle>
          <CardDescription>Modul yang Anda cari tidak tersedia atau telah dihapus.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <a href="/training">Kembali ke Training</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const handleAnswer = (qIndex: number, option: string) => {
    setQuizAnswers({ ...quizAnswers, [qIndex]: option });
  };

  const checkScore = async () => {
    if (!modul?.acf?.soal_evaluasi_modul) return;
    let correct = 0;
    soal?.soal_evaluasi_modul?.forEach((q, i) => {
      if (quizAnswers[i] === q.kunci_jawaban) correct++;
    });
    setScore(correct);
    setShowResults(true);

      try {
        await submitTrainingResult({
          trainingId: Number(trainingId),
          moduleId: modul.id,
          score: correct,
          totalQuestions: modul.acf?.soal_evaluasi_modul.length,
          answers: quizAnswers,
        });
        console.log("✅ Modul result submitted");
      } catch (err) {
        console.error("❌ Gagal submit modul:", err);
      }
  };
  

 const resetQuiz = () => {
    setQuizAnswers({});
    setScore(0);
    setShowResults(false);
    setSoal({});
  };

  async function submitTrainingResult({
  trainingId,
  moduleId,
  score,
  totalQuestions,
  answers,
}: {
  trainingId: number;
  moduleId: number;
  score: number;
  totalQuestions: number;
  answers: any;
}) {
  try {
    const token = localStorage.getItem("lms_token")

    if (!token) {
      throw new Error("Token tidak ditemukan, silakan login dulu")
    }
    
    const res = await fetch('https://roynaldkalele.com/wp-json/training-results/v1/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`, },
  // credentials: 'include',
  body: JSON.stringify({
    training_id: trainingId,
    module_id: moduleId,
    score,
    total_questions: totalQuestions,
    answers,
  }),
});


    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.message || `HTTP Error ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
    return data; 
  } catch (err) {
    console.error(err);
    throw err;
  }
}

  const goToNextModule = () => {
  if (currentModuleIndex >= 0 && currentModuleIndex < allModules.length - 1) {
    const nextModule = allModules[currentModuleIndex + 1];
    window.location.href = `/modul/${nextModule.id}?trainingId=${trainingId}`;
  } else {
    setStep(3);
  }
};



  const totalQuestions = soal?.soal_evaluasi_modul?.length || 0;
  const answeredQuestions = Object.keys(quizAnswers).length;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Modul Pembelajaran</span>
            {currentModuleIndex >= 0 && (
              <Badge variant="secondary" className="ml-2">
                {currentModuleIndex + 1} / {allModules.length}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{modul.title.rendered}</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-6">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {step > 1 ? <CheckCircle className="w-4 h-4" /> : 1}
              </div>
              <span className="text-sm font-medium">Materi</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {step > 2 ? <CheckCircle className="w-4 h-4" /> : 2}
              </div>
              <span className="text-sm font-medium">Evaluasi</span>
            </div>
            {step > 3 && (
              <><div className={`w-12 h-0.5 ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div><div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {step > 3 ? <CheckCircle className="w-4 h-4" /> : 3}
                </div>
                <span className="text-sm font-medium">Selesai</span>
              </div></>
            )}
          </div>
        </div>

        {/* Step 1: Materi */}
        {step === 1 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                📖 Materi Pembelajaran
              </CardTitle>
              <CardDescription>
                Pelajari materi modul dengan seksama sebelum melanjutkan ke evaluasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {modul.acf?.materi_ppt ? (
                <div className="bg-slate-50 rounded-lg p-4">
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(modul.acf?.materi_ppt)}`}
                    width="100%"
                    height="500"
                    className="border rounded-lg bg-white"
                  />
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-slate-700 leading-relaxed">
                        {modul.acf?.deskripsi || "Tidak ada materi modul yang tersedia."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={() => setStep(2)} className="gap-2">
                  Lanjut ke Evaluasi
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Quiz */}
        {step === 2 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Evaluasi Pembelajaran
              </CardTitle>
              <CardDescription>
                Jawab semua pertanyaan untuk menguji pemahaman Anda
              </CardDescription>
              {!showResults && totalQuestions !== 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress: {answeredQuestions}/{totalQuestions} pertanyaan</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {soal?.soal_evaluasi_modul ? (
                <>
                  <div className="space-y-6">
                    {soal?.soal_evaluasi_modul?.map((q, i) => (
                      <Card key={i} className={`border-2 transition-all ${showResults && quizAnswers[i] === q.kunci_jawaban ? "border-green-200 bg-green-50" : showResults && quizAnswers[i] && quizAnswers[i] !== q.kunci_jawaban ? "border-red-200 bg-red-50" : "border-slate-200"}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {showResults ? (
                                quizAnswers[i] === q.kunci_jawaban ? (
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : quizAnswers[i] ? (
                                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                                    <span className="text-red-600 text-xs font-bold">✗</span>
                                  </div>
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground" />
                                )
                              ) : (
                                <div className={`w-5 h-5 rounded-full border-2 ${quizAnswers[i] ? "border-primary bg-primary" : "border-muted-foreground"} flex items-center justify-center`}>
                                  {quizAnswers[i] && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-4">
                              <div>
                                <p className="font-medium text-slate-900 mb-1">
                                  Pertanyaan {i + 1}
                                </p>
                                <p className="text-slate-700">{q.soal}</p>
                              </div>
                              
                              <RadioGroup
                                value={quizAnswers[i] || ""}
                                onValueChange={(value) => handleAnswer(i, value)}
                                disabled={showResults}
                              >
                                <div className="grid gap-3">
                                  {q.jawaban.map((opt, j) => (
                                    <div key={j} className="flex items-center space-x-2">
                                      <RadioGroupItem value={opt} id={`q-${i}-opt-${j}`} />
                                      <Label 
                                        htmlFor={`q-${i}-opt-${j}`} 
                                        className={`flex-1 cursor-pointer p-3 rounded-lg border transition-all ${
                                          showResults && opt === q.kunci_jawaban 
                                            ? "border-green-300 bg-green-100 text-green-800" 
                                            : showResults && opt === quizAnswers[i] && opt !== q.kunci_jawaban
                                            ? "border-red-300 bg-red-100 text-red-800"
                                            : "border-slate-200 hover:bg-slate-50"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span>{opt}</span>
                                          {showResults && opt === q.kunci_jawaban && (
                                            <Badge variant="secondary" className="bg-green-200 text-green-800">
                                              Benar
                                            </Badge>
                                          )}
                                          {showResults && opt === quizAnswers[i] && opt !== q.kunci_jawaban && (
                                            <Badge variant="destructive">
                                              Salah
                                            </Badge>
                                          )}
                                        </div>
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </RadioGroup>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 pt-4">
                    {totalQuestions === 0 && (
                  <><div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div><p className="text-muted-foreground mb-4 text-center">Tidak ada evaluasi untuk modul ini.</p></>
                  )}
                    {!showResults ? (
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setStep(1)} 
                          className="gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Kembali ke Materi
                        </Button>
                        <Button 
                          onClick={totalQuestions === 0 ? goToNextModule : checkScore} 
                          disabled={answeredQuestions !== totalQuestions}
                          className="flex-1 gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {
                            totalQuestions === 0
                              ? "Modul Selanjutnya"
                              : answeredQuestions === totalQuestions
                                ? "Lihat Hasil"
                                : `Jawab ${totalQuestions - answeredQuestions} pertanyaan lagi`
                          }

                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Score Display */}
                        <Card className="border-2 border-primary bg-primary/5">
                          <CardContent className="p-6 text-center">
                            <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">
                              Skor Anda: {score} / {totalQuestions}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {score === totalQuestions 
                                ? "🎉 Sempurna! Anda menguasai materi ini dengan baik." 
                                : score >= totalQuestions * 0.7 
                                ? "👍 Bagus! Anda sudah memahami sebagian besar materi." 
                                : "📚 Terus belajar! Anda bisa lebih baik lagi."
                              }
                            </p>
                           <div className="flex gap-3 justify-center">
                              <Button variant="outline" onClick={resetQuiz} className="gap-2">
                                <RotateCcw className="w-4 h-4" />
                                Ulangi Quiz
                              </Button>
                              <Button onClick={goToNextModule} className="gap-2">
                                {isLastModule ? "Selesai" : "Modul Berikutnya"}
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                   
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Kembali ke Materi
                    </Button>
                    <Button onClick={goToNextModule} className="gap-2">
                      Lanjut ke Modul Berikutnya
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Completion */}
           {step === 3 && (
          <Card className="shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">🎉 Selamat! Training Selesai!</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Anda telah menyelesaikan semua modul dalam training ini dengan baik. Lanjutkan perjalanan pembelajaran Anda dengan training lainnya.
              </p>
              
                  {score !== 0 && (
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Skor Evaluasi Akhir</p>
                  <p className="text-3xl font-bold text-primary">
                    {score}/{totalQuestions}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Math.round((score / totalQuestions) * 100)}% ketepatan
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Lihat Hasil Quiz
                </Button>
              <Button asChild className="gap-2">
                  <a href="/training">
                    Kembali ke Daftar Training
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}