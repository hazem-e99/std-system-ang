import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.page.html',
})
export class AdminDashboardPage {
  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/admin/login']);
  }
}
