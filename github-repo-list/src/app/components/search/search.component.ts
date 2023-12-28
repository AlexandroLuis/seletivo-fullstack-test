import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { UserService } from '../../service/user.service';

interface UserDetails {
  login: string;
  name: string;
  tag: string;
  followers: number;
  following: number;
  public_repos: number;
  bio?: string;
  email?: string;
  twitter?: string;
  company?: string;
  website?: string;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  username = '';
  loggedInUser: any;
  userDetails: UserDetails = {} as UserDetails;

  constructor(private http: HttpClient, private router: Router, private userService: UserService,) { }

  ngOnInit(): void {
    this.loggedInUser = this.userService.getLoggedInUser();
    console.log(this.loggedInUser)
  }

  historyPage(): void {
    this.router.navigate(['/history']);
  }

  fetchUser(username: string): any {
    const githubApiUrl = `https://api.github.com/users/${username}`;
  
    this.http.get<UserDetails>(githubApiUrl).subscribe(
      data => {
        this.userDetails = data;
      },
      error => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  addHistoryToDatabase(username: string, success: boolean): void {
    const datetime = new Date().toISOString();

    this.fetchUser(username); // Fetch user details

    // Move userService.addNewHistory inside the fetchUser subscription
    this.http.get<UserDetails>(`https://api.github.com/users/${username}`).subscribe(
      (data: UserDetails) => {
        this.userDetails = data;

        // Assuming you have a field like 'public_repos' for the repository count
        const userRepoCount = this.userDetails.public_repos;

        // Add history to the database
        this.userService.addNewHistory(datetime, username, success, userRepoCount).subscribe(
          () => {
            console.log('Search history added successfully');
          },
          (error) => {
            console.error('Error adding search history:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  onSubmit(): void {
    this.http.get(`http://localhost:3000/api/information?username=${this.username}`)
      .subscribe(
        (response: any) => {
          this.addHistoryToDatabase(this.username, true);
          this.router.navigate(['/information'], { queryParams: { username: this.username } });
        },
        (error) => {
          this.addHistoryToDatabase(this.username, false);
          alert('Usuario não cadastrado');
        }
      );
  }
}
