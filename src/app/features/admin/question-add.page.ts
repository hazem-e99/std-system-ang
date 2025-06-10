import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Question {
  text: string;
  options: string[];
  correctOption: number;
  examId: string;
}

@Component({
  selector: 'app-admin-question-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './question-add.page.html',
  styleUrls: ['./question-add.page.css']
})
export class AdminQuestionAddPage implements OnInit {
  examId: string = '';
  numberOfQuestions: number = 0;
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      correctOption: [0, Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['examId']) {
        this.examId = params['examId'];
      }
    });
  }

  startAddingQuestions() {
    if (this.numberOfQuestions > 0) {
      this.questions = Array(this.numberOfQuestions).fill(null).map(() => ({
        text: '',
        options: ['', '', '', ''],
        correctOption: 0,
        examId: this.examId
      }));
      this.currentQuestionIndex = 0;
      this.loadCurrentQuestion();
    }
  }

  loadCurrentQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      const question = this.questions[this.currentQuestionIndex];
      this.questionForm.patchValue({
        text: question.text,
        option1: question.options[0],
        option2: question.options[1],
        option3: question.options[2],
        option4: question.options[3],
        correctOption: question.correctOption
      });
    }
  }

  saveCurrentQuestion() {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      this.questions[this.currentQuestionIndex] = {
        text: formValue.text,
        options: [
          formValue.option1,
          formValue.option2,
          formValue.option3,
          formValue.option4
        ],
        correctOption: formValue.correctOption,
        examId: this.examId
      };
    }
  }

  nextQuestion() {
    if (this.questionForm.valid) {
      this.saveCurrentQuestion();
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.loadCurrentQuestion();
      } else {
        this.saveAllQuestions();
    }
  }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.saveCurrentQuestion();
      this.currentQuestionIndex--;
      this.loadCurrentQuestion();
    }
  }

  saveAllQuestions() {
    this.http.post('http://localhost:3000/questions', this.questions).subscribe({
        next: () => {
          this.router.navigate(['/admin/exams']);
        },
        error: (error) => {
          console.error('Error saving questions:', error);
        }
      });
    }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }
}
