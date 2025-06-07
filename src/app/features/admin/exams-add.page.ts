import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exams-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './exams-add.page.html',
})
export class ExamsAddPage {
  form;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  save() {
    if (this.form.valid) {
      this.http
        .post('http://localhost:3000/exams', this.form.value)
        .subscribe(() => {
          this.router.navigate(['/admin/exams']);
        });
    }
  }
}
