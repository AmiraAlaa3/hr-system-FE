import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from './../../services/login.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private LoginService: LoginService, private router: Router) {}

  logout(): void {
    this.LoginService.logout();
    this.router.navigate(['/login']);
  }
}
