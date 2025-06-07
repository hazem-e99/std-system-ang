import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './questions.page.html',
})
export class AdminQuestionsPage {
  examId!: number;
  questions: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.examId = Number(this.route.snapshot.queryParamMap.get('examId'));
    this.loadQuestions();
  }

  loadQuestions() {
    this.http.get<any[]>(`http://localhost:3000/questions?examId=${this.examId}`).subscribe((res) => {
      this.questions = res;
    });
  }

  deleteQuestion(id: number) {
    if (confirm('هل تريد حذف هذا السؤال؟')) {
      this.http.delete(`http://localhost:3000/questions/${id}`).subscribe(() => {
        this.loadQuestions();
      });
    }
  }
}
