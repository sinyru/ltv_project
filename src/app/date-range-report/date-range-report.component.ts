import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-date-range-report',
  templateUrl: './date-range-report.component.html',
  styleUrls: ['./date-range-report.component.css']
})
export class DateRangeReportComponent implements OnInit {

  orders:any = [];
  haveData:boolean = false;
  constructor(private http: HttpClient, private router:Router,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {

  }

  getWithinDateOrders(ordersUrl:string, startDate:string, endDate:string) {
    this.http.get(environment[ordersUrl]).subscribe((orders:any)=>{
      let orderProperty = '';
      (orders.sample_orders)? orderProperty = "sample_orders" :
      (orders.six_pack_orders)? orderProperty = "six_pack_orders" :
      (orders.twelve_pack_orders)? orderProperty= "twelve_pack_orders": orderProperty = "twenty_four_pack_orders";
      for(let i=0;i<orders[orderProperty].length;i++) {
        if(orders[orderProperty][i].created_at >= startDate && orders[orderProperty][i].created_at <= endDate) {
          this.orders.push(orders[orderProperty][i]);
        }
      }
    });
  }

  goReport(dt1:any, dt2:any) {
    this.orders = [];
    this.haveData = false;
    let startDate = dt1.toISOString().split("T")[0];
    let endDate = dt2.toISOString().split("T")[0];
    this.spinnerService.show();
    console.log(startDate);
    console.log(endDate)
    this.getWithinDateOrders("sampleOrdersUrl", startDate, endDate);
    this.getWithinDateOrders("sixPackOrdersUrl", startDate, endDate);
    this.getWithinDateOrders("twevlePackOrdersUrl", startDate, endDate);
    this.getWithinDateOrders("twentyFourPackOrdersUrl", startDate, endDate);
    this.spinnerService.hide();
    this.haveData = true;
  }


  goBack() {
    this.router.navigate(['']);
  }

  exportCSV() {
    new Angular5Csv(this.orders, 'date-range-report');
  }

}
