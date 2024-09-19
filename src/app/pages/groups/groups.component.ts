import { Component } from '@angular/core';
import { PageTitleComponent } from "../../components/page-title/page-title.component";
import { AddButtonComponent } from "../../components/add-button/add-button.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [PageTitleComponent, AddButtonComponent, RouterLink],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {

}
