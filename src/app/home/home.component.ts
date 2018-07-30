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
      let orders = [];
      for(let i=0;i<data.length;i++){
        for(let k=0;k<data[i].orders.length;k++){
          orders.push(data[i].orders[k]);
        }
      }
      for(let i=0;i<orders.length;i++) {
        for(let j=0;j<orders[i].line_items.length;j++){
          if (orders[i].customer) {
            let itemDescription = (orders[i].line_items[j].name)? orders[i].line_items[j].name : "";
            let order = {
              "order_id": orders[i].id,
              "customer_id": (orders[i].customer)? orders[i].customer.id : "",
              "created_at": orders[i].created_at,
              "variant_title": (orders[i].line_items[j].variant_title)? orders[i].line_items[j].variant_title : "",
              "email": orders[i].email,
              "first_name": (orders[i].customer)? orders[i].customer.first_name : "",
              "last_name": (orders[i].customer)? orders[i].customer.last_name : "",
              "product_title": itemDescription,
              "quantity": orders[i].line_items[j].quantity,
              "price": orders[i].line_items[j].price,
              "order_unique_key": `${orders[i].id}${itemDescription}${orders[i].created_at}${orders[i].line_items[j].quantity}`,
              "s_24": false,
              "s_12": false,
              "s_6": false,
              "s_sub": false,
              "prod_sub": false
            }
            if (order["variant_title"] === "" || order["variant_title"] === null) {
              order["variant_title"] = "Sampler";
              order["item_type"] = "Sampler";
            } else {
              order["item_type"] = "Product";
            }
            this.http.post(environment.allOrdersUrl, {"all_order": order}).toPromise().then();
          }
        }
      }
      let newDate = {
        "start_date": updateDate
      };
      this.http.post(environment.rDatesUrl, {"rdate": newDate}).toPromise().then(()=>{
        (this.router.url === '/')? this.router.navigate(['home']) : this.router.navigate(['']);
      });
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
