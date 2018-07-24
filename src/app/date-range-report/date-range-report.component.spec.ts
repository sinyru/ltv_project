import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeReportComponent } from './date-range-report.component';

describe('DateRangeReportComponent', () => {
  let component: DateRangeReportComponent;
  let fixture: ComponentFixture<DateRangeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateRangeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
