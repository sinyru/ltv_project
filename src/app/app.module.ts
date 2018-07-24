import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { HomeComponent } from './home/home.component';
import { SubscriberReportComponent } from './subscriber-report/subscriber-report.component';
import { ReturnCustomersComponent } from './return-customers/return-customers.component';
import { CategoryReportsComponent } from './category-reports/category-reports.component';
import { DateRangeReportComponent } from './date-range-report/date-range-report.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SubscriberReportComponent,
    ReturnCustomersComponent,
    CategoryReportsComponent,
    DateRangeReportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    routing,
    Ng4LoadingSpinnerModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    OrderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
