import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-question-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './question-add.page.html',
})
export class QuestionAddPage {
  examId!: number;
  form: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.examId = Number(this.route.snapshot.queryParamMap.get('examId'));
    this.form = this.fb.group({
      text: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      correctAnswer: ['', Validators.required],
    });
  }

  save() {
    if (this.form.valid) {
      const values = this.form.value;
      const question = {
        examId: this.examId,
        text: values.text,
        options: [values.option1, values.option2, values.option3, values.option4],
        correctAnswer: values.correctAnswer,
      };

      this.http.post('http://localhost:3000/questions', question).subscribe(() => {
        this.router.navigate(['/admin/questions'], {
          queryParams: { examId: this.examId },
        });
      });
    }
  }
}
