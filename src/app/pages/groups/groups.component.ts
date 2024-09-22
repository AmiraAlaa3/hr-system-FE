import { Component, OnInit, ViewChild } from '@angular/core';
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
export class GroupsComponent implements OnInit {
  message: string | null = null;
  showModal: boolean = false;
  dataSource!: MatTableDataSource<any>;
  groupIdToDelete: number | null = null;
  totalGroups: number = 0;
  error: string = '';
  fatechError: string = '';
  displayedColumns: string[] = ['id', 'name', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router
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
    this.loadGroups();
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.totalGroups = response.data.length;
      },
      error: (error) => {
        this.fatechError = error.error.message;
      },
    });
  }

  closeMessage(): void {
    this.message = null;
    this.router.navigate([], { queryParams: { message: null } });
  }

  openDeleteModal(groupId: number): void {
    this.groupIdToDelete = groupId;
    this.showModal = true;
  }

  confirmDelete(): void {
    if (this.groupIdToDelete !== null) {
      this.groupService.deleteGroup(this.groupIdToDelete)
        .subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(
              (group: any) => group.id !== this.groupIdToDelete
            );
            this.message = 'Group deleted successfully';
            setTimeout(() => this.closeMessage(), 3000);
            this.loadGroups(); // Reload groups after deletion
          },
          error: (error) => {
            this.error = error.error.message;
            setTimeout(() => {
              this.error = '';
            }, 5000);
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
