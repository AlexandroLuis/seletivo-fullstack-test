import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, 
            HttpClientModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  public form: FormGroup;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private router: Router) { 
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      mail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submitForm() {
    this.validarFormulario();
    if (this.form.valid) {
      this.salvar();
    }
  }

  private validarFormulario(): void {
    for (const i in this.form.controls) {
      if (Object.prototype.hasOwnProperty.call(this.form.controls, i)) {
        this.form.controls[i].markAsTouched();
      }
    }
  }

  salvar(): void {
    this.http.post<any>('http://localhost:3000/api/register', this.form.value)
      .subscribe(
        () => {
          console.log('Row created successfully');
          this.router.navigate(["/login"]);
        },
        (error) => {
          console.error('Error creating row:', error);
          // Handle error
        }
      );
  }
}