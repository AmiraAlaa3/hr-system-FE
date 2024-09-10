import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { LoginService } from './../../services/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {
    loginObj:any ={
        'email': "",
        'password': ""
    }
    http= inject(HttpClient);
    constructor(private router: Router){};

    onlogin(){
        debugger;
        this.http.post("http://127.0.0.1:8000/api/login", this.loginObj).subscribe((res:any)=>{
            if (res.status) {
                alert('Login Success');
                this.router.navigateByUrl("layout/dashboard");
            }else{
                alert('Check your Email or Password')
            }
        }
        )
    }










    // loginForm: FormGroup;
    // message: string | null = null;

    // constructor(private fb: FormBuilder, private LoginService: LoginService) {
    //     this.loginForm = this.fb.group({
    //         email: ['', [Validators.required, Validators.email]],
    //         password: ['', Validators.required],
    //     });
    // }

    // onSubmit() {
    //     if (this.loginForm.valid) {
    //         this.LoginService.login(this.loginForm.value).subscribe(
    //             (response) => {
    //                 if (response && response.token) {
    //                     localStorage.setItem('token', response.token); 
    //                     this.message = 'Login successful!';
    //                     // redirect to dashboard
    //                 } else {
    //                     this.message = 'Login failed. No token returned.';
    //                 }
    //             },
    //             (error) => {
    //                 console.error('Login error', error);
    //                 this.message = 'Invalid credentials. Please try again.';
    //             }
    //         );
    //     } else {
    //         this.message = 'Please fill out the form correctly.';
    //     }
    // }
}