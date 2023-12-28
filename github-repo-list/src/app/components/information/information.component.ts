import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent implements OnInit {
  user: any;
  repositories: any[] = [];

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      switchMap((params: ParamMap) => {
        const username = params.get('username');
        return this.http.get<any>(`https://api.github.com/users/${username}`);
      })
    ).subscribe(
      (response: any) => {
        this.user = response;
        console.log('User information:', this.user);
        this.fetchRepositories(this.user.login); // Fetch repositories for this user
      },
      (error) => {
        console.error('Error fetching user information:', error);
      }
    );
  }

  fetchRepositories(username: string): void {
    this.http.get<any[]>(`https://api.github.com/users/${username}/repos`).subscribe(
      (response: any[]) => {
        this.repositories = response;
      },
      (error) => {
        console.error('Error fetching repositories:', error);
      }
    );
  }

  searchAgain(): void {
    this.router.navigate(['/search']);
  }

  searchedUserPage(): void {
    this.router.navigate(['/home'], { queryParams: { username: this.user.login } });
  }

  userPage(): void {
    this.router.navigate(['/home']);
  }

  redirectToUserPage(): void {
    window.open(`https://github.com/${this.user.login}`, '_blank');
  }

  redirectToRepository(repoUrl: string): void {
    window.open(repoUrl, '_blank');
  }
}