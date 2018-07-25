import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-subscriber-report',
  templateUrl: './subscriber-report.component.html',
  styleUrls: ['./subscriber-report.component.css']
})
export class SubscriberReportComponent implements OnInit {

  subscribers:any = [];
  count: number = 0;
  subscriptions:any = [];
  sixSubs:any=[];
  twelveSubs:any=[];
  twentyFourSubs:any=[];
  reportSelected:string="";
  filterValue:string="last_name";

  constructor(private http: HttpClient, private router:Router,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.subscribers = [];

    this.spinnerService.show();
    this.http.get(environment.subscriberCountsUrl).subscribe((counts:any)=>{
      this.count = counts.count;
    });
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
              "variant_title":subscriptions[x].subscriptions[y].variant_title,
              "cancellation_reason": (subscriptions[x].subscriptions[y].cancellation_reason === null)? "" : (subscriptions[x].subscriptions[y].cancellation_reason_comments === null)? subscriptions[x].subscriptions[y].cancellation_reason : subscriptions[x].subscriptions[y].cancellation_reason + " " + subscriptions[x].subscriptions[y].cancellation_reason_comments,
              "price":(subscriptions[x].subscriptions[y].price === null)? 0 : subscriptions[x].subscriptions[y].price,
              "quantity":subscriptions[x].subscriptions[y].quantity
            }
            this.subscriptions.push(subscription);
          }
        }
        this.sixSubs = this.subscriptions.filter(subscription => subscription.variant_title === '6-Pack');
        this.twelveSubs = this.subscriptions.filter(subscription => subscription.variant_title === '12-Pack')
        this.twentyFourSubs = this.subscriptions.filter(subscription => subscription.variant_title === '24-Pack')
        this.spinnerService.hide();
      });
    });
  }

  goReport(numPacks:any) {
    (numPacks.target.value === 'All')? this.reportSelected = "All":
    (numPacks.target.value === '6-Pack')? this.reportSelected = "6-Pack":
    (numPacks.target.value === '12-Pack')? this.reportSelected = "12-Pack":
    (numPacks.target.value === '24-Pack')? this.reportSelected = "24-Pack": this.reportSelected = "";
  }

  filterSearch(fieldValue:any) {
    (fieldValue.target.value === 'last_name')? this.filterValue = "last_name":
    (fieldValue.target.value === 'first_name')? this.filterValue = "first_name":
    (fieldValue.target.value === 'created_at')? this.filterValue = "created_at":
    (fieldValue.target.value === 'billing_province')? this.filterValue = "billing_province":
    (fieldValue.target.value === 'billing_country')? this.filterValue = "billing_country":
    (fieldValue.target.value === 'status')? this.filterValue = "status":
    (fieldValue.target.value === 'cancellation_reason')? this.filterValue = "cancellation_reason":
    (fieldValue.target.value === 'quantity')? this.filterValue = "quantity":
    (fieldValue.target.value === 'email')? this.filterValue = "email": this.filterValue = "";
  }

  goBack() {
    this.router.navigate(['']);
  }

  exportCSV() {
    (this.reportSelected === 'All')? new Angular5Csv(this.subscriptions,'all-supscriptions-report'):
    (this.reportSelected === '6-Pack')? new Angular5Csv(this.sixSubs, '6p-supscriptions-report'):
    (this.reportSelected === '12-Pack')? new Angular5Csv(this.twelveSubs, '12p-supscriptions-report'):
    (this.reportSelected === '24-Pack')? new Angular5Csv(this.twentyFourSubs, '24p-supscriptions-report'): this.reportSelected = "";
  }

}
