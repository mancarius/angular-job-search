import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TheMuseAPIService } from './the-muse-api.service';
import { LOCATION } from './shared/defaultFilters';
import { FilterParams } from './shared/models/FilterParams.model';

describe('TheMuseAPIService', () => {
  let service: TheMuseAPIService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TheMuseAPIService],
    });
    service = TestBed.inject(TheMuseAPIService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#errorHandler should be called on #getJobs http error', async () => {
    let mockErrorResponse = { code: 404, error: 'Not Found' };
    const params: FilterParams = {
      locations: [LOCATION],
      levels: [],
      page: 1,
    };
    const expectedUrl =
      'https://www.themuse.com/api/public/jobs?category=Software%20Engineer&location=Italy&page=1';

    spyOn<any>(service, 'errorHandler');

    service.getJobs$(params).subscribe(
      () => {},
      () => {}
    );

    const request = httpTestingController.expectOne(expectedUrl);
    expect(request.request.method).toBe('GET');

    request.error(new ErrorEvent(JSON.stringify(mockErrorResponse)));

    expect(service['errorHandler']).toHaveBeenCalled();
  });

  it('#job should return an object', async () => {
    let response: any;
    const jobId = 1;
    const expectedType = 'object';
    const expectedUrl =
      'https://www.themuse.com/api/public/jobs/' + String(jobId);

    service.job(jobId).subscribe((data) => {
      response = data;
    });

    const request = httpTestingController.expectOne(expectedUrl);
    expect(request.request.method).toBe('GET');

    request.flush({});

    expect(typeof response).toEqual(expectedType);
  });

  it('#company should return an object', async () => {
    const companyId = 11964;
    const expectedType = 'object';
    const expectedUrl =
      'https://www.themuse.com/api/public/companies/' + String(companyId);

    service.company(companyId).subscribe((data) => {
      expect(typeof data).toEqual(expectedType);
    });

    const request = httpTestingController.expectOne(expectedUrl);
    expect(request.request.method).toBe('GET');

    request.flush({});
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
