import { Component } from '@angular/core';
import { PageTitleComponent } from '../../components/page-title/page-title.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';

@Component({
  selector: 'app-offical-holidays',
  standalone: true,
  imports: [PageTitleComponent,AddButtonComponent],
  templateUrl: './offical-holidays.component.html',
  styleUrl: './offical-holidays.component.css'
})
export class OfficalHolidaysComponent {

}
