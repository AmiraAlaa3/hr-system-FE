import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { group } from '@angular/animations';
import { PermissionService } from '../../services/permission.service';
import { PageTitleComponent } from "../page-title/page-title.component";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AddButtonComponent } from "../add-button/add-button.component";

@Component({
  selector: 'app-add-group-permissions',
  standalone: true,
  imports: [PageTitleComponent, AddButtonComponent],
  templateUrl: './add-group-permissions.component.html',
  styleUrl: './add-group-permissions.component.css'
})
export class AddGroupPermissionsComponent {

  groupName: string = '';
  selectAll: boolean = false; // Model for "Select All" checkbox

  permissions: any[] = [];

  constructor(private groupService: GroupService, private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.getPermissions();
  }
    // Fetch permissions from the PermissionService
  getPermissions(): void {
    this.permissionService.getPermission().subscribe((data: any) => {
      this.permissions = data.map((permission: any) => ({
        ...permission,
        add: false,
        delete: false,
        modify: false,
        display: false,
        selected: false
      }));
    });
  }

  // Toggle all permissions based on "Select All" checkbox
  toggleAllPermissions(event: any): void {
    this.permissions.forEach(permission => {
      permission.selected = event.target.checked;
      permission.add = event.target.checked;
      permission.delete = event.target.checked;
      permission.modify = event.target.checked;
      permission.display = event.target.checked;
    });
  }

  // Toggle individual permission row
  togglePermissionRow(permission: any): void {
    if (!permission.selected) {
      permission.add = false;
      permission.delete = false;
      permission.modify = false;
      permission.display = false;
    }
  }

  // Save group and its permissions
  saveGroup(): void {
    const groupData = {
      name: this.groupName,
      permissions: this.permissions.map(permission => ({
        page: permission.page,
        add: permission.add,
        delete: permission.delete,
        modify: permission.modify,
        display: permission.display
      }))
    };

    this.groupService.createGroup(groupData).subscribe(response => {
      console.log('Group created:', response);
    });
  }
}
