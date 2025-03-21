import { Component, OnInit,ViewChild} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  constructor() { }

  ngOnInit(): void {
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }
}
