import { Group } from './../../models/user';
// import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators ,FormBuilder} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { User } from '../../models/user';
import { PageTitleComponent } from '../page-title/page-title.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageTitleComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  userId: number = 0; // Default to 0 for new user
  groups: Group[] = [];
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      password: new FormControl('', [Validators.minLength(8)]), // Password is optional for updates
      group_ids: new FormControl([], [Validators.required])
    });
  }

  ngOnInit(): void {
    // Get userId from route parameters
    this.route.params.subscribe(params => {
      this.userId = +params['id']; // Convert id to number
      if (this.userId !== 0) {
        this.loadUserData();
      }
    });

    // Load groups for the select input
    this.groupService.getGroups().subscribe({
      next: (response) => {
        this.groups = response.data;
      },
      error: (error) => {
        console.error('Error loading groups:', error);
      }
    });
  }

  loadUserData() {
    this.userService.getUser(this.userId).subscribe({
      next: (response) => {
        this.userForm.patchValue({
          name: response.data.name,
          email: response.data.email,
          group_ids: response.data.groups.map(group => group.id)
        });
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.userId === 0) {
        // Create new user
        this.userService.createUser(userData).subscribe({
          next: () => {
            this.router.navigate(['/users'], {
              queryParams: { message: 'User created successfully!' },
            });
          },
          error: (error) => {
            console.error('Error creating user:', error);
          }
        });
      } else {
        // Update existing user
        this.userService.updateUser(this.userId, userData).subscribe({
          next: () => {
            this.router.navigate(['/users'], {
              queryParams: { message: 'User updated successfully!' },
            });
          },
          error: (error) => {
            console.error('Error updating user:', error);
          }
        });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }
  // onSubmit() {
  //   console.log('Form submitted');
  //   console.log('Form value:', this.userForm.value);
  
  //   if (this.userForm.valid) {
  //     console.log('Form is valid');
  //     // Existing user logic here
  //   } else {
  //     console.log('Form is invalid');
  //     this.userForm.markAllAsTouched();
  //   }
  // }
}
