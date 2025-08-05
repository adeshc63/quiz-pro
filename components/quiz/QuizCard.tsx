'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Clock, Brain } from 'lucide-react';

interface QuizCardProps {
  title: string;
  description: string;
  icon: 'topic' | 'pdf';
  onClick: () => void;
  estimatedTime?: string;
}

export function QuizCard({ title, description, icon, onClick, estimatedTime }: QuizCardProps) {
  const IconComponent = icon === 'topic' ? Brain : FileText;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-3 bg-blue-50 rounded-full w-fit">
          <IconComponent className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
        <CardDescription className="text-gray-600 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        {estimatedTime && (
          <div className="flex items-center justify-center mb-4 text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            {estimatedTime}
          </div>
        )}
        <Button 
          onClick={onClick} 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}