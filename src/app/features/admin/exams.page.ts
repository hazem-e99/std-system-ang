import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-exams',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './exams.page.html'
})
export class AdminExamsPage {
  exams: any[] = [];

  constructor(private http: HttpClient) {
    this.loadExams();
  }

  loadExams() {
    this.http.get<any[]>('http://localhost:3000/exams').subscribe((res) => {
      this.exams = res;
    });
  }

  deleteExam(id: number) {
    if (confirm('هل أنت متأكد من حذف هذا الامتحان؟')) {
      this.http.delete(`http://localhost:3000/exams/${id}`).subscribe(() => {
        this.loadExams(); // إعادة تحميل الامتحانات بعد الحذف
      });
    }
  }
}
