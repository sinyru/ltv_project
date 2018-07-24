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

  constructor(private http: HttpClient, private router:Router,
    private spinnerService: Ng4LoadingSpinnerService) { }

  ngOnInit() {
    this.subscribers = [];
    this.spinnerService.show();
    this.http.get(environment.subscriberCountsUrl).subscribe((counts:any)=>{
      this.count = counts.count;
    });
    this.http.get(environment.subscribersUrl).subscribe((subscribers:any)=>{
      for(let i=0;i<subscribers.length;i++){
        for(let j=0;j<subscribers[i].customers.length;j++){
          let subscriber = {
            'created_at': subscribers[i].customers[j].created_at,
            'updated_at': subscribers[i].customers[j].updated_at,
            'last_name': subscribers[i].customers[j].last_name,
            'first_name': subscribers[i].customers[j].first_name,
            'email': subscribers[i].customers[j].email,
            'billing_province': subscribers[i].customers[j].billing_province,
            'billing_country': subscribers[i].customers[j].billing_country,
            'status': subscribers[i].customers[j].status
          };
          this.subscribers.push(subscriber);
        }
      }
      this.spinnerService.hide();
    });
  }

  goBack() {
    this.router.navigate(['']);
  }

  exportCSV() {
    new Angular5Csv(this.subscribers, 'date-range-report');
  }

}
