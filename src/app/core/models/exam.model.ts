export interface Exam {
  id: string;
  title: string;
  description: string;
  startTime: string;
  duration: number;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  createdAt: string;
  isActive: boolean;
}

export interface Question {
  id: string;
  examId: string;
  text: string;
  options: string[];
  correctOption: number;
  marks: number;
  type: 'multiple_choice';
}

export interface ExamSubmission {
  id: string;
  examId: string;
  userId: string;
  answers: Array<{
    questionId: string;
    selectedAnswer: number;
  }>;
  timeTaken: number;
  submittedAt: string;
  score?: number;
  passed?: boolean;
}

export interface ExamResult {
  id: string;
  examId: string;
  userId: string;
  studentName: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  passed: boolean;
  passingMarks: number;
  timeTaken: number;
  timestamp: string;
}