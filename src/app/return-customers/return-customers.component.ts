import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import 'rxjs/add/operator/toPromise';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Component({
  selector: 'app-return-customers',
  templateUrl: './return-customers.component.html',
  styleUrls: ['./return-customers.component.css']
})
export class ReturnCustomersComponent implements OnInit {
  orders:any = [];
  returns:any = [];
  haveData:boolean = false;

  constructor(public http: HttpClient, private router:Router,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
  }

  goReport(reportUrl:any) {
    this.returns = [];
    this.haveData = false;
    this.spinnerService.show();
    this.http.get(environment[reportUrl.target.value]).subscribe((orders:any)=>{
      (orders.sample_orders)? this.orders = orders.sample_orders :
      (orders.six_pack_orders)? this.orders = orders.six_pack_orders :
      (orders.twelve_pack_orders)? this.orders = orders.twelve_pack_orders : this.orders = orders.twenty_four_pack_orders;
      console.log(reportUrl.target.value);
      console.log(orders);
      for(let i=0; i<this.orders.length; i++) {
        if (this.orders[i-1] && this.orders[i+1]) {
          if(this.orders[i].email === this.orders[i-1].email || this.orders[i].email === this.orders[i+1].email) {
            if(this.orders[i].email === this.orders[i-1].email) {
              let d1 = new Date(this.orders[i-1].created_at).getTime();
              let d2 = new Date(this.orders[i].created_at).getTime();
              let lapsedTime = Math.abs((d2-d1)/(1000*3600*24)).toFixed(2);
              this.orders[i]["time_lapsed"] = `${lapsedTime} days since previous purchase`;
            } else {
              this.orders[i]["time_lapsed"] = 'First Purchase';
            }
            this.returns.push(this.orders[i])
          }
        } else if (this.orders[i-1] === undefined) {
          if(this.orders[i].email === this.orders[i+1].email) {
            this.returns.push(this.orders[i])
          }
        } else if (this.orders[i+1] === undefined) {
          if(this.orders[i].email === this.orders[i-1].email) {
            this.returns.push(this.orders[i])
          }
        }
      }
      this.spinnerService.hide();
      this.haveData = true;
    });
  }

  goBack() {
    this.router.navigate(['']);
  }

  exportCSV() {
    new Angular5Csv(this.returns, 'return-customer-report');
  }
}
