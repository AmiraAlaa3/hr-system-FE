import { Permission } from './../../models/permission';
import { Group2 } from './../../models/group';
import { PermissionService } from './../../services/permission.service';
import { GroupService } from './../../services/group.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-group-permissions',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-group-permissions.component.html',
  styleUrl: './add-group-permissions.component.css'
})
export class AddGroupPermissionsComponent {

  groupForm: FormGroup;
  permissions: Permission[] = [];

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private permissionService: PermissionService
  ) {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      permissions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  // Load all permissions
  loadPermissions() {
    this.permissionService.getPermissions().subscribe((data: Permission[]) => {
      this.permissions = data;
      this.populatePermissions();
    });
  }

  // Populate the permissions form array
  populatePermissions() {
    const permissionFormArray = this.groupForm.get('permissions') as FormArray;
    this.permissions.forEach(permission => {
      permissionFormArray.push(this.fb.group({
        page: [permission.page, Validators.required],
        view: [false],
        add: [false],
        edit: [false],
        delete: [false]
      }));
    });
  }

  // Save or update group with permissions
  onSubmit() {
    const formData = this.groupForm.value;

    const group: Group2 = {
      name: formData.name,
      permission_ids: this.getSelectedPermissions(formData.permissions)
    };

    this.groupService.createGroup(group).subscribe(response => {
      console.log('Group created or updated successfully', response);
    });
  }

  // Get selected permissions
  getSelectedPermissions(permissions: any[]): number[] {
    return permissions.filter(p => p.view || p.add || p.edit || p.delete).map(p => p.id);
  }
}
