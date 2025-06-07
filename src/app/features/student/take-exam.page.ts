import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  templateUrl: './take-exam.page.html'
})
export class TakeExamPage {
  examId!: number;
  questions: any[] = [];
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.examId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuestions();
  }

  loadQuestions() {
    this.http
      .get<any[]>(`http://localhost:3000/questions?examId=${this.examId}`)
      .subscribe((res) => {
        this.questions = res;
        this.form = this.fb.group({});
        for (const q of this.questions) {
          this.form.addControl(q.id, this.fb.control(''));
        }
      });
  }

  submitExam() {
    let score = 0;

    for (const q of this.questions) {
      if (this.form.value[q.id] === q.answer) {
        score++;
      }
    }

    const result = {
      examId: this.examId,
      studentId: JSON.parse(localStorage.getItem('currentUser')!).id,
      score: score,
      total: this.questions.length
    };

    this.http.post('http://localhost:3000/results', result).subscribe(() => {
      alert(`تم تقديم الامتحان. نتيجتك: ${score} / ${this.questions.length}`);
    });
  }
}
