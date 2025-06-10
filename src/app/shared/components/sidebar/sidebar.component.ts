import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface SidebarItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar" [class.sidebar--collapsed]="isCollapsed()">
      <div class="sidebar__header">
        <button 
          class="sidebar__toggle"
          (click)="toggleSidebar()"
          [attr.aria-label]="isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          [attr.aria-expanded]="!isCollapsed()">
          <i class="fas" [class.fa-bars]="isCollapsed()" [class.fa-times]="!isCollapsed()"></i>
        </button>
        
        @if (!isCollapsed()) {
          <div class="sidebar__brand">
            <i [class]="brandIcon" class="sidebar__brand-icon"></i>
            <span class="sidebar__brand-text">{{ brandText }}</span>
          </div>
        }
      </div>

      <nav class="sidebar__nav" role="navigation">
        <ul class="sidebar__menu">
          @for (item of menuItems; track item.route) {
            <li class="sidebar__menu-item">
              <a 
                [routerLink]="item.route"
                routerLinkActive="sidebar__menu-link--active"
                [routerLinkActiveOptions]="{ exact: item.exact || false }"
                class="sidebar__menu-link"
                [attr.title]="isCollapsed() ? item.label : null">
                <i [class]="item.icon" class="sidebar__menu-icon"></i>
                @if (!isCollapsed()) {
                  <span class="sidebar__menu-text">{{ item.label }}</span>
                }
              </a>
            </li>
          }
        </ul>
      </nav>

      <div class="sidebar__footer">
        <button 
          class="sidebar__logout"
          (click)="onLogout()"
          [attr.title]="isCollapsed() ? 'Logout' : null">
          <i class="fas fa-sign-out-alt"></i>
          @if (!isCollapsed()) {
            <span>Logout</span>
          }
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 280px;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      color: white;
      display: flex;
      flex-direction: column;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    }

    .sidebar--collapsed {
      width: 0;
      overflow: hidden;
    }

    .sidebar__header {
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sidebar__toggle {
      background: rgba(255, 255, 255, 0.1);
      border: none;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .sidebar__toggle:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .sidebar__brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .sidebar__brand-icon {
      font-size: 1.5rem;
      color: #3b82f6;
    }

    .sidebar__brand-text {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .sidebar__nav {
      flex: 1;
      padding: 1rem 0;
      overflow-y: auto;
    }

    .sidebar__menu {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .sidebar__menu-item {
      margin: 0.25rem 0;
    }

    .sidebar__menu-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.2s;
      border-radius: 0;
      position: relative;
    }

    .sidebar__menu-link:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .sidebar__menu-link--active {
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
      border-right: 3px solid #3b82f6;
    }

    .sidebar__menu-icon {
      font-size: 1.125rem;
      width: 20px;
      text-align: center;
      flex-shrink: 0;
    }

    .sidebar__menu-text {
      font-weight: 500;
      white-space: nowrap;
    }

    .sidebar__footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar__logout {
      width: 100%;
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 0.875rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
    }

    .sidebar__logout:hover {
      background: rgba(239, 68, 68, 0.3);
      color: #f87171;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 100%;
        max-width: 280px;
      }
      
      .sidebar--collapsed {
        width: 0;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() menuItems: SidebarItem[] = [];
  @Input() brandText = 'Exam System';
  @Input() brandIcon = 'fas fa-graduation-cap';
  @Output() logout = new EventEmitter<void>();

  private collapsed = signal(false);
  readonly isCollapsed = this.collapsed.asReadonly();

  toggleSidebar(): void {
    this.collapsed.update(value => !value);
  }

  onLogout(): void {
    this.logout.emit();
  }
}