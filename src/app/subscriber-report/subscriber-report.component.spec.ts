import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberReportComponent } from './subscriber-report.component';

describe('SubscriberReportComponent', () => {
  let component: SubscriberReportComponent;
  let fixture: ComponentFixture<SubscriberReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
