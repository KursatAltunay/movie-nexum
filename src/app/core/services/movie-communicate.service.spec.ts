import { TestBed } from '@angular/core/testing';

import { MovieCommunicateService } from './movie-communicate.service';

describe('MovieCommunicateService', () => {
  let service: MovieCommunicateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MovieCommunicateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
