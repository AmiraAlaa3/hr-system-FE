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
    email:string = "";
    password: any = "";
    
    constructor(private LoginService :LoginService ,private router: Router){};

    onlogin(){
        if (this.email && this.password) {
            this.LoginService.login(this.email, this.password).subscribe((response)=>{
                if (response.status && response.token) {
                    localStorage.setItem('token', response.token); 
                    this.router.navigateByUrl("layout/dashboard");
                }else{
                    alert('Check your Email or Password');
                }
            });
        }
    }

}