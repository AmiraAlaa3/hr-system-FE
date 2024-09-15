
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ CommonModule,
    PageTitleComponent,
    AddButtonComponent,
    RouterLink,
    ConfirmModalComponent,
    MatPaginatorModule,
    MatTableModule,
    FormsModule,],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  users: User[] = [];
  message: string | null = null;
  showModal: boolean = false;
  userIdToDelete: number | null = null;
  searchError: string = '';

  displayedColumns: string[] = ['id', 'Name', 'Email', 'Group', 'Permissions', 'action'];
  dataSource!: MatTableDataSource<User>;
  totalUsers: number = 0;
  searchTerm: string = '';

  showImportForm = false;
  selectedFile: File | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usersService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.message = params['message'] || null;
      if (this.message) {
        setTimeout(() => {
          this.closeMessage();
        }, 6000);
      }
    });
    this.loadUsers();
  }

  // loadUsers(): void {
  //   this.usersService.getAllUsers().subscribe({
  //     next: (response) => {
  //       this.users = response.data;
  //       console.log('Users:', this.users);
  //       this.dataSource = new MatTableDataSource(this.users);
  //       this.dataSource.paginator = this.paginator;
  //       this.totalUsers = this.users.length;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }
  loadUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (response) => {
        console.log('Response:', response); // Log the entire response
        this.users = response.data;
        console.log('Users:', this.users); // Log the user data
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.totalUsers = this.users.length;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  isLast(permission: string, permissionArray: string[]): boolean {
    return permissionArray.indexOf(permission) === permissionArray.length - 1;
  }

  closeMessage(): void {
    this.message = null;
    this.router.navigate([], { queryParams: { message: null } });
  }

  openDeleteModal(userId: number): void {
    this.userIdToDelete = userId;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (this.userIdToDelete !== null) {
      this.usersService.deleteUser(this.userIdToDelete).subscribe({
        next: () => {
          const filteredData = this.dataSource.data.filter(
            (user: User) => user.id !== this.userIdToDelete
          );
          this.dataSource.data = filteredData;
          this.message = 'User deleted successfully';
          setTimeout(() => {
            this.closeMessage();
          }, 3000);
          this.loadUsers();
        },
        error: (error: any) => {
          console.error('Error deleting user', error);
        },
      });
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.userIdToDelete = null;
  }
}
