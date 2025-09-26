'use client'

import { useAuth } from './auth'


// Types based on the JSON structure
export interface Training {
  url: string
  id: number
  title: string
  type: 'offline' | 'online'
  date: string
  topic: string
  location: string
  image: string
  description: string
  short_description:string
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  answer_type: 'multiple_choice'
}

export interface Quiz {
  week: number
  title: string
  time_limit_minutes: number
  questions: QuizQuestion[]
  scoring: {
    show_correct_answer: boolean
    result?: {
      score: number
      status: string
    }
  }
  completed: any
  
}

export interface ProductKnowledge {
  id: number
  product_name: string
  summary: string
  image: string
  pdf_download: string
  description: string
  spesification: string
  features: string[]
}

export interface QuizSubmission {
  status: any
  quiz_id: number
  answers: number[]
  score: number
  submitted_at: string
}

export class LMSApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('lms_token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  async getTrainings(): Promise<Training[]> {
  try {
    const res = await fetch("https://roynaldkalele.com/wp-json/wp/v2/traning?_embed", {
      cache: "no-store", // biar selalu fresh kalau di Next.js
    });

    if (!res.ok) {
      throw new Error("Gagal fetch trainings");
    }

    const data = await res.json();

    // Mapping data dari WP API ke format Training
    const trainings: Training[] = data.map((item: any) => ({
      id: item.id,
      title: item.title.rendered,
      type: item.acf?.jenis_training || "offline", // pastikan ACF field `type` show_in_rest = true
      date: item.acf?.tanggal_dan_waktu || "",
      topic: item.acf?.kategori_training || "",
      location: item.acf?.kota || "",
      image:
        item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "https://via.placeholder.com/400",
      description: item.acf?.isi_detail_training || "",
      short_description: item.acf?.deskripsi_traning || "",
      url: item.acf?.url_cta || "",
    }));

    return trainings;
  } catch (err) {
    console.error("Error getTrainings:", err);
    return [];
  }
}


async getQuizzes(): Promise<Quiz[]> {
  const res = await fetch("https://roynaldkalele.com/wp-json/wp/v2/quiz", { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`Failed to fetch quizzes: ${res.status}`)
  }

  const data = await res.json()

  const savedUser = localStorage.getItem("lms_user")
  const user = savedUser ? JSON.parse(savedUser) : null
  let submissions: any[] = []

  if (user?.id) {
    const progressRes = await fetch(`https://roynaldkalele.com/wp-json/lms/v1/user/${user.id}/quiz`)
    const progressData = await progressRes.json()
    submissions = progressData?.quizzes || []
  }


 const quizzes: Quiz[] = data.map((item: any) => {
  const quizData = item.quiz_data
  const quizId = item.id

  // cek apakah quiz sudah dikerjakan user
  const submission = submissions.find(s => Number(s.quiz_id) === quizId)

  return {
    id: quizId,
    week: quizData.week ?? 0,
    title: item.title?.rendered ?? "Untitled Quiz",
    time_limit_minutes: quizData.time_limit_minutes ?? 0,
    questions: (quizData.questions || []).map((q: any, idx: number) => ({
      id: idx + 1,
      question: q.question,
      options: q.options || [],
      answer_type: q.answer_type ?? "multiple_choice",
    })),
    scoring: {
      show_correct_answer: quizData.scoring?.show_correct_answer ?? false,
    },

    // tambahan status progress user
    completed: !!submission,
    score: submission?.score ?? null,
    status: submission?.status?? null,
    finished_at: submission?.created_at ?? null,
  }
})


  return quizzes
}
async getProductKnowledge(): Promise<ProductKnowledge[]> {
  try {
    const res = await fetch('https://dorangadget.com/wp-json/wp/v2/product?per_page=15&page=1&_embed');
    const data = await res.json();

    return data.map((item: any) => {
      // Ambil gambar utama
      const image = item.better_featured_image?.source_url 
                    || item._embedded?.['wp:featuredmedia']?.[0]?.source_url 
                    || '';

      // Ambil fitur key_features jika ada (fallback ke acf lama)
      const keyFeatures = item.acf?.key_features || {};

      const features = [
        { title: keyFeatures.title_1, description: keyFeatures.description_1 || keyFeatures.desicription_1 },
        { title: keyFeatures.title_2, description: keyFeatures.description_2 || keyFeatures.desicription_2 },
        { title: keyFeatures.title_3, description: keyFeatures.description_3 },
        { title: keyFeatures.title_4, description: keyFeatures.description_4 },
      ].filter(f => f.title && f.description);

      return {
        id: item.id,
        product_name: item.title.rendered,
        summary: item.excerpt?.rendered || item.acf?.tagline || '',
        image,
        pdf_download: item.acf?.ebook_link || '',
        spesification: item.acf?.specifications || '',
        description: item.content?.rendered || item.acf?.product_overview || '',
        price: item.yoast_head_json?.product_price_amount || '',
        currency: item.yoast_head_json?.product_price_currency || '',
        brand: item.yoast_head_json?.product_brand || '',
        availability: item.yoast_head_json?.product_availability || '',
        features,
        link: item.link
      };
    });

  } catch (error) {
    console.error('Failed to fetch product knowledge:', error);
    return [];
  }
}


