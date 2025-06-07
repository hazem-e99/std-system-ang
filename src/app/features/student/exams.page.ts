import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './exams.page.html'
})
export class ExamsPage {
  private http = inject(HttpClient);
  exams: any[] = [];

  constructor( private router: Router) {
    this.loadExams();
  }

  loadExams() {
    this.http.get<any[]>('http://localhost:3000/exams').subscribe((res) => {
      this.exams = res;
    });
  }

  startExam(id: number) {
  this.router.navigate(['/student/exam', id]);
    // لاحقًا: this.router.navigate(['/student/exam', id]);
  }
}
