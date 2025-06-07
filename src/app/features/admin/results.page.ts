import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './results.page.html',
})
export class AdminResultsPage {
  results: any[] = [];

  constructor(private http: HttpClient) {
    this.loadResults();
  }

  loadResults() {
    this.http.get<any[]>('http://localhost:3000/results').subscribe((data) => {
      this.results = data;
    });
  }
}
