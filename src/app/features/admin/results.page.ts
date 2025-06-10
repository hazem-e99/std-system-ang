import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { ExamService, Exam, ExamSubmission } from '../../core/services/exam.service';
import { AuthService, User } from '../../core/services/auth.service';

interface Result {
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
  timestamp: Date;
}

@Component({
  selector: 'app-admin-results',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.css']
})
export class AdminResultsPage implements OnInit {
  loading = false;
  error: string | null = null;
  results: Result[] = [];
  filteredResults: Result[] = [];
  exams: Exam[] = [];
  totalStudents = 0;
  totalExams = 0;
  averageScore = 0;
  highestScore = 0;
  
  // Filters
  searchTerm = '';
  selectedExamId = '';
  selectedStatus = '';
  selectedScoreRange = '';
  startDate: string | null = null;
  endDate: string | null = null;
  isFiltered: boolean = false;
  showModal = false;
  selectedResult: Result | null = null;

  private apiUrl: string = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private examService: ExamService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadExams();
    this.loadResults();
  }

  loadExams() {
    this.http.get<Exam[]>('http://localhost:3000/exams').subscribe(exams => {
      this.exams = exams;
      this.totalExams = exams.length;
    });
  }

  async loadResults() {
    try {
      this.loading = true;
      
      // Get all results directly from the results endpoint
      const results = await this.http.get<Result[]>(`${this.apiUrl}/results`).toPromise();
      if (!results) return;
      
      this.results = results;

      // Calculate statistics
      this.totalStudents = new Set(this.results.map(r => r.userId)).size;
      this.totalExams = new Set(this.results.map(r => r.examId)).size;
      this.averageScore = this.results.reduce((acc, curr) => acc + curr.score, 0) / this.results.length;
      this.highestScore = Math.max(...this.results.map(r => r.score));

      // Get unique exams for filter
      const exams = await this.http.get<Exam[]>(`${this.apiUrl}/exams`).toPromise();
      if (exams) {
        this.exams = exams;
      }

      // Apply initial filters
      this.applyFilters();
    } catch (error) {
      console.error('Error loading results:', error);
      this.error = 'An error occurred while loading results';
    } finally {
      this.loading = false;
    }
  }

  calculateStatistics() {
    if (this.results.length > 0) {
      // Calculate total unique students
      const uniqueStudents = new Set(this.results.map(r => r.userId));
      this.totalStudents = uniqueStudents.size;

      // Calculate average score
      const totalScore = this.results.reduce((sum, result) => 
        sum + (result.score / result.totalQuestions * 100), 0);
      this.averageScore = Math.round(totalScore / this.results.length);

      // Calculate highest score
      this.highestScore = Math.max(...this.results.map(result => 
        (result.score / result.totalQuestions * 100)));
    }
  }

  applyFilters() {
    this.filteredResults = this.results.filter(result => {
      const matchesSearch = !this.searchTerm || 
        result.studentName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesExam = !this.selectedExamId || 
        result.examId === this.selectedExamId;
      
      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'passed' && result.passed) ||
        (this.selectedStatus === 'failed' && !result.passed);
      
      const matchesScoreRange = !this.selectedScoreRange || 
        this.isScoreInRange(result.score, this.selectedScoreRange);
      
      const matchesDateRange = this.isDateInRange(result.timestamp);

      return matchesSearch && matchesExam && matchesStatus && matchesScoreRange && matchesDateRange;
    });

    this.isFiltered = this.searchTerm !== '' || 
      this.selectedExamId !== '' || 
      this.selectedStatus !== '' || 
      this.selectedScoreRange !== '' || 
      this.startDate !== null || 
      this.endDate !== null;
  }

  isScoreInRange(score: number, range: string): boolean {
    const [min, max] = range.split('-').map(Number);
    return score >= min && score <= max;
  }

  isDateInRange(date: Date): boolean {
    if (!this.startDate && !this.endDate) return true;
    
    const resultDate = new Date(date);
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;
    
    if (start && end) {
      return resultDate >= start && resultDate <= end;
    } else if (start) {
      return resultDate >= start;
    } else if (end) {
      return resultDate <= end;
    }
    
    return true;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedExamId = '';
    this.selectedStatus = '';
    this.selectedScoreRange = '';
    this.startDate = null;
    this.endDate = null;
    this.applyFilters();
  }

  getStatusClass(result: Result): string {
    if (!result.passed) return 'failed';
    return result.score >= 90 ? 'excellent' : 'passed';
  }

  getStatusText(result: Result): string {
    if (!result.passed) return 'Failed';
    return result.score >= 90 ? 'Excellent' : 'Passed';
  }

  viewDetails(result: Result) {
    this.selectedResult = result;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedResult = null;
  }

  async deleteResult(id: string) {
    if (confirm('Are you sure you want to delete this result?')) {
      try {
        await this.examService.deleteExamSubmission(id).toPromise();
        this.results = this.results.filter(r => r.id !== id);
        this.applyFilters();
      } catch (error) {
        console.error('Error deleting result:', error);
        alert('An error occurred while deleting the result');
      }
    }
  }

  exportResults() {
    const data = this.filteredResults.map(result => ({
      'Student Name': result.studentName,
      'Exam Title': result.examTitle,
      'Score': `${result.correctAnswers}/${result.totalQuestions}`,
      'Percentage': `${result.score.toFixed(1)}%`,
      'Status': this.getStatusText(result),
      'Date': result.timestamp
    }));

    const csv = this.convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exam_results.csv';
    link.click();
  }

  private convertToCSV(data: any[]): string {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header]));
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}
