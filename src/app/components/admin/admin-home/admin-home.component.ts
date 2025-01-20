import { Component, OnInit } from '@angular/core';
import { OnlinefoodService } from '../../service/onlinefood.service';

@Component({
  standalone:false,
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
url: any;
routerToLink(arg0: string) {
throw new Error('Method not implemented.');
}
  userName: string = '';
  constructor(
    private oService: OnlinefoodService
  ) {
    if (this.oService.getAdminName() !== null) {
      this.userName = this.oService.getAdminName();
    }
    this.oService.isAdminLoginPresent();
  }

  ngOnInit(): void {
  }

}