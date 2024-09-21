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
    private groupService: GroupService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGroups(); // Load groups on component initialization
  }

  loadGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response.data);
        this.totalGroups = response.data.length;
      },
      error: (error) => {
        console.log('Error fetching groups:', error);
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
            console.error('Error deleting group:', error);
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
