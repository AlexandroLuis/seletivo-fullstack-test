import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

interface Repository {
  name: string;
  description: string;
  language: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  userDetails: UserDetails = {} as UserDetails;
  repositories: Repository[] = [];
  loggedInUser: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.userService.getLoggedInUser();

    this.route.queryParams.subscribe(params => {
      const username = params['username'];

      if (username) {
        this.fetchUserDetails(username);
        this.fetchRepositories(username).subscribe(count => { /* Handle if params*/ });
      } else {
        this.fetchUserDetails(this.loggedInUser);
        this.fetchRepositories(this.loggedInUser).subscribe(count => { /* Handle /home */ });
      }
    });
  }

  fetchRepositories(username: string) {
    const apiUrl = `https://api.github.com/users/${username}/repos`;
    return this.http.get<Repository[]>(apiUrl);
  }

  fetchUserDetails(username: string): void {
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

  isCurrentUserProfile(): boolean {
    if (!this.userDetails || !this.userDetails.login) {
      return false; // Return false if userDetails or userDetails.login is undefined/null
    }
  
    return this.loggedInUser === this.userDetails.login.toLowerCase();
  }

  editProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  returnScreen(): void {
    window.history.back();
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}

