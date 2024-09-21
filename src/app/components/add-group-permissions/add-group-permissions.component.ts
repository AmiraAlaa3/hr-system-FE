import { Permission } from './../../models/permission';
// import { Group2 } from './../../models/group';
import { Group } from './../../models/group';
import { PermissionService } from './../../services/permission.service';
import { GroupService } from './../../services/group.service';
import { Component, OnInit } from '@angular/core';
import { group } from '@angular/animations';
import { PageTitleComponent } from "../page-title/page-title.component";
// import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  AbstractControl,
  FormControl,
  FormGroup,

  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AddButtonComponent } from "../add-button/add-button.component";
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-add-group-permissions',
  standalone: true,
  imports: [PageTitleComponent, AddButtonComponent,ReactiveFormsModule,FormsModule,CommonModule],
  templateUrl: './add-group-permissions.component.html',
  styleUrl: './add-group-permissions.component.css'
})
export class AddGroupPermissionsComponent {

groupName: string = '';
permissions: Permission[] = [
  { page: '', add: 'false', view: 'false', edit: 'false', delete: 'false' } // Initialize as strings
];

constructor(private groupService: GroupService, private permissionService: PermissionService) {}

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
  permission.add = target.checked ? 'true' : 'false'; // Set as string
}

updatePermissionView(event: Event, permission: Permission) {
  const target = event.target as HTMLInputElement;
  permission.view = target.checked ? 'true' : 'false'; // Set as string
}

updatePermissionEdit(event: Event, permission: Permission) {
  const target = event.target as HTMLInputElement;
  permission.edit = target.checked ? 'true' : 'false'; // Set as string
}

updatePermissionDelete(event: Event, permission: Permission) {
  const target = event.target as HTMLInputElement;
  permission.delete = target.checked ? 'true' : 'false'; // Set as string
}

// Remove permission row
removePermissionRow(index: number) {
  if (this.permissions.length > 1) {
    this.permissions.splice(index, 1);
  }
}

// Save the group and permissions
saveGroup() {
  console.log('Permissions to create:', this.permissions);
  
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
      console.log('Created Permissions:', createdPermissions);
      
      const permissionIds = createdPermissions.map(perm => perm.data.id).filter(id => id !== undefined);
      
      console.log('Extracted Permission IDs:', permissionIds);
    
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
          console.log('Group created successfully', response);
          this.groupName = '';
          this.permissions = [{ page: '', add: 'false', view: 'false', edit: 'false', delete: 'false' }]; 
        },
        error: (error) => {
          console.error('Error creating group', error);
        }
      });
    },
    error: (error) => {
      console.error('Error creating permissions', error);
    }
  });
}


}
