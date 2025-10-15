import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/interceptor/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../shared/alert/service/alert.service';

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
    private modalService: NgbModal,
    private alertService: AlertService
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
        this.alertService.showAlert({
          message: 'Logged In successfully',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
        this.close(res);
      },
      error: (err) => {
        if (err.status === 404) {
          this.signup(email, password);
        } else {
          this.alertService.showAlert({
            message: err.error.message,
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });;
        }
      }
    });
  }

  signup(email: string, password: string) {
    this.authService.signup({ email, password }).subscribe({
      next: () => {
        this.alertService.showAlert({
          message: 'Signed Up successfully',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
      },
      error: (err) => {
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
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
