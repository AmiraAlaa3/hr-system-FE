import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalEmployee: number = 0;
  totalUsers: number = 0;
  totalLeaves: number = 0;
  nextLeave: any = null;

  constructor(private DashboardService: DashboardService){};

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.DashboardService.getDashboardData().subscribe(
      (data) => {
        this.totalEmployee = data.totalEmployee;
        this.totalUsers = data.totalUsers;
        this.totalLeaves = data.totalLeaves;
        this.nextLeave = data.nextLeave;
      },
      (error) => {
        console.error('Error fetching dashboard data', error);
      }
    );
  }
}
