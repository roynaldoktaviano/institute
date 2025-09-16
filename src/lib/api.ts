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
    // Mock data based on the JSON structure
    return [
      {
        week: 1,
        title: "Quiz Mingguan Drone Basic",
        time_limit_minutes: 20,
        questions: [
          {
            id: 1,
            question: "Apa fungsi utama GPS pada drone?",
            options: [
              "Menentukan posisi drone",
              "Meningkatkan kualitas kamera",
              "Mengurangi getaran propeller",
              "Menambah daya baterai"
            ],
            answer_type: "multiple_choice"
          },
          {
            id: 2,
            question: "Kapan waktu terbaik untuk menerbangkan drone?",
            options: [
              "Saat cuaca cerah dan angin tenang",
              "Saat hujan rintik-rintik",
              "Saat angin kencang",
              "Saat malam hari tanpa lampu"
            ],
            answer_type: "multiple_choice"
          }
        ],
        scoring: {
          show_correct_answer: false
        }
      },
      {
        week: 2,
        title: "Quiz Teknik Fotografi Drone",
        time_limit_minutes: 25,
        questions: [
          {
            id: 1,
            question: "Apa yang dimaksud dengan rule of thirds dalam fotografi?",
            options: [
              "Membagi frame menjadi 9 bagian sama besar",
              "Menggunakan tiga warna utama",
              "Mengambil tiga foto berturut-turut",
              "Mengatur exposure tiga kali"
            ],
            answer_type: "multiple_choice"
          }
        ],
        scoring: {
          show_correct_answer: false
        }
      },
      {
        week: 3,
        title: "Quiz Regulasi Drone",
        time_limit_minutes: 15,
        questions: [
          {
            id: 1,
            question: "Berapa ketinggian maksimal drone boleh terbang di area pemukiman?",
            options: [
              "150 meter",
              "500 meter",
              "1000 meter",
              "Tidak ada batasan"
            ],
            answer_type: "multiple_choice"
          }
        ],
        scoring: {
          show_correct_answer: false
        }
      }
    ]
  }

  async getProductKnowledge(): Promise<ProductKnowledge[]> {
    // Mock data based on the JSON structure
    return [
      {
        id: 1,
        product_name: "DJI Mavic 3",
        summary: "Drone lipat profesional dengan kamera Hasselblad.",
        image: "https://roynaldkalele.com/wp-content/uploads/mavic3.jpg",
        pdf_download: "https://roynaldkalele.com/wp-content/uploads/mavic3-specs.pdf"
      },
      {
        id: 2,
        product_name: "DJI Mini 3 Pro",
        summary: "Drone ringan di bawah 249 gram dengan kamera profesional.",
        image: "https://roynaldkalele.com/wp-content/uploads/mini3pro.jpg",
        pdf_download: "https://roynaldkalele.com/wp-content/uploads/mini3pro-specs.pdf"
      },
      {
        id: 3,
        product_name: "DJI Air 2S",
        summary: "Drone all-in-one dengan sensor 1-inch dan 5.4K video.",
        image: "https://roynaldkalele.com/wp-content/uploads/air2s.jpg",
        pdf_download: "https://roynaldkalele.com/wp-content/uploads/air2s-specs.pdf"
      },
      {
        id: 4,
        product_name: "DJI Phantom 4 Pro",
        summary: "Drone profesional dengan kamera 20MP dan obstacle sensing.",
        image: "https://roynaldkalele.com/wp-content/uploads/phantom4pro.jpg",
        pdf_download: "https://roynaldkalele.com/wp-content/uploads/phantom4pro-specs.pdf"
      }
    ]
  }

  async submitQuiz(quizId: number, answers: number[]): Promise<{ score: number; status: string }> {
    // Mock quiz submission - in real app, this would call the API
    const correctAnswers = [0, 0, 0] // Mock correct answers
    let score = 0
    
    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        score += 100 / answers.length
      }
    })

    const roundedScore = Math.round(score)
    const status = roundedScore >= 70 ? 'Lulus' : 'Tidak Lulus'

    // Save submission to localStorage for demo purposes
    const submissions = JSON.parse(localStorage.getItem('quiz_submissions') || '[]')
    submissions.push({
      quiz_id: quizId,
      answers,
      score: roundedScore,
      submitted_at: new Date().toISOString()
    })
    localStorage.setItem('quiz_submissions', JSON.stringify(submissions))

    return { score: roundedScore, status }
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