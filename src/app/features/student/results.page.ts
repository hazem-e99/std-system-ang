import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './results.page.html'
})
export class ResultsPage {
  results: any[] = [];

  constructor(private http: HttpClient) {
    this.loadResults();
  }

  loadResults() {
    const student = JSON.parse(localStorage.getItem('currentUser')!);
    this.http
      .get<any[]>(`http://localhost:3000/results?studentId=${student.id}`)
      .subscribe((res) => {
        this.results = res;
        this.loadExamTitles();
      });
  }

  loadExamTitles() {
    for (let result of this.results) {
      this.http
        .get<any>(`http://localhost:3000/exams/${result.examId}`)
        .subscribe((exam) => {
          result.examTitle = exam.title;
        });
    }
  }
}
