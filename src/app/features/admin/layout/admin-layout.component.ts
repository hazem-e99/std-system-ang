import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent, SidebarItem } from '../../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="admin-layout">
      <app-sidebar
        [menuItems]="menuItems"
        brandText="Admin Panel"
        brandIcon="fas fa-shield-alt"
        (logout)="onLogout()">
      </app-sidebar>
      
      <main class="admin-layout__content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
    }

    .admin-layout__content {
      flex: 1;
      margin-left: 280px;
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-height: 100vh;
    }

    @media (max-width: 768px) {
      .admin-layout__content {
        margin-left: 0;
      }
    }
  `]
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);

  menuItems: SidebarItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/admin',
      exact: true
    },
    {
      label: 'Exams',
      icon: 'fas fa-file-alt',
      route: '/admin/exams'
    },
    {
      label: 'Questions',
      icon: 'fas fa-question-circle',
      route: '/admin/questions'
    },
    {
      label: 'Results',
      icon: 'fas fa-chart-bar',
      route: '/admin/results'
    }
  ];

  onLogout(): void {
    this.authService.logout();
  }
}