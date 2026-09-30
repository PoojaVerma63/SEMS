import { TestBed } from '@angular/core/testing';

import { EmployeeApi } from './employee-api';

describe('EmployeeApi', () => {
  let service: EmployeeApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
