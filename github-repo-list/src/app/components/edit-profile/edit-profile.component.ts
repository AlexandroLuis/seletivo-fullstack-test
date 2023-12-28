import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  userDetails: any = {}; // Define your user details interface or type
  loggedInUser?: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.userService.getLoggedInUser();
  }

  saveEditing(): void {
    const updateObservable = from(this.userService.updateUserInfo(
      this.loggedInUser,
      this.userDetails.mail,
      this.userDetails.password
    ));
  
    updateObservable.subscribe(
      response => {
        // Handle successful update
        console.log('User details updated:', response);
        this.router.navigate(['/home']);
      },
      error => {
        // Handle error
        console.error('Error updating user details:', error);
      }
    );
  }

  cancelEditing(): void {
    this.router.navigate(['/home']);
  }
}
