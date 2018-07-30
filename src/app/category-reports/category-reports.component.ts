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

  orders:any;
  haveData:boolean = false;
  subscribers:any = [];
  subscriptions:any = [];
  isDateRange:boolean = false;
  searchDates:any;
  results:any = [];
  searchDateOrders:any=[];
  reportSelected:string = '';

  constructor(public http: HttpClient, private router:Router,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.subscribers = [];
    this.spinnerService.show();
    this.http.get(environment.subscribersUrl).subscribe((subscribers:any)=>{
      this.http.get(environment.subscriptionsUrl).subscribe((subscriptions:any)=>{
        for(let i=0;i<subscribers.length;i++){
          for(let j=0;j<subscribers[i].customers.length;j++){
            this.subscribers.push(subscribers[i].customers[j]);
          }
        }
        for(let x=0;x<subscriptions.length;x++) {
          for(let y=0;y<subscriptions[x].subscriptions.length;y++) {
            let customer = this.subscribers.find((subscriber) => subscriber.id === subscriptions[x].subscriptions[y].customer_id);
            let subscription = {
              "last_name":customer.last_name,
              "first_name":customer.first_name,
              "created_at":customer.created_at,
              "updated_at":customer.updated_at,
              "billing_province":customer.billing_province,
              "billing_country":customer.billing_country,
              "email":customer.email,
              "status":subscriptions[x].subscriptions[y].status,
              "product_title":subscriptions[x].subscriptions[y].product_title,
              "variant_title":(subscriptions[x].subscriptions[y].variant_title === "")? "Sampler": subscriptions[x].subscriptions[y].variant_title,
              "cancellation_reason": (subscriptions[x].subscriptions[y].cancellation_reason === null)? "" : (subscriptions[x].subscriptions[y].cancellation_reason_comments === null)? subscriptions[x].subscriptions[y].cancellation_reason : subscriptions[x].subscriptions[y].cancellation_reason + " " + subscriptions[x].subscriptions[y].cancellation_reason_comments,
              "price":(subscriptions[x].subscriptions[y].price === null)? 0 : subscriptions[x].subscriptions[y].price,
              "quantity":subscriptions[x].subscriptions[y].quantity,
              "item_type": (subscriptions[x].subscriptions[y].variant_title === "")? "Sampler": "subscription",
              "prod_sub": false
            }
            this.subscriptions.push(subscription);
          }
        }

        this.http.get(environment.allOrdersUrl).subscribe((orders:any)=>{
          orders = orders.map((order)=>{
            return {
              "last_name":order.last_name,
              "first_name":order.first_name,
              "created_at":order.created_at,
              "updated_at": "",
              "billing_province": "",
              "billing_country": "",
              "email":order.email,
              "status": "",
              "product_title":order.product_title,
              "variant_title":order.variant_title,
              "cancellation_reason": "",
              "price":order.price,
              "quantity":order.quantity,
              "item_type": (order.product_title.includes('ubscription'))? 'subscription' : order.item_type,
              "prod_sub": order.prod_sub
            }
          });
          this.orders = orders.concat(this.subscriptions);
          this.orders = this.orders.sort((a, b)=> {
               b["variant_title"] - a["variant_title"] || a["created_at"] - b["created_at"] || a["email"] - b["email"];
          });
          let sum = 0;
          let count = 0;
          for(let i=0;i<this.orders.length;i++) {
            sum = sum + this.orders[i].price;
            count++;
            if(this.orders[i+1]) {
              if(this.orders[i].email !== this.orders[i+1].email) {
                this.orders[i]['ltv'] = sum;
                for(let x=0;x<count;x++){
                  this.orders[i-x]['ltv'] = sum;
                }
                count = 0;
                sum = 0;
              }
            }
            if(this.orders[i+1]!==undefined) {
              if(this.orders[i].created_at === this.orders[i+1].created_at && this.orders[i+1].variant_title === 'Sampler') {
                let temp = this.orders[i];
                this.orders[i] = this.orders[i+1];
                this.orders[i+1] = temp;
              }
            }
          }
          this.spinnerService.hide();
        });
      });
    });
  }

  getDateOrders(startDate:any, endDate:any) {
    this.isDateRange = true;
    let sDate = startDate.toISOString().split("T")[0].toString();
    let eDate = endDate.toISOString().split("T")[0].toString();
    this.searchDateOrders = this.orders.filter(order => order.created_at >= startDate.toISOString() && order.created_at <= endDate.toISOString());
  }

  goReport(reportUrl:any) {
    this.spinnerService.show();
    this.haveData = true;
    this.reportSelected = reportUrl.target.value;
    (reportUrl.target.value === 'sample')? this.results = this.searchDateOrders.filter((order)=>order.variant_title === "Sampler") :
    (reportUrl.target.value === '6-Pack')? this.results = this.searchDateOrders.filter((order)=>order.variant_title === "6-Pack" ) :
    (reportUrl.target.value === '12-Pack')? this.results = this.searchDateOrders.filter((order)=>order.variant_title === "12-Pack" ) :
    (reportUrl.target.value === '24-Pack')? this.results = this.searchDateOrders.filter((order)=>order.variant_title === "24-Pack" ) : this.results = this.searchDateOrders;
    this.spinnerService.hide();
  }

  exportCSV() {
    new Angular5Csv(this.results, 'orders-report');
  }

  goBack() {
    this.router.navigate(['']);
  }
}
