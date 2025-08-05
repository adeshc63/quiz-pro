'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Brain } from 'lucide-react';

interface TopicSelectorProps {
  onGenerateQuiz: (topic: string, numQuestions: number) => void;
  isLoading: boolean;
}

const popularTopics = [
  'GMAT Quantitative Reasoning',
  'GMAT Verbal Reasoning',
  'SAT Math',
  'SAT Reading and Writing',
  'GRE Quantitative Reasoning',
  'GRE Verbal Reasoning',
  'IELTS Speaking',
  'IELTS Writing',
  'TOEFL Reading Comprehension',
  'Business Management',
  'Data Science Fundamentals',
  'Computer Science Algorithms',
  'Mathematics Calculus',
  'Physics Mechanics',
  'Chemistry Organic',
  'Biology Molecular'
];

export function TopicSelector({ onGenerateQuiz, isLoading }: TopicSelectorProps) {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState('15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const topic = customTopic || selectedTopic;
    if (topic) {
      onGenerateQuiz(topic, parseInt(numQuestions));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-50 rounded-full w-fit">
          <Brain className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Topic-Based Quiz</CardTitle>
        <CardDescription className="text-gray-600">
          Choose a subject area or enter your own topic to generate a customized quiz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic-select" className="text-sm font-medium text-gray-700">
              Select Popular Topic
            </Label>
            <Select onValueChange={setSelectedTopic} disabled={isLoading}>
              <SelectTrigger id="topic-select">
                <SelectValue placeholder="Choose from popular exam topics..." />
              </SelectTrigger>
              <SelectContent>
                {popularTopics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-topic" className="text-sm font-medium text-gray-700">
              Enter Custom Topic
            </Label>
            <Input
              id="custom-topic"
              type="text"
              placeholder="e.g., Machine Learning Basics, European History, etc."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num-questions" className="text-sm font-medium text-gray-700">
              Number of Questions
            </Label>
            <Select onValueChange={setNumQuestions} defaultValue="15" disabled={isLoading}>
              <SelectTrigger id="num-questions">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 Questions (~8 minutes)</SelectItem>
                <SelectItem value="15">15 Questions (~12 minutes)</SelectItem>
                <SelectItem value="20">20 Questions (~16 minutes)</SelectItem>
                <SelectItem value="25">25 Questions (~20 minutes)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 disabled:opacity-50" 
            disabled={isLoading || (!selectedTopic && !customTopic.trim())}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              'Generate Quiz'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}