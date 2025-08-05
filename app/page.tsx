'use client';

import { useState } from 'react';
import { QuizCard } from '@/components/quiz/QuizCard';
import { TopicSelector } from '@/components/quiz/TopicSelector';
import { PDFQuizForm } from '@/components/quiz/PDFQuizForm';
import { QuizInterface } from '@/components/quiz/QuizInterface';
import { QuizResults } from '@/components/quiz/QuizResults';
import { generateTopicQuiz, generatePDFQuiz, Question, QuizResult } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, BookOpen, Target, Zap } from 'lucide-react';
import { toast } from 'sonner';

type ViewState = 'home' | 'topic-selector' | 'pdf-form' | 'quiz' | 'results';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateTopicQuiz = async (topic: string, numQuestions: number) => {
    setIsLoading(true);
    try {
      const response = await generateTopicQuiz(topic, numQuestions);
      setQuestions(response.questions);
      setCurrentView('quiz');
      toast.success(`Generated ${response.questions.length} questions in ${response.generationTime/1000}s`);
    } catch (error) {
      toast.error('Failed to generate quiz. Please try again.');
      console.error('Error generating topic quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePDFQuiz = async (pdfUrl: string, title: string, numQuestions: number) => {
    setIsLoading(true);
    try {
      const response = await generatePDFQuiz(pdfUrl, title, numQuestions);
      setQuestions(response.questions);
      setCurrentView('quiz');
      toast.success(`Generated ${response.questions.length} questions from PDF in ${response.generationTime/1000}s`);
    } catch (error) {
      toast.error('Failed to generate quiz from PDF. Please check the URL and try again.');
      console.error('Error generating PDF quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (answers: Record<number, string>, timeSpent: number) => {
    let score = 0;
    const detailedAnswers = questions.map((question, index) => {
      const userAnswer = answers[index] || '';
      let isCorrect = false;

      // Check if answer is correct based on question type
      if (question.type === 'short_answer') {
        // For short answers, be more lenient with matching
        const normalizedUser = userAnswer.toLowerCase().trim();
        const normalizedCorrect = question.answer.toLowerCase().trim();
        isCorrect = normalizedUser === normalizedCorrect || 
                   normalizedUser.includes(normalizedCorrect) ||
                   normalizedCorrect.includes(normalizedUser);
      } else {
        // For other types, exact match
        isCorrect = userAnswer === question.answer;
      }

      if (isCorrect) score++;

      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.answer,
        isCorrect,
        type: question.type,
        difficulty: question.difficulty,
        topic: question.topic,
        explanation: question.explanation
      };
    });

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      percentage: (score / questions.length) * 100,
      timeSpent,
      answers: detailedAnswers
    };

    setQuizResult(result);
    setCurrentView('results');
  };

  const handleRetakeQuiz = () => {
    setCurrentView('quiz');
    setQuizResult(null);
  };

  const handleBackHome = () => {
    setCurrentView('home');
    setQuestions([]);
    setQuizResult(null);
  };

  if (currentView === 'topic-selector') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setCurrentView('home')}
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Home
            </button>
          </div>
          <TopicSelector onGenerateQuiz={handleGenerateTopicQuiz} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  if (currentView === 'pdf-form') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={() => setCurrentView('home')}
              className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
            >
              ← Back to Home
            </button>
          </div>
          <PDFQuizForm onGenerateQuiz={handleGeneratePDFQuiz} isLoading={isLoading} />
        </div>
      </div>
    );
  }

  if (currentView === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <QuizInterface questions={questions} onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (currentView === 'results' && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
        <QuizResults 
          result={quizResult} 
          onRetakeQuiz={handleRetakeQuiz}
          onBackHome={handleBackHome}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6 p-4 bg-blue-100 rounded-full w-fit">
              <Brain className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              QuizWise
              <span className="block text-3xl font-normal text-blue-600 mt-2">
                AI-Powered Learning Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Generate intelligent quizzes from any topic or PDF document. Get instant feedback, 
              detailed analysis, and personalized study recommendations to accelerate your learning.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-sm text-gray-600">Generate comprehensive quizzes in under 3 seconds</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Smart Analysis</h3>
                <p className="text-sm text-gray-600">Detailed performance insights and study recommendations</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Multiple Formats</h3>
                <p className="text-sm text-gray-600">MCQ, fill-in-blanks, true/false, and short answers</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Quiz Options */}
      <div className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Quiz Type</h2>
            <p className="text-lg text-gray-600">
              Select how you'd like to create your personalized quiz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <QuizCard
              title="Topic-Based Quiz"
              description="Generate questions from popular exam topics like GMAT, SAT, GRE, or create custom quizzes on any subject you're studying."
              icon="topic"
              estimatedTime="1-2 seconds"
              onClick={() => setCurrentView('topic-selector')}
            />
            <QuizCard
              title="PDF Document Quiz"
              description="Upload a PDF document URL and get intelligent questions generated directly from the content. Perfect for textbooks and study materials."
              icon="pdf"
              estimatedTime="2-3 seconds"
              onClick={() => setCurrentView('pdf-form')}
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">Question Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">3s</div>
              <div className="text-sm text-gray-600">Generation Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-sm text-gray-600">Topics Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">AI</div>
              <div className="text-sm text-gray-600">Powered Analysis</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}