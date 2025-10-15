import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/interceptor/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../components/login/login.component';
import { ConfirmationService } from '../confirmation/service/confirmation.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.authService.isLoggedIn$().subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  openLogin() {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.modalService.open(LoginComponent, { size: 'md', centered: true, backdrop: 'static' });
  }

  async confirmation() {
    const confirmed = await this.confirmationService.confirm({
      title: 'Proceed to Summary',
      message: 'Do you want to continue to the memorial summary?',
      confirmText: 'Yes',
      cancelText: 'No'
    });
  }
}
