import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  status: 'completed' | 'not-started';
}

@Component({
  selector: 'app-exams-page',
  templateUrl: './exams.page.html',
  styleUrls: ['./exams.page.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule]
})
export class ExamsPage implements OnInit {
  exams: Exam[] = [];
  filteredExams: Exam[] = [];
  selectedExam: Exam | null = null;
  showModal = false;
  searchTerm = '';
  selectedDuration = '';
  isFiltered = false;
  isLoading: boolean = true;
  error: string | null = null;
  apiUrl: string = 'http://localhost:3000';

  // Statistics
  totalExams = 0;
  totalDuration = 0;
  totalMarks = 0;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    this.isLoading = true;
    this.error = null;

    // First, get all exams
    this.http.get<any[]>(`${this.apiUrl}/exams`).subscribe({
      next: (exams) => {
        // Then, get the user's submissions to determine exam status
        this.http.get<any[]>(`${this.apiUrl}/exam_submissions?userId=2`).subscribe({
          next: (submissions) => {
            console.log('Submissions:', submissions); // Debug log
            // Map exam status based on submissions
            this.exams = exams.map(exam => {
              const isCompleted = submissions.some(sub => sub.examId === exam.id);
              console.log(`Exam ${exam.id} status:`, isCompleted ? 'completed' : 'not-started'); // Debug log
              return {
                ...exam,
                status: isCompleted ? 'completed' : 'not-started'
              };
            });
            console.log('Processed exams:', this.exams); // Debug log
            this.filteredExams = this.exams;
            this.calculateStatistics();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading submissions:', error);
            this.error = 'Failed to load exam status. Please try again later.';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading exams:', error);
        this.error = 'Failed to load exams. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  calculateStatistics() {
    this.totalExams = this.exams.length;
    this.totalDuration = this.exams.reduce((sum, exam) => sum + exam.duration, 0);
    this.totalMarks = this.exams.reduce((sum, exam) => sum + exam.totalMarks, 0);
  }

  applyFilters() {
    this.filteredExams = this.exams.filter(exam => {
      const matchesSearch = exam.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          exam.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesDuration = !this.selectedDuration || exam.duration <= parseInt(this.selectedDuration);
      return matchesSearch && matchesDuration;
    });
    this.isFiltered = this.searchTerm !== '' || this.selectedDuration !== '';
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedDuration = '';
    this.filteredExams = this.exams;
    this.isFiltered = false;
  }

  startExam(examId: string) {
    this.router.navigate(['/student/exams', examId]);
  }

  closeModal() {
    this.showModal = false;
    this.selectedExam = null;
  }

  confirmStartExam() {
    if (this.selectedExam) {
      this.router.navigate(['/student/exams', this.selectedExam.id, 'take']);
    }
  }
}
