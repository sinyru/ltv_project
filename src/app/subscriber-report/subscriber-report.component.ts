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
  reportSelected:any="";
  filterValue:string="last_name";
  dRSubscriptions:any = [];
  dRSixSubs:any = [];
  dRTwelveSubs:any = [];
  dRTwentyFourSubs:any = [];
  isDateRange:boolean = false;
  searchDates:string ='';

  constructor(private http: HttpClient, private router:Router,
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
            if(subscriptions[x].subscriptions[y].status === 'ACTIVE') {
              this.count++;
            }
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

  getWithinDateSubs(startDate:string, endDate:string) {
    this.isDateRange = true;
    let startDate = startDate.toISOString().split("T")[0];
    let endDate = endDate.toISOString().split("T")[0];
    this.searchDates = `${startDate}--${endDate}`;
    this.dRSubscriptions = this.subscriptions.filter(subscription => subscription.created_at >= startDate.toISOString() && subscription.created_at <= endDate.toISOString());
    this.dRSixSubs = this.sixSubs.filter(subscription => subscription.created_at >= startDate.toISOString() && subscription.created_at <= endDate.toISOString());
    this.dRTwelveSubs = this.twelveSubs.filter(subscription => subscription.created_at >= startDate.toISOString() && subscription.created_at <= endDate.toISOString());
    this.dRTwentyFourSubs = this.twentyFourSubs.filter(subscription => subscription.created_at >= startDate.toISOString() && subscription.created_at <= endDate.toISOString());
    (this.reportSelected === this.twentyFourSubs || this.reportSelected === this.dRTwentyFourSubs)? this.reportSelected = this.dRTwentyFourSubs :
    (this.reportSelected === this.sixSubs || this.reportSelected === this.dRSixSubs)? this.reportSelected = this.dRSixSubs :
    (this.reportSelected === this.twelveSubs || this.reportSelected === this.dRTwelveSubs)? this.reportSelected = this.dRTwelveSubs :
    this.reportSelected = this.dRSubscriptions;

  }

  goReport(numPacks:any) {
    (numPacks.target.value === 'All')? this.reportSelected = this.dRSubscriptions:
    (numPacks.target.value === '6-Pack')? this.reportSelected = this.dRSixSubs:
    (numPacks.target.value === '12-Pack')? this.reportSelected = this.dRTwelveSubs:
    (numPacks.target.value === '24-Pack')? this.reportSelected = this.dRTwentyFourSubs: this.reportSelected = "";
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
    (this.reportSelected === this.dRSubscriptions)? new Angular5Csv(this.dRSubscriptions,`all-supscriptions-report-${this.searchDates}`):
    (this.reportSelected === this.dRSixSubs)? new Angular5Csv(this.dRSixSubs, `6p-supscriptions-report-${this.searchDates}`):
    (this.reportSelected === this.dRTwelveSubs)? new Angular5Csv(this.dRTwelveSubs, `12p-supscriptions-report-${this.searchDates}`):
    (this.reportSelected === this.dRTwentyFourSubs)? new Angular5Csv(this.dRTwentyFourSubs, `24p-supscriptions-report-${this.searchDates}`): this.reportSelected = "";
  }


}
