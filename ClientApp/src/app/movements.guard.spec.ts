import { TestBed } from '@angular/core/testing';

import { MovementsGuard } from './movements.guard';

describe('MovementsGuard', () => {
  let guard: MovementsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MovementsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
