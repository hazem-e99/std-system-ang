import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  form!: ReturnType<FormBuilder['group']>;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.http
      .get<any[]>(`http://localhost:3000/users?email=${email}&password=${password}`)
      .subscribe({
        next: (users) => {
          if (users.length === 0) {
            this.errorMessage = 'Invalid email or password';
            return;
          }

          const user = users[0];
          localStorage.setItem('currentUser', JSON.stringify(user));

          // Redirect based on role
          if (user.role === 'admin' || user.role === 'teacher') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/student']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'An error occurred during login';
        }
      });
  }
}
