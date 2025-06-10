import { Routes } from '@angular/router';
import { authGuard, adminGuard, studentGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'exams',
        loadComponent: () => import('./features/admin/exams/exams.component').then(m => m.AdminExamsComponent)
      },
      {
        path: 'exams/add',
        loadComponent: () => import('./features/admin/exams/exam-form/exam-form.component').then(m => m.ExamFormComponent)
      },
      {
        path: 'exams/edit/:id',
        loadComponent: () => import('./features/admin/exams/exam-form/exam-form.component').then(m => m.ExamFormComponent)
      },
      {
        path: 'questions',
        loadComponent: () => import('./features/admin/questions/questions.component').then(m => m.AdminQuestionsComponent)
      },
      {
        path: 'questions/add',
        loadComponent: () => import('./features/admin/questions/question-form/question-form.component').then(m => m.QuestionFormComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./features/admin/results/results.component').then(m => m.AdminResultsComponent)
      }
    ]
  },
  {
    path: 'student',
    canActivate: [studentGuard],
    loadComponent: () => import('./features/student/layout/student-layout.component').then(m => m.StudentLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'exams',
        pathMatch: 'full'
      },
      {
        path: 'exams',
        loadComponent: () => import('./features/student/exams/exams.component').then(m => m.StudentExamsComponent)
      },
      {
        path: 'exams/:id/take',
        loadComponent: () => import('./features/student/take-exam/take-exam.component').then(m => m.TakeExamComponent)
      },
      {
        path: 'exams/:id/result',
        loadComponent: () => import('./features/student/exam-result/exam-result.component').then(m => m.ExamResultComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./features/student/results/results.component').then(m => m.StudentResultsComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];