import { Component } from '@angular/core';
import { AddButtonComponent } from "../../components/add-button/add-button.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [AddButtonComponent, RouterLink],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css'
})
export class NotfoundComponent {

}
