import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Chart, registerables } from 'chart.js';
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
  DepartmentsForChart: string[] = [];
  employeeCountForChart: number[] = [];

  constructor(private DashboardService: DashboardService){
    Chart.register(...registerables);
  };

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
        this.DepartmentsForChart = data.departments;
        this.employeeCountForChart = data.employeeCounts;

      setTimeout(() => {
        this.createChart();
      }, 0);

      },
      (error) => {
        console.error('Error fetching dashboard data', error);
      }
    );
  }

  createChart(): void {
    const ctx = document.getElementById('departmentChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.DepartmentsForChart,
        datasets: [
          {
            label: 'Number of Employees',
            data: this.employeeCountForChart,
            backgroundColor:  '#e94d65',
            borderColor: '#e94d65',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'Departments',
            },
          },
          y: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Employees',
            },
          },
      },
    }});
  }
}
