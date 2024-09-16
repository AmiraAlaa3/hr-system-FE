import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  userName: string='';

  constructor(private LoginService: LoginService) { }

  ngOnInit(): void {
    this.fetchLoginData();
  }

  fetchLoginData(){
    const storedName = this.LoginService.getUserName();
    if(storedName){
      this.userName = storedName;
    }else{
      console.error('user name not found');
    }
  }
}