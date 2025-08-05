'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, ExternalLink } from 'lucide-react';

interface PDFQuizFormProps {
  onGenerateQuiz: (pdfUrl: string, title: string, numQuestions: number) => void;
  isLoading: boolean;
}

export function PDFQuizForm({ onGenerateQuiz, isLoading }: PDFQuizFormProps) {
  const [pdfUrl, setPdfUrl] = useState('');
  const [title, setTitle] = useState('');
  const [numQuestions, setNumQuestions] = useState('15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pdfUrl.trim() && title.trim()) {
      onGenerateQuiz(pdfUrl.trim(), title.trim(), parseInt(numQuestions));
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-blue-50 rounded-full w-fit">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">PDF-Based Quiz</CardTitle>
        <CardDescription className="text-gray-600">
          Upload a PDF document URL to generate questions based on its content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pdf-url" className="text-sm font-medium text-gray-700">
              PDF Document URL
            </Label>
            <div className="relative">
              <Input
                id="pdf-url"
                type="url"
                placeholder="https://example.com/document.pdf"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                disabled={isLoading}
                className="w-full pr-10"
              />
              <ExternalLink className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              Enter a direct link to a PDF file. The document will be analyzed to generate relevant questions.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-title" className="text-sm font-medium text-gray-700">
              Document Title
            </Label>
            <Input
              id="doc-title"
              type="text"
              placeholder="e.g., GMAT Math Review, Physics Textbook Chapter 5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Supported Content Types:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Test preparation materials (GMAT, SAT, GRE, etc.)</li>
              <li>• Academic textbooks and course materials</li>
              <li>• Study guides and educational documents</li>
              <li>• Research papers and technical documentation</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 disabled:opacity-50" 
            disabled={isLoading || !pdfUrl.trim() || !title.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing PDF...
              </>
            ) : (
              'Generate Quiz from PDF'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}