async submitQuiz(
  userId: string,
  quizId: number,
  answers: number[]
): Promise<{ score: number; status: string }> {
  try {
    // Ambil quiz dari API utama
    const res = await fetch(`https://roynaldkalele.com/wp-json/wp/v2/quiz/${quizId}`)
    const quizData = await res.json()

    // Validasi quiz_data
    const quiz = quizData.quiz_data
    if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      throw new Error("Quiz data invalid")
    }

    // Hitung skor
    let score = 0
    const questions = quiz.questions

    answers.forEach((answer, index) => {
      const correctAnswer = questions[index]?.correct_answer
      if (correctAnswer === undefined) return

      if (Array.isArray(correctAnswer)) {
        if (correctAnswer.includes(answer)) {
          score += 100 / questions.length
        }
      } else if (answer === correctAnswer) {
        score += 100 / questions.length
      }
    })

    const roundedScore = Math.round(score)
    const status = roundedScore >= 70 ? "Lulus" : "Tidak Lulus"
    const token = localStorage.getItem("lms_token")

    if (!token) {
      throw new Error("Token tidak ditemukan, silakan login dulu")
    }

    // Simpan ke WordPress via REST API custom
    const wpRes = await fetch(
      `https://roynaldkalele.com/wp-json/lms/v1/submit-quiz`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId, 
          quiz_id: quizId,
          answers,
          score: roundedScore,
          status,
        }),
      }
    )

    if (!wpRes.ok) {
      const errText = await wpRes.text()
      throw new Error(
        `Failed to save quiz submission. Status: ${wpRes.status}, Body: ${errText}`
      )
    }

    const result = await wpRes.json()

    // Opsional: update progress
    try {
      await fetch(
        `https://roynaldkalele.com/wp-json/lms/v1/user/${userId}/quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quiz_id: quizId,
            score: roundedScore,
            status,
          }),
        }
      )
    } catch (progressErr) {
      console.warn("Gagal update progress:", progressErr)
    }

    return { score: roundedScore, status: result.status ?? status }
  } catch (err) {
    console.error("SubmitQuiz error:", err)
    throw new Error("Failed to submit quiz")
  }
}





  async getQuizSubmissions(): Promise<QuizSubmission[]> {
    return JSON.parse(localStorage.getItem('quiz_submissions') || '[]')
  }

  async getTrainingParticipations(): Promise<{ training_id: number; participated_at: string }[]> {
    return JSON.parse(localStorage.getItem('training_participations') || '[]')
  }

  async participateInTraining(trainingId: number): Promise<void> {
    const participations = JSON.parse(localStorage.getItem('training_participations') || '[]')
    participations.push({
      training_id: trainingId,
      participated_at: new Date().toISOString()
    })
    localStorage.setItem('training_participations', JSON.stringify(participations))
  }
}

export const lmsApi = new LMSApi()