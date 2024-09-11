import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { LoginService } from './../../services/login.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    email: string = "";
    password: any = "";
    errorMessage: string = "";

    constructor(private LoginService: LoginService, private router: Router) { };

    onlogin() {

        if (!this.email) {
            this.errorMessage = "Email is required.";
            return;
        }

        if (!this.password) {
            this.errorMessage = "Password is required.";
            return;
        }

        this.LoginService.login(this.email, this.password).subscribe((response) => {
            if (response.status && response.token) {
                localStorage.setItem('token', response.token);
                this.router.navigateByUrl("dashboard");
            } else {
                alert('Check your Email or Password');
            }
        },
        (error) => {
            this.errorMessage = "Your passsword or email is incorrect";
        });
}
}
