import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnCustomersComponent } from './return-customers.component';

describe('ReturnCustomersComponent', () => {
  let component: ReturnCustomersComponent;
  let fixture: ComponentFixture<ReturnCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
