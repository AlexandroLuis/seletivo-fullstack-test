import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  logs: any[] = [];
  loggedInUser: any;

  constructor(private historyService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.fetchHistory();
    this.loggedInUser = this.historyService.getLoggedInUser();
  }

  fetchHistory(): void {
    this.historyService.getHistory().subscribe(
      (data: any) => {
        this.logs = data;
      },
      (error: any) => {
        console.error('Error fetching history:', error);
      }
    );
  }

  deleteHistoryItem(itemId: number): void {
    this.historyService.deleteHistoryItem(itemId).subscribe(
      () => {
        // Item deleted successfully, update the view or fetch history again
        this.fetchHistory();
      },
      (error: any) => {
        console.error('Error deleting history item:', error);
      }
    );
  }

  viewUserDetails(username: string): void {
    this.router.navigate(['/home'], { queryParams: { username: username } })
  }

  viewRepositories(username: string): void {
    this.router.navigate(['/information'], { queryParams: { username: username } })
  }

  goBack(): void {
    this.router.navigate(['/search']);
  }
}
