import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public template: string =`<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`
  public updateDateRange:string = '';
  public startDate:any = '';
  public today:any = '';
  public twoWeeksDate:any = '';
  public isUpdateable:boolean = false;
  public lapsedDays:number = 0;
  public weeks:number = 2;
  public isWeeksUpdateable:boolean = false;
  constructor(private http: HttpClient, private router:Router,
    private spinnerService: Ng4LoadingSpinnerService ) { }

  ngOnInit() {
    this.spinnerService.show();
    this.http.get(environment.rDatesUrl).subscribe((dateData:any)=>{
      this.today = new Date();
      this.today = this.today.toISOString().split("T")[0];
      this.updateDateRange = `${dateData.start_date} to ${this.today}`;
      this.startDate = dateData.start_date;
      this.isUpdateable = (this.today > this.startDate);
      this.spinnerService.hide();

      let dt1 = this.startDate.split("-");
      dt1 = new Date(dt1[0], dt1[1]-1, dt1[2]);
      let dt2 = this.today.split("-");
      dt2 = new Date(dt2[0], dt2[1]-1, dt2[2]);
      let dt3 = this.startDate.split("-");
      dt3 = new Date(dt3[0], dt3[1]-1, parseInt(dt3[2])+14);
      this.lapsedDays = Math.round((dt2-dt1)/(1000*60*60*24));
      (this.lapsedDays > 14)? this.isWeeksUpdateable=true : this.isWeeksUpdateable=false ;
      this.today = dt2.toISOString().split("T")[0];
      this.twoWeeksDate = dt3.toISOString().split("T")[0];
    });

  }

  updatebyWeeks() {
    this.spinnerService.show();
    this.http.get(environment.pageOrdersUrl)
    .subscribe((orders:any)=>{
      this.updateDatabase(orders, this.twoWeeksDate);
    });
  }

  updateUpToDate() {
    this.spinnerService.show();
    this.http.get(environment.ordersUrl)
    .subscribe((data:any)=>{
      this.updateDatabase(data, this.today);
    });
  }

  updateDatabase(data:any, updateDate:any) {
    // this.spinnerService.show();
    // this.http.get(environment.ordersUrl)
    // .subscribe((data:any)=>{
      let orders = [];
      for(let i=0;i<data.length;i++){
        for(let k=0;k<data[i].orders.length;k++){
          orders.push(data[i].orders[k]);
        }
      }
      let sampleCounts = 0;
      let sixCounts = 0;
      let twelveCounts = 0;
      let twentyFourCounts = 0;
      for(let i=0;i<orders.length;i++) {
        // let customer = {
        //                   "customer_id": orders[i].customer.id,
        //                   "email": orders[i].customer.email,
        //                   "first_name": orders[i].customer.first_name,
        //                   "last_name": orders[i].customer.last_name,
        //                   "province": (orders[i].customer.default_address)? orders[i].customer.default_address.province_code : 'N/A' ,
        //                   "country": (orders[i].customer.default_address)? orders[i].customer.default_address.province_code : 'N/A'
        //                };
        // this.http.post(environment.customersUrl, {"customer": customer}).toPromise().then();
        for(let j=0;j<orders[i].line_items.length;j++){
          let order = {
            "order_id": orders[i].id,
            "customer_id": orders[i].customer.id,
            "created_at": orders[i].created_at,
            "item_purchased": (orders[i].line_items[j].variant_title)? orders[i].line_items[j].variant_title : "",
            "email": orders[i].customer.email,
            "first_name": orders[i].customer.first_name,
            "last_name": orders[i].customer.last_name,
            "item_description": (orders[i].line_items[j].name)? orders[i].line_items[j].name : "",
            "quantity": orders[i].line_items[j].quantity,
            "price": orders[i].line_items[j].price,
            "order_unique_key": `${orders[i].id}-${orders[i].created_at}-${orders[i].line_items[j].sku}`
          }
          if (order["item_purchased"] === "") {
            order["item_purchased"] = "Sampler";
          }
          if (orders[i].line_items[j].name.split(" ")[3] === 'Sampler') {
            this.http.post(environment.sampleOrdersUrl, {"sample_order": order}).toPromise().then();
            sampleCounts++;
          } else if (orders[i].line_items[j].variant_title === "6-Pack") {
            this.http.post(environment.sixPackOrdersUrl, {"six_pack_order": order}).toPromise().then();
            sixCounts++;
          } else if (orders[i].line_items[j].variant_title === "12-Pack") {
            this.http.post(environment.twevlePackOrdersUrl, {"twelve_pack_order": order}).toPromise().then();
            twelveCounts++;
          } else if (orders[i].line_items[j].variant_title === "24-Pack") {
            this.http.post(environment.twentyFourPackOrdersUrl, {"twenty_four_pack_order": order}).toPromise().then();
            twentyFourCounts++;
          }
        }
      }
      // this.http.get(environment.subscriberCountsUrl).subscribe((data:any)=>{
        // let monthReport = {
        //   "order_counts": orders.length,
        //   "sample_counts": sampleCounts,
        //   "six_counts": sixCounts,
        //   "twelve_counts": twelveCounts,
        //   "twenty_four_counts": twentyFourCounts,
        //   "subscriber_counts": data.count,
        //   "date_range": this.updateDateRange
        // };
        // this.http.post(environment.monthReportsUrl, {"month_report": monthReport}).toPromise().then(()=>{
          let newDate = {
            "start_date": updateDate
          };
          this.http.post(environment.rDatesUrl, {"rdate": newDate}).toPromise().then(()=>{
              this.isUpdateable = (this.today > this.startDate);
              let dt1 = this.startDate.split("-");
              dt1 = new Date(dt1[0], dt1[1]-1, dt1[2]);
              let dt2 = this.today.split("-");
              dt2 = new Date(dt2[0], dt2[1]-1, dt2[2]);
              let dt3 = this.startDate.split("-");
              dt3 = new Date(dt3[0], dt3[1]-1, parseInt(dt3[2])+14);
              this.lapsedDays = Math.round((dt2-dt1)/(1000*60*60*24));
              (this.lapsedDays > 14)? this.isWeeksUpdateable=true : this.isWeeksUpdateable=false ;
              this.today = dt2.toISOString().split("T")[0];
              this.twoWeeksDate = dt3.toISOString().split("T")[0];
              this.spinnerService.hide();
          });
        // });
      // });
    // });
  }

    goSubscribers() {
      this.router.navigate(['subscribers-report']);
    }

    goMonthlyReport() {
      this.router.navigate(['monthly-report']);
    }

    goReturnCustomers() {
      this.router.navigate(['return-customers']);
    }

    goCategoryReports() {
      this.router.navigate(['category-reports']);
    }

    goDateRangeReport() {
      this.router.navigate(['date-range-report']);
    }
}
