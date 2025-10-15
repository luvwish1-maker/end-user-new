import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/interceptor/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (res: any) => {
        this.close(res);
      },
      error: (err) => {
        if (err.status === 404) {
          this.signup(email, password);
        } else {
          console.log(err);
        }
      }
    });
  }

  signup(email: string, password: string) {
    this.authService.signup({ email, password }).subscribe({
      next: () => alert('Success'),
      error: () => alert('Error')
    });
  }

  close(res?: any) {
    if (res) {
      this.modalService.dismissAll(res)
    } else {
      this.modalService.dismissAll()
    }
  }
}
