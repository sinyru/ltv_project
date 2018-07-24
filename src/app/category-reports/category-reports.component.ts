import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import 'rxjs/add/operator/toPromise';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-category-reports',
  templateUrl: './category-reports.component.html',
  styleUrls: ['./category-reports.component.css']
})
export class CategoryReportsComponent implements OnInit {

  orders:any = [];
  haveData:boolean = false;

  constructor(public http: HttpClient, private router:Router,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
  }

  goReport(reportUrl:any) {
    this.orders = [];
    this.haveData = false;
    this.spinnerService.show();
    this.http.get(environment[reportUrl.target.value]).subscribe((orders:any)=>{
      (orders.sample_orders)? this.orders = orders.sample_orders :
      (orders.six_pack_orders)? this.orders = orders.six_pack_orders :
      (orders.twelve_pack_orders)? this.orders = orders.twelve_pack_orders : this.orders = orders.twenty_four_pack_orders;
      this.spinnerService.hide();
      this.haveData = true;
    });
  }

  exportCSV() {
    new Angular5Csv(this.orders, 'orders-report');
  }

  goBack() {
    this.router.navigate(['']);
  }
}
