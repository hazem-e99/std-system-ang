import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (notification of notificationService.notifications$(); track notification.id) {
        <div 
          class="notification"
          [class]="'notification--' + notification.type"
          [@slideIn]>
          <div class="notification__icon">
            <i [class]="getIconClass(notification.type)"></i>
          </div>
          <div class="notification__content">
            <h4 class="notification__title">{{ notification.title }}</h4>
            <p class="notification__message">{{ notification.message }}</p>
          </div>
          <button 
            class="notification__close"
            (click)="notificationService.remove(notification.id)"
            aria-label="Close notification">
            <i class="fas fa-times"></i>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      background: white;
      border-left: 4px solid;
      animation: slideIn 0.3s ease-out;
    }

    .notification--success {
      border-left-color: #10b981;
    }

    .notification--error {
      border-left-color: #ef4444;
    }

    .notification--warning {
      border-left-color: #f59e0b;
    }

    .notification--info {
      border-left-color: #3b82f6;
    }

    .notification__icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 0.875rem;
    }

    .notification--success .notification__icon {
      background: #dcfce7;
      color: #16a34a;
    }

    .notification--error .notification__icon {
      background: #fef2f2;
      color: #dc2626;
    }

    .notification--warning .notification__icon {
      background: #fef3c7;
      color: #d97706;
    }

    .notification--info .notification__icon {
      background: #dbeafe;
      color: #2563eb;
    }

    .notification__content {
      flex: 1;
      min-width: 0;
    }

    .notification__title {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
    }

    .notification__message {
      margin: 0;
      font-size: 0.8rem;
      color: #6b7280;
      line-height: 1.4;
    }

    .notification__close {
      flex-shrink: 0;
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .notification__close:hover {
      background: #f3f4f6;
      color: #6b7280;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 640px) {
      .notification-container {
        left: 1rem;
        right: 1rem;
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);

  getIconClass(type: string): string {
    const icons = {
      success: 'fas fa-check',
      error: 'fas fa-exclamation-circle',
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    };
    return icons[type as keyof typeof icons] || icons.info;
  }
}