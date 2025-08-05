'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Question } from '@/lib/api';

interface QuizInterfaceProps {
  questions: Question[];
  onComplete: (answers: Record<number, string>, timeSpent: number) => void;
}

export function QuizInterface({ questions, onComplete }: QuizInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime] = useState(Date.now());
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswerChange = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(answers, timeElapsed);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeElapsed)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Answered: {answeredQuestions}/{questions.length}
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-semibold text-gray-900 leading-relaxed">
                {currentQ.question}
              </CardTitle>
              <div className="flex items-center space-x-4 mt-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentQ.difficulty}
                </span>
                <span className="text-sm text-gray-500">{currentQ.topic}</span>
                <span className="text-sm text-gray-500 capitalize">{currentQ.type.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {currentQ.type === 'mcq' && (
            <RadioGroup
              value={answers[currentQuestion] || ''}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQ.type === 'fill_in_the_blank' && (
            <div className="space-y-4">
              <RadioGroup
                value={answers[currentQuestion] || ''}
                onValueChange={handleAnswerChange}
                className="space-y-3"
              >
                {currentQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                    <RadioGroupItem value={option} id={`fill-option-${index}`} />
                    <Label htmlFor={`fill-option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentQ.type === 'true_false' && (
            <RadioGroup
              value={answers[currentQuestion] || ''}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {['True', 'False'].map((option) => (
                <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                  <RadioGroupItem value={option} id={`tf-${option}`} />
                  <Label htmlFor={`tf-${option}`} className="flex-1 cursor-pointer text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQ.type === 'short_answer' && (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your answer..."
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full p-3 text-base"
              />
              <p className="text-sm text-gray-500">
                Provide a concise answer. Both exact matches and close variations will be considered.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {answers[currentQuestion] ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-300" />
              )}
              <span className="text-sm text-gray-600">
                {answers[currentQuestion] ? 'Answered' : 'Not answered'}
              </span>
            </div>

            {currentQuestion === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center"
                disabled={answeredQuestions === 0}
              >
                Submit Quiz
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}