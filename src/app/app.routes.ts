import { Routes } from '@angular/router';
import { LoginPage } from './features/auth/login.page';
import { RegisterPage } from './features/auth/register.page';
import { ExamsPage } from './features/student/exams.page';
import { TakeExamPage } from './features/student/take-exam.page';
import { ResultsPage } from './features/student/results.page';
import { AdminLoginPage } from './features/admin/login.page';
import { AdminDashboardPage } from './features/admin/dashboard.page';
import { AdminExamsPage } from './features/admin/exams.page';
import { ExamsAddPage } from './features/admin/exams-add.page';
import { ExamsEditPage } from './features/admin/exams-edit.page';
import { AdminQuestionsPage } from './features/admin/questions.page';
import { QuestionAddPage } from './features/admin/question-add.page';
import { QuestionEditPage } from './features/admin/question-edit.page';
import { AdminResultsPage } from './features/admin/results.page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  {
    path: 'student',
    children: [
      { path: '', redirectTo: 'exams', pathMatch: 'full' },
      { path: 'exams', component: ExamsPage },
          { path: 'exam/:id', component: TakeExamPage },
              { path: 'results', component: AdminResultsPage }


    ]
  },
{
  path: 'admin',
  children: [
    { path: '', component: AdminDashboardPage },
    { path: 'login', component: AdminLoginPage },
        { path: 'exams', component: AdminExamsPage },
            { path: 'exams/add', component: ExamsAddPage },
                { path: 'exams/edit/:id', component: ExamsEditPage },
                    { path: 'questions', component: AdminQuestionsPage },
                        { path: 'questions/add', component: QuestionAddPage },
                            { path: 'questions/edit', component: QuestionEditPage },
                                { path: 'results', component: ResultsPage },


 // <== هنا




    // باقي الصفحات سنضيفها لاحقًا: exams, questions, results
  ]
}
];
