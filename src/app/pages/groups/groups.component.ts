import { Component } from '@angular/core';
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { AddButtonComponent } from "../../components/add-button/add-button.component";
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { ConfirmModalComponent } from "../../components/confirm-modal/confirm-modal.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [PageTitleComponent, AddButtonComponent, RouterLink, ConfirmModalComponent, MatTableModule, MatPaginator],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  message: string | null = null;
  showModal: boolean = false;
  dataSource!: MatTableDataSource<any>;
  groupIdToDelete: number | null = null;
  totalGroups: number = 0;
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(
    private GroupService: GroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  
  loadGroups(): void {
    this.GroupService.getGroups().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data);
        // this.dataSource.paginator = this.paginator;
        this.totalGroups = response.data.length;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  closeMessage(): void {
    this.message = null;
    this.router.navigate([], { queryParams: { message: null } });
  }

  openDeleteModal(departmentId: number): void {
    this.groupIdToDelete = departmentId;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (this.groupIdToDelete !== null) {
      this.GroupService.deleteGroup(this.groupIdToDelete)
        .subscribe({
          next: () => {
            const filteredData = this.dataSource.data.filter(
              (department: any) => department.id !== this.groupIdToDelete
            );
            this.dataSource.data = filteredData;
            this.message = 'Group deleted successfully';
            setTimeout(() => {
              this.closeMessage();
            }, 3000);
            this.loadGroups();
          },
          error: (error) => {
            console.error('Error deleting Group', error);
          },
        });
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.groupIdToDelete = null;
  }
}
