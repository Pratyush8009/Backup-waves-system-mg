import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { HttpClientModule } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserService } from '../../services/user.service'; // Updated import

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzAlertModule,
    NzDividerModule,
    HttpClientModule // Make sure to include this
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService, // Updated service name
    private message: NzMessageService
  ) {
    this.loginForm = this.fb.group({
      user_id: ['', [Validators.required]] // Removed unit_id field
    });


  }

  onSubmit() {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userId = this.loginForm.value.user_id;

    this.userService.validateUser(userId).subscribe({
      next: (response) => {
        this.isLoading = false;

        this.message.success(`Welcome ${response.data.name}! User Verified Successfully`);

        // Store user info in localStorage using the service
        this.userService.storeUserId(response.data._id);

        // Optionally store more user data if needed
        localStorage.setItem('userName', response.data.name);
        localStorage.setItem('userEmail', response.data.email);

        // Navigate to unit page with user id
        this.router.navigate(['/units', response.data._id]);
      },
      error: (error) => {
        this.isLoading = false;

        // Handle error response
        if (error.status === 404) {
          this.errorMessage = 'User not found. Please check the User ID.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid User ID format.';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your connection.';
        } else {
          this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
        }

        // Show error message
        this.message.error(this.errorMessage);
      }
    });
  }

  // Helper method to clear form
  resetForm(): void {
    this.loginForm.reset();
    this.errorMessage = '';
  }

}