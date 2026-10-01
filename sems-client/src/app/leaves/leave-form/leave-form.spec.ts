import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveForm } from './leave-form';

describe('LeaveForm', () => {
  let component: LeaveForm;
  let fixture: ComponentFixture<LeaveForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
