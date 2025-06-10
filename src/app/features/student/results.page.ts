import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface ExamSubmission {
  id: string;
  examId: string;
  userId: string;
  answers: Array<{
    questionId: string;
    selectedAnswer: string;
  }>;
  timeTaken: number;
  submittedAt: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredQuestions: number;
  examTitle: string;
  passingMarks: number;
}

interface Exam {
  id: string;
  title: string;
  passingMarks: number;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.css']
})
export class ResultsPage implements OnInit {
  submissions: ExamSubmission[] = [];
  exams: Exam[] = [];
  apiUrl: string = 'http://localhost:3000';
  
  // Statistics
  averageScore: number = 0;
  highestScore: number = 0;
  totalExams: number = 0;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadExams();
    this.loadSubmissions();
  }

  loadExams() {
    this.http.get<Exam[]>(`${this.apiUrl}/exams`).subscribe({
      next: (exams) => {
        this.exams = exams;
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        this.error = 'Failed to load exams';
      }
    });
  }

  loadSubmissions() {
    const userId = "2"; // TODO: Get from auth service
    this.http.get<ExamSubmission[]>(`${this.apiUrl}/exam_submissions?userId=${userId}&_sort=submittedAt&_order=desc`)
      .subscribe({
        next: (submissions) => {
          this.submissions = submissions;
          this.calculateStatistics();
        },
        error: (error) => {
          console.error('Error loading submissions:', error);
          this.error = 'Failed to load exam results';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  calculateStatistics() {
    if (this.submissions.length > 0) {
      // Filter out submissions with invalid scores
      const validSubmissions = this.submissions.filter(submission => 
        typeof submission.score === 'number' && !isNaN(submission.score)
      );

      if (validSubmissions.length > 0) {
        // Calculate average score
        const totalScore = validSubmissions.reduce((sum, submission) => 
          sum + submission.score, 0);
        this.averageScore = Math.round(totalScore / validSubmissions.length);

        // Calculate highest score
        this.highestScore = Math.max(...validSubmissions.map(submission => submission.score));
      } else {
        // Set default values if no valid submissions
        this.averageScore = 0;
        this.highestScore = 0;
      }

      // Set total exams
      this.totalExams = this.submissions.length;
    } else {
      // Set default values if no submissions
      this.averageScore = 0;
      this.highestScore = 0;
      this.totalExams = 0;
    }
  }

  getStatusClass(submission: ExamSubmission): string {
    if (submission.score >= 90) return 'excellent';
    if (submission.passed) return 'passed';
    return 'failed';
  }

  getStatusText(submission: ExamSubmission): string {
    if (submission.score >= 90) return 'Excellent';
    if (submission.passed) return 'Passed';
    return 'Failed';
  }

  confirmDeleteAll() {
    if (confirm('Are you sure you want to delete all exam results? This action cannot be undone.')) {
      this.deleteAllResults();
    }
  }

  deleteAllResults() {
    const userId = "2"; // TODO: Get from auth service
    this.isLoading = true;
    this.error = null;

    // Delete submissions one by one
    const deletePromises = this.submissions.map(submission => 
      this.http.delete(`${this.apiUrl}/exam_submissions/${submission.id}`).toPromise()
    );

    Promise.all(deletePromises)
      .then(() => {
        // Clear local data
        this.submissions = [];
        this.calculateStatistics();
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error deleting results:', error);
        this.error = 'Failed to delete results. Please try again.';
        this.isLoading = false;
      });
  }
}
