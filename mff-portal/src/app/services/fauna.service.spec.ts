import { TestBed } from '@angular/core/testing';

import { FaunaService } from './fauna.service';

describe('FaunaService', () => {
  let service: FaunaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaunaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
