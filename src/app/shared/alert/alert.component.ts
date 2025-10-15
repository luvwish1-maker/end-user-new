import { Component } from '@angular/core';
import { Alert, AlertService } from './service/alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  alert: Alert | null = null;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
    this.alertService.alert$.subscribe(alert => {
      this.alert = alert;

      if (alert.autoDismiss) {
        setTimeout(() => this.close(), alert.duration || 3000);
      }
    });
  }

  close(): void {
    this.alert = null;
  }
}
