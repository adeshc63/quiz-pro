const API_BASE_URL = 'https://moval.koyeb.app';

export interface Question {
  question: string;
  type: 'mcq' | 'fill_in_the_blank' | 'true_false' | 'short_answer';
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface QuizResponse {
  questions: Question[];
  generationTime: number;
  success: boolean;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  timeSpent: number;
  answers: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    type: string;
    difficulty: string;
    topic: string;
    explanation: string;
  }[];
}

export async function generateTopicQuiz(topic: string, numQuestions: number = 15): Promise<QuizResponse> {
  const response = await fetch(`${API_BASE_URL}/api/generate-topic-quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic,
      numQuestions,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate quiz');
  }

  return response.json();
}

export async function generatePDFQuiz(pdfUrl: string, title: string, numQuestions: number = 15): Promise<QuizResponse> {
  const response = await fetch(`${API_BASE_URL}/api/generate-fast-quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pdfUrl,
      title,
      numQuestions,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF quiz');
  }

  return response.json();
}

export async function analyzePDF(pdfUrl: string, title: string) {
  const response = await fetch(`${API_BASE_URL}/api/analyze-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pdfUrl,
      title,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze PDF');
  }

  return response.json();
}