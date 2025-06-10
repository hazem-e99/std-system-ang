import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading" [class.loading--overlay]="overlay">
      <div class="loading__content">
        <div class="loading__spinner">
          <div class="loading__spinner-circle"></div>
        </div>
        @if (message) {
          <p class="loading__message">{{ message }}</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }

    .loading--overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      z-index: 9998;
      min-height: 100vh;
    }

    .loading__content {
      text-align: center;
    }

    .loading__spinner {
      margin-bottom: 1rem;
    }

    .loading__spinner-circle {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top: 3px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    .loading__message {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingComponent {
  @Input() message = '';
  @Input() overlay = false;
}