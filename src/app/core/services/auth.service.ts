import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, map, catchError, throwError } from 'rxjs';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000';
  private readonly storageKey = 'exam_system_user';
  
  private currentUser = signal<User | null>(this.getUserFromStorage());
  
  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly isStudent = computed(() => this.currentUser()?.role === 'student');

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  login(credentials: LoginRequest): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${credentials.email}&password=${credentials.password}`)
      .pipe(
        map(users => {
          if (users.length === 0) {
            throw new Error('Invalid email or password');
          }
          return users[0];
        }),
        tap(user => {
          this.setCurrentUser(user);
          this.notificationService.success('Welcome!', `Logged in successfully as ${user.name}`);
          this.redirectAfterLogin(user);
        }),
        catchError(error => {
          this.notificationService.error('Login Failed', error.message || 'Invalid credentials');
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<User> {
    // Ensure only students can register
    if (userData.role !== 'student') {
      return throwError(() => new Error('Only students can register'));
    }

    const newUser: Omit<User, 'id'> = {
      ...userData,
      createdAt: new Date().toISOString()
    };

    return this.http.post<User>(`${this.apiUrl}/users`, newUser)
      .pipe(
        tap(() => {
          this.notificationService.success('Registration Successful', 'You can now log in with your credentials');
        }),
        catchError(error => {
          this.notificationService.error('Registration Failed', error.message || 'Failed to create account');
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.storageKey);
    this.notificationService.info('Logged Out', 'You have been logged out successfully');
    this.router.navigate(['/auth/login']);
  }

  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem(this.storageKey, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private redirectAfterLogin(user: User): void {
    const redirectUrl = user.role === 'admin' ? '/admin' : '/student';
    this.router.navigate([redirectUrl]);
  }
}