import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-exams',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './exams.page.html',
  styleUrls: ['./exams.page.css']
})
export class AdminExamsPage implements OnInit {
  exams: any[] = [];
  totalExams: number = 0;
  totalQuestions: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadExams();
  }

  loadExams() {
    this.http.get<any[]>('http://localhost:3000/exams').subscribe(exams => {
      this.exams = exams;
      this.totalExams = exams.length;
      this.loadTotalQuestions();
    });
  }

  loadTotalQuestions() {
    this.http.get<any[]>('http://localhost:3000/questions').subscribe(questions => {
      this.totalQuestions = questions.length;
    });
  }

  deleteExam(id: number) {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.http.delete(`http://localhost:3000/exams/${id}`).subscribe(() => {
        this.exams = this.exams.filter(exam => exam.id !== id);
        this.totalExams = this.exams.length;
        this.loadTotalQuestions();
      });
    }
  }
}
