import { TestBed } from '@angular/core/testing';

import { GestureDetectService } from './gesture-detect-service';

describe('GestureDetectService', () => {
  let service: GestureDetectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestureDetectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
