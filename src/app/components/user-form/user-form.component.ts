import { Group } from './../../models/group';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators ,FormBuilder} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { User } from '../../models/user';
import { PageTitleComponent } from '../page-title/page-title.component';
import { CommonModule, Location } from '@angular/common';
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PageTitleComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  userId: number = 0;
  groups: Group[] = [];
  userForm: FormGroup;
  error :string = '';

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      Full_name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(255)]),
      password: new FormControl('', [Validators.minLength(8)]), // Password is optional for updates
      group_id: new FormControl('', [Validators.required]) // Single group selection
    });
  }

  ngOnInit(): void {
    // Check if editing an existing user
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      if (this.userId !== 0) {
        this.loadUserData();
      }
    });

    // Load available groups
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
        const user = response.data as User;
        this.userForm.patchValue({
          name: user.name,
          Full_name: user.Full_name,
          email: user.email,
          group_id: user.group.id
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
            this.router.navigate(['/users'], { queryParams: { message: 'User created successfully!' } });
          },
          error: (error) => {
            this.error = error.error.message;
          }
        });
      } else {
        // Update existing user
        this.userService.updateUser(this.userId, userData).subscribe({
          next: () => {
            this.router.navigate(['/users'], { queryParams: { message: 'User updated successfully!' } });
          },
          error: (error) => {
            this.error = error.error.message;
          }
        });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }
  goBack(): void {
    this.location.back();
  }
}
