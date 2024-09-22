import { Permission } from './../../models/permission';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AddButtonComponent } from '../add-button/add-button.component';
import { PageTitleComponent } from '../page-title/page-title.component';
import { PermissionService } from '../../services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../services/group.service';
import { ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule

@Component({
  selector: 'app-add-group-permissions',
  standalone: true,
  imports: [PageTitleComponent, AddButtonComponent, CommonModule, ReactiveFormsModule], // Add it here
  templateUrl: './add-group-permissions.component.html',
  styleUrls: ['./add-group-permissions.component.css']
})
export class AddGroupPermissionsComponent {
  error: string = '';

  addGroupForm = new FormGroup({
    groupName: new FormControl('', [Validators.required]),
    permissions: new FormArray([]), // Initialize as an empty FormArray
  });

  constructor(
    private permissionService: PermissionService,
    private groupService: GroupService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initializePermissions(); // Call to populate permissions
  }

  initializePermissions() {
    const permissionsList = [
      { page: 'employee' },
      { page: 'department' },
      { page: 'salary' },
      { page: 'attendance' },
      { page: 'setting' },
      { page: 'user' },
      { page: 'group' },
    ];

    permissionsList.forEach(permission => {
      const permissionGroup = new FormGroup({
        selected: new FormControl(false),
        add: new FormControl(false),
        delete: new FormControl(false),
        edit: new FormControl(false),
        view: new FormControl(false),
        page: new FormControl(permission.page),
      });
      this.permissions.push(permissionGroup);
    });
  }

  get getGroupName() {
    return this.addGroupForm.controls['groupName'];
  }

  get permissions() {
    return this.addGroupForm.get('permissions') as FormArray;
  }

  toggleAllPermissions(event: any): void {
    const checked = event.target.checked;
    this.permissions.controls.forEach(control => {
      control.get('selected')?.setValue(checked);
      control.get('add')?.setValue(checked);
      control.get('delete')?.setValue(checked);
      control.get('edit')?.setValue(checked);
      control.get('view')?.setValue(checked);
    });
  }


  saveGroup(e: Event) {
    e.preventDefault();
    if (this.addGroupForm.valid) {

      const groupData = {
        name: this.getGroupName.value,
        permissions: this.permissions.value,
      };

      const PermissionDate ={
        permissions: this.permissions.value,
      }
      this.permissionService.createPermission(PermissionDate).subscribe({
        next: () => {
          this.groupService.createGroup(groupData).subscribe({
            next: () => {
              this.router.navigate(['/group'], {
                queryParams: { message: 'Group created successfully!' }
              });
            },
            error: (error) => {
              this.error = error.error.message;
            }
          });
        },
        error: (error) => {
          console.log(error)
          this.error = error.error.message;
        }
      });


    } else {
      this.addGroupForm.markAllAsTouched();
    }
  }
}

