import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, 
            HttpClientModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userservice: UserService,
    private router: Router 
  ) {
    this.formLogin = this.formBuilder.group({
      mail: ["", [Validators.required]],
      password: ["", [Validators.required]]
    })
  }

  private validateForm(): void {
    Object.values(this.formLogin.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  public submitform() {
    this.validateForm();
    if (!this.formLogin.valid) {
      return;
    }
    this.login();
  }

  login() {
    this.userservice.login(
      this.formLogin.controls['mail'].value,
      this.formLogin.controls['password'].value
    )
      .then((response) => {
        // Handle successful login response from your backend
        console.log(response); // Use response data as needed
        alert("Successfully logged in");
        this.router.navigate(["/search"]); // Redirect to the desired page
      })
      .catch((error) => {
        // Handle login error from your backend
        console.error(error); // Log or handle the error message
        alert("Login failed: " + error); // Show an error message
      })
  }
}
