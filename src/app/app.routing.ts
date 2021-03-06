import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SubscriberReportComponent } from './subscriber-report/subscriber-report.component';
import { ReturnCustomersComponent } from './return-customers/return-customers.component';
import { CategoryReportsComponent } from './category-reports/category-reports.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'subscribers-report', component: SubscriberReportComponent },
  { path: 'return-customers', component: ReturnCustomersComponent },
  { path: 'category-reports', component: CategoryReportsComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
