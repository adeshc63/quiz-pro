'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Clock, 
  Target, 
  BookOpen, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Home
} from 'lucide-react';
import { QuizResult } from '@/lib/api';

interface QuizResultsProps {
  result: QuizResult;
  onRetakeQuiz: () => void;
  onBackHome: () => void;
}

export function QuizResults({ result, onRetakeQuiz, onBackHome }: QuizResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'bg-green-600', textColor: 'text-green-600' };
    if (percentage >= 80) return { level: 'Very Good', color: 'bg-blue-600', textColor: 'text-blue-600' };
    if (percentage >= 70) return { level: 'Good', color: 'bg-yellow-600', textColor: 'text-yellow-600' };
    if (percentage >= 60) return { level: 'Fair', color: 'bg-orange-600', textColor: 'text-orange-600' };
    return { level: 'Needs Improvement', color: 'bg-red-600', textColor: 'text-red-600' };
  };

  const performance = getPerformanceLevel(result.percentage);

  // Analyze performance by topic and difficulty
  const topicAnalysis = result.answers.reduce((acc, answer) => {
    if (!acc[answer.topic]) {
      acc[answer.topic] = { correct: 0, total: 0 };
    }
    acc[answer.topic].total++;
    if (answer.isCorrect) {
      acc[answer.topic].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const difficultyAnalysis = result.answers.reduce((acc, answer) => {
    if (!acc[answer.difficulty]) {
      acc[answer.difficulty] = { correct: 0, total: 0 };
    }
    acc[answer.difficulty].total++;
    if (answer.isCorrect) {
      acc[answer.difficulty].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const typeAnalysis = result.answers.reduce((acc, answer) => {
    if (!acc[answer.type]) {
      acc[answer.type] = { correct: 0, total: 0 };
    }
    acc[answer.type].total++;
    if (answer.isCorrect) {
      acc[answer.type].correct++;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  // Generate suggestions
  const generateSuggestions = () => {
    const suggestions = [];
    
    // Performance-based suggestions
    if (result.percentage < 60) {
      suggestions.push("Focus on fundamental concepts - consider reviewing basic materials before taking advanced quizzes.");
    } else if (result.percentage < 80) {
      suggestions.push("Good foundation! Work on challenging questions to reach the next level.");
    } else {
      suggestions.push("Excellent performance! Challenge yourself with advanced topics and timed practice.");
    }

    // Topic-based suggestions
    const weakTopics = Object.entries(topicAnalysis)
      .filter(([_, data]) => (data.correct / data.total) < 0.7)
      .map(([topic, _]) => topic);
    
    if (weakTopics.length > 0) {
      suggestions.push(`Strengthen these areas: ${weakTopics.join(', ')}`);
    }

    // Difficulty-based suggestions
    const weakDifficulties = Object.entries(difficultyAnalysis)
      .filter(([_, data]) => (data.correct / data.total) < 0.6)
      .map(([difficulty, _]) => difficulty);

    if (weakDifficulties.includes('easy')) {
      suggestions.push("Review fundamental concepts - focus on mastering basic principles first.");
    }
    if (weakDifficulties.includes('medium')) {
      suggestions.push("Practice more intermediate-level problems to build confidence.");
    }
    if (weakDifficulties.includes('hard')) {
      suggestions.push("Challenge yourself with advanced practice questions and detailed explanations.");
    }

    // Type-based suggestions
    const weakTypes = Object.entries(typeAnalysis)
      .filter(([_, data]) => (data.correct / data.total) < 0.7)
      .map(([type, _]) => type);

    if (weakTypes.includes('mcq')) {
      suggestions.push("Work on elimination strategies for multiple choice questions.");
    }
    if (weakTypes.includes('fill_in_the_blank')) {
      suggestions.push("Focus on vocabulary and key terms comprehension.");
    }
    if (weakTypes.includes('true_false')) {
      suggestions.push("Pay attention to absolute statements and exceptions in true/false questions.");
    }
    if (weakTypes.includes('short_answer')) {
      suggestions.push("Practice expressing ideas clearly and concisely in your own words.");
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overall Results */}
      <Card className="border-2">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-4 bg-blue-50 rounded-full w-fit">
            <Trophy className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Quiz Complete!</CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Here's how you performed
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">{result.score}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{result.totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="space-y-2">
              <div className={`text-3xl font-bold ${performance.textColor}`}>
                {result.percentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-gray-900">{formatTime(result.timeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>

          <div className="space-y-4">
            <Progress value={result.percentage} className="w-full h-3" />
            <Badge variant="secondary" className={`${performance.color} text-white text-lg px-4 py-2`}>
              {performance.level}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* By Topic */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">By Topic</h4>
              <div className="space-y-3">
                {Object.entries(topicAnalysis).map(([topic, data]) => {
                  const percentage = (data.correct / data.total) * 100;
                  return (
                    <div key={topic} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 truncate">{topic}</span>
                        <span className="font-medium">
                          {data.correct}/{data.total} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Difficulty */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">By Difficulty</h4>
              <div className="space-y-3">
                {Object.entries(difficultyAnalysis).map(([difficulty, data]) => {
                  const percentage = (data.correct / data.total) * 100;
                  return (
                    <div key={difficulty} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={`capitalize font-medium ${
                          difficulty === 'easy' ? 'text-green-600' :
                          difficulty === 'medium' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {difficulty}
                        </span>
                        <span className="font-medium">
                          {data.correct}/{data.total} ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personalized Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Study Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-900 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
            Question Review
          </CardTitle>
          <CardDescription>
            Review your answers and explanations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {result.answers.map((answer, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                answer.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex-1">
                    {index + 1}. {answer.question}
                  </h4>
                  {answer.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 ml-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 ml-2" />
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {answer.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${
                      answer.difficulty === 'easy' ? 'text-green-600' :
                      answer.difficulty === 'medium' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {answer.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {answer.topic}
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">Your Answer: </span>
                    <span className={answer.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                      {answer.userAnswer || 'No answer provided'}
                    </span>
                  </div>
                  
                  {!answer.isCorrect && (
                    <div>
                      <span className="text-gray-600">Correct Answer: </span>
                      <span className="text-green-700 font-medium">{answer.correctAnswer}</span>
                    </div>
                  )}
                  
                  {answer.explanation && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <span className="text-gray-600">Explanation: </span>
                      <span className="text-gray-800">{answer.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onRetakeQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button 
              onClick={onBackHome}
              variant="outline"
              className="flex items-center justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}