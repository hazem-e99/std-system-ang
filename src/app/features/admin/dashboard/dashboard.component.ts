import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';

Chart.register(...registerables);

interface DashboardStats {
  totalExams: number;
  totalQuestions: number;
  totalStudents: number;
  averageScore: number;
  recentSubmissions: number;
  passRate: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  template: `
    <div class="dashboard">
      <div class="dashboard__header">
        <div class="dashboard__welcome">
          <h1>Welcome back, {{ authService.user()?.name }}!</h1>
          <p>Here's what's happening with your exam system today.</p>
        </div>
        <div class="dashboard__date">
          <i class="fas fa-calendar-alt"></i>
          <span>{{ currentDate | date:'EEEE, MMMM d, y' }}</span>
        </div>
      </div>

      @if (isLoading()) {
        <app-loading message="Loading dashboard data..."></app-loading>
      } @else {
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card stat-card--primary">
            <div class="stat-card__icon">
              <i class="fas fa-file-alt"></i>
            </div>
            <div class="stat-card__content">
              <h3>{{ stats().totalExams }}</h3>
              <p>Total Exams</p>
              <div class="stat-card__trend">
                <i class="fas fa-arrow-up"></i>
                <span>+12% from last month</span>
              </div>
            </div>
          </div>

          <div class="stat-card stat-card--success">
            <div class="stat-card__icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-card__content">
              <h3>{{ stats().totalStudents }}</h3>
              <p>Active Students</p>
              <div class="stat-card__trend">
                <i class="fas fa-arrow-up"></i>
                <span>+8% from last month</span>
              </div>
            </div>
          </div>

          <div class="stat-card stat-card--info">
            <div class="stat-card__icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-card__content">
              <h3>{{ stats().averageScore }}%</h3>
              <p>Average Score</p>
              <div class="stat-card__trend">
                <i class="fas fa-arrow-up"></i>
                <span>+5% from last month</span>
              </div>
            </div>
          </div>

          <div class="stat-card stat-card--warning">
            <div class="stat-card__icon">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="stat-card__content">
              <h3>{{ stats().passRate }}%</h3>
              <p>Pass Rate</p>
              <div class="stat-card__trend">
                <i class="fas fa-arrow-up"></i>
                <span>+3% from last month</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section">
          <div class="chart-card">
            <div class="chart-card__header">
              <h3>Student Performance Trends</h3>
              <p>Average scores over the last 6 months</p>
            </div>
            <div class="chart-card__content">
              <canvas #performanceChart></canvas>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-card__header">
              <h3>Exam Participation</h3>
              <p>Number of students per exam</p>
            </div>
            <div class="chart-card__content">
              <canvas #participationChart></canvas>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <a routerLink="/admin/exams/add" class="action-card action-card--primary">
              <div class="action-card__icon">
                <i class="fas fa-plus-circle"></i>
              </div>
              <div class="action-card__content">
                <h3>Create New Exam</h3>
                <p>Set up a new exam with questions and settings</p>
              </div>
              <div class="action-card__arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </a>

            <a routerLink="/admin/questions" class="action-card action-card--success">
              <div class="action-card__icon">
                <i class="fas fa-question-circle"></i>
              </div>
              <div class="action-card__content">
                <h3>Manage Questions</h3>
                <p>Add, edit, or organize your question bank</p>
              </div>
              <div class="action-card__arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </a>

            <a routerLink="/admin/results" class="action-card action-card--info">
              <div class="action-card__icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <div class="action-card__content">
                <h3>View Results</h3>
                <p>Analyze student performance and exam statistics</p>
              </div>
              <div class="action-card__arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </a>

            <a routerLink="/admin/exams" class="action-card action-card--warning">
              <div class="action-card__icon">
                <i class="fas fa-cog"></i>
              </div>
              <div class="action-card__content">
                <h3>Manage Exams</h3>
                <p>Edit existing exams and their configurations</p>
              </div>
              <div class="action-card__arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      background: white;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .dashboard__welcome h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.5rem 0;
    }

    .dashboard__welcome p {
      color: #6b7280;
      margin: 0;
      font-size: 1.1rem;
    }

    .dashboard__date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #6b7280;
      font-size: 1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-card__icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: white;
    }

    .stat-card--primary .stat-card__icon {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .stat-card--success .stat-card__icon {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .stat-card--info .stat-card__icon {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
    }

    .stat-card--warning .stat-card__icon {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .stat-card__content h3 {
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .stat-card__content p {
      color: #6b7280;
      margin: 0 0 0.5rem 0;
      font-size: 0.875rem;
    }

    .stat-card__trend {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #10b981;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .chart-card__header {
      margin-bottom: 1.5rem;
    }

    .chart-card__header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .chart-card__header p {
      color: #6b7280;
      margin: 0;
      font-size: 0.875rem;
    }

    .chart-card__content {
      height: 300px;
      position: relative;
    }

    .quick-actions {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .quick-actions h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 1.5rem 0;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border: 2px solid #f3f4f6;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s;
      background: #fafafa;
    }

    .action-card:hover {
      border-color: #e5e7eb;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .action-card__icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: white;
      flex-shrink: 0;
    }

    .action-card--primary .action-card__icon {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .action-card--success .action-card__icon {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .action-card--info .action-card__icon {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
    }

    .action-card--warning .action-card__icon {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .action-card__content {
      flex: 1;
    }

    .action-card__content h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .action-card__content p {
      color: #6b7280;
      margin: 0;
      font-size: 0.875rem;
    }

    .action-card__arrow {
      color: #9ca3af;
      transition: transform 0.2s;
    }

    .action-card:hover .action-card__arrow {
      transform: translateX(4px);
    }

    @media (max-width: 768px) {
      .dashboard {
        padding: 1rem;
      }

      .dashboard__header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private apiService = inject(ApiService);

  currentDate = new Date();
  private loading = signal(true);
  private dashboardStats = signal<DashboardStats>({
    totalExams: 0,
    totalQuestions: 0,
    totalStudents: 0,
    averageScore: 0,
    recentSubmissions: 0,
    passRate: 0
  });

  readonly isLoading = this.loading.asReadonly();
  readonly stats = this.dashboardStats.asReadonly();

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    try {
      const [exams, questions, users, results] = await Promise.all([
        this.apiService.get<any[]>('exams').toPromise(),
        this.apiService.get<any[]>('questions').toPromise(),
        this.apiService.get<any[]>('users').toPromise(),
        this.apiService.get<any[]>('results').toPromise()
      ]);

      const students = users?.filter(user => user.role === 'student') || [];
      const totalScore = results?.reduce((sum, result) => sum + result.score, 0) || 0;
      const passedResults = results?.filter(result => result.passed) || [];

      this.dashboardStats.set({
        totalExams: exams?.length || 0,
        totalQuestions: questions?.length || 0,
        totalStudents: students.length,
        averageScore: results?.length ? Math.round(totalScore / results.length) : 0,
        recentSubmissions: results?.length || 0,
        passRate: results?.length ? Math.round((passedResults.length / results.length) * 100) : 0
      });

      // Initialize charts after data is loaded
      setTimeout(() => this.initializeCharts(), 100);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private initializeCharts(): void {
    this.createPerformanceChart();
    this.createParticipationChart();
  }

  private createPerformanceChart(): void {
    const canvas = document.querySelector('#performanceChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Average Score',
          data: [75, 78, 82, 79, 85, 88],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  private createParticipationChart(): void {
    const canvas = document.querySelector('#participationChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Web Dev', 'JavaScript', 'Database', 'Angular', 'System Design'],
        datasets: [{
          label: 'Students',
          data: [45, 38, 42, 35, 28],
          backgroundColor: [
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ef4444',
            '#8b5cf6'
          ],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }
}