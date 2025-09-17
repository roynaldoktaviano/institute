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
}

export interface ProductKnowledge {
  id: number
  product_name: string
  summary: string
  image: string
  pdf_download: string
}

export interface QuizSubmission {
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

  const quizzes: Quiz[] = data.map((item: any) => {
    const quizData = item.quiz_data
    const quizId = item.id

    return {
      id: quizId,
      week: quizData.week ?? 0,
      title: quizData.title ?? item.title?.rendered ?? "Untitled Quiz",
      time_limit_minutes: quizData.time_limit_minutes ?? 0,
      questions: (quizData.questions || []).map((q: any, idx: number) => ({
        id: idx + 1, // karena dari API selalu `id: 0`
        question: q.question,
        options: q.options || [],
        answer_type: q.answer_type ?? "multiple_choice",
      })),
      scoring: {
        show_correct_answer: quizData.scoring?.show_correct_answer ?? false,
      },
    }
  })

  return quizzes
}

  async getProductKnowledge(): Promise<ProductKnowledge[]> {
  try {
    const res = await fetch('https://roynaldkalele.com/wp-json/wp/v2/product-knowledge?_embed');
    const data = await res.json();

    return data.map((item: any) => ({

      
      id: item.id,
      product_name: item.title.rendered,
      summary: item.acf?.tagline || '',
      image: item._embedded['wp:featuredmedia'][0].source_url || '',
      pdf_download: item.acf?.ebook_link || ''
    }));
  } catch (error) {
    console.error('Failed to fetch product knowledge:', error);
    return [];
  }
}

async  submitQuiz(
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
    const questions = quiz.questions
    let score = 0

    answers.forEach((answer, index) => {
      const correctAnswer = questions[index]?.correct_answer
      if (correctAnswer === undefined) return

      if (Array.isArray(correctAnswer)) {
        if (correctAnswer.includes(answer)) {
          score += 100 / questions.length
        }
      } else {
        if (answer === correctAnswer) {
          score += 100 / questions.length
        }
      }
    })

    const roundedScore = Math.round(score)
    const status = roundedScore >= 70 ? "Lulus" : "Tidak Lulus"
    const token = localStorage.getItem('lms_token')

    // 🔥 Simpan ke WordPress via REST API custom
    const wpRes = await fetch(`https://roynaldkalele.com/wp-json/lms/v1/submit-quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      credentials: "include", // kalau rely on WP login cookie
      body: JSON.stringify({
        quiz_id: quizId,
        answers,
        score: roundedScore,
        status,
      }),
    })

    // Debugging detail
    console.log("WP response status:", wpRes.status)
    const responseText = await wpRes.text()
    console.log("WP raw response:", responseText)

    // if (!wpRes.ok) {
    //   throw new Error(`Failed to save quiz submission. Status: ${wpRes.status}, Body: ${responseText}`)
    // }

    const result = JSON.parse(responseText)
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