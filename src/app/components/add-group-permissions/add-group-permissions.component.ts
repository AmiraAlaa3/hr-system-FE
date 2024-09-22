import { Permission } from './../../models/permission';
import { Group } from './../../models/group';
import { PermissionService } from './../../services/permission.service';
import { GroupService } from './../../services/group.service';
import { Component, OnInit } from '@angular/core';
import { PageTitleComponent } from "../page-title/page-title.component";
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddButtonComponent } from "../add-button/add-button.component";
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-group-permissions',
  standalone: true,
  imports: [PageTitleComponent, AddButtonComponent,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './add-group-permissions.component.html',
  styleUrls: ['./add-group-permissions.component.css']
})
export class AddGroupPermissionsComponent {

groupName: string = '';
permissions: Permission[] = [
  { page: '', add: 'false', view: 'false', edit: 'false', delete: 'false' } // Initialize
];
validPages: string[] = ['employee', 'department', 'salary', 'attendance', 'setting', 'user', 'group'];
errorMessage:string = '';
constructor(private groupService: GroupService,
   private permissionService: PermissionService,
   private router: Router) {}

// Add a new permission row
addPermission() {
  console.log('Adding new permission');
  this.permissions.push({
    page: '',
    add: 'false',
    view: 'false',
    edit: 'false',
    delete: 'false'
  });
}

updatePermissionAdd(event: Event, permission: Permission) {
  const target = event.target as HTMLInputElement;
  permission.add = target.checked ? 'true' : 'false';
}

updatePermissionView(event: Event, permission: Permission) {
  const target = event.target as HTMLInputElement;
  permission.view = target.checked ? 'true' : 'false';
}

updatePermissionEdit(event: Event, permission: Permission) {
  const target = event.target as HTMLInputElement;
  permission.edit = target.checked ? 'true' : 'false';
}

updatePermissionDelete(event: Event, permission: Permission) {
  const target = event.target as HTMLInputElement;
  permission.delete = target.checked ? 'true' : 'false';
}

// Remove permission row
removePermissionRow(index: number) {
  if (this.permissions.length > 1) {
    this.permissions.splice(index, 1);
  }
}
  // Validate the permissions
  validatePermissions(): boolean {
    const pageNames: string[] = [];
    for (let permission of this.permissions) {
      if (!permission.page.trim()) {
        this.errorMessage = 'Page name is required.';
        return false;
      }
      if (!this.validPages.includes(permission.page)) {
        this.errorMessage = `Invalid page name: ${permission.page}`;
        return false;
      }
      if (pageNames.includes(permission.page)) {
        this.errorMessage = `Duplicate page name: ${permission.page}`;
        return false;
      }
      pageNames.push(permission.page);
    }
    this.errorMessage = '';
    return true;
  }
  // Validate the group name
  validateGroupName(): boolean {
      if (!this.groupName.trim()) {
        this.errorMessage = 'Group name is required.';
        return false;
      }
      this.errorMessage = '';
      return true;
    }


// Save the group and permissions
saveGroup() {
  if (!this.validateGroupName()) {
    return;
  }
  if (!this.validatePermissions()) {
    return;
  }

  const permissionRequests = this.permissions.map(permission => {
    return this.permissionService.createPermission({
      page: permission.page,
      add: permission.add,
      view: permission.view,
      edit: permission.edit,
      delete: permission.delete,
    });
  });

  forkJoin(permissionRequests).subscribe({
    next: (createdPermissions) => {
      const permissionIds = createdPermissions.map(perm => perm.data.id).filter(id => id !== undefined);

      if (permissionIds.length === 0) {
        console.error('No permissions created, cannot create group');
        return;
      }

      const group: Group = {
        name: this.groupName,
        permission_ids: permissionIds
      };

      this.groupService.createGroup(group).subscribe({
        next: (response) => {
          this.router.navigate(['/groups'], {
            queryParams: { message: 'Group added successfully!' }
          });
          this.groupName = '';
          this.permissions = [{ page: '', add: 'false', view: 'false', edit: 'false', delete: 'false' }];
        },
        error: (error) => {
          this.errorMessage = error.error.message;
        }
      });
    },
    error: (error) => {
      console.error('Error creating permissions', error.error.message);
    }
  });
}


}
