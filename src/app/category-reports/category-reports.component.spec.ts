import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryReportsComponent } from './category-reports.component';

describe('CategoryReportsComponent', () => {
  let component: CategoryReportsComponent;
  let fixture: ComponentFixture<CategoryReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
