import { Component, OnInit } from '@angular/core';
import { Order } from '../../model/order.model';
import { OnlinefoodService } from '../../service/onlinefood.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs';

@Component({
  standalone:false,
  selector: 'app-admin-order-list',
  templateUrl: './admin-order-list.component.html',
  styleUrls: ['./admin-order-list.component.css']
})
export class AdminOrderListComponent implements OnInit {

  orderList: Order[] = [];
  tempOrderList: Order[] = [];
  today = new Date();
  isLoading: boolean = false;

  constructor(
    private oService: OnlinefoodService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.oService.isAdminLoginPresent();
  }

  ngOnInit(): void {
    this.getOrderList();
  }

  getOrderList(): void {
    this.isLoading = true;
    this.oService.getAllorderList().pipe(take(1)).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (!!res && Array.isArray(res)) {
          this.orderList = res;
          this.tempOrderList = res;
        }
      },
      err => {
        this.isLoading = false;
        console.error('Error fetching order list:', err);
        alert('Failed to fetch orders. Please try again later.');
      }
    );
  }

  changeDate(ev: any): void {
    const selectedDate = this.datePipe.transform(ev?.value, 'yyyy-MM-dd');
    if (!selectedDate) {
      this.orderList = [...this.tempOrderList];
      return;
    }

    this.orderList = this.tempOrderList.filter((item: Order) => {
      const itemDate = item?.orderedDate ? this.datePipe.transform(item.orderedDate, 'yyyy-MM-dd') : null;
      return itemDate === selectedDate;
    });
  }

  getDate(d: string | undefined): any {
    return !!d ? this.datePipe.transform(d, "shortDate") : null;
  }
}

