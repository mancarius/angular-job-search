import { Overlay } from '@angular/cdk/overlay';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from, throwError } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment.test';
import { EnvironmentService } from './environment.service';

import { GeolocationService } from './geolocation.service';

function getRandomInRange(from: number, to: number, fixed: number): number {
  return Number((Math.random() * (to - from) + from).toFixed(fixed));
}

describe('GeolocationService', () => {
  let httpTestingController: HttpTestingController;
  let service: GeolocationService;
  let mockPosition: GeolocationPosition = {
    coords: {
      accuracy: 20,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: getRandomInRange(-180, 180, 10),
      longitude: getRandomInRange(-180, 180, 10),
      speed: null,
    },
    timestamp: new Date().getTime(),
  };
  const fakeApiKey = 'fake';
  const mockEnvironmentService = {
    get: () => ({ ...environment, hereApiKey: fakeApiKey }),
  };
  let expectedUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MatSnackBar,
        Overlay,
        { provide: EnvironmentService, useValue: mockEnvironmentService },
      ],
    });
    service = TestBed.inject(GeolocationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    const queryCoords =
      'at=' +
      mockPosition.coords.latitude +
      ',' +
      mockPosition.coords.longitude;
    const queryApiKey = 'apiKey=' + service['env'].get().hereApiKey;
    const apiEndpoint = service['env'].get().hereApiEndpoint;
    expectedUrl = apiEndpoint + queryCoords + '&' + queryApiKey;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#reverseGeocode should use GET method to call the correct URL', async () => {
    const expectedMethod = 'GET';

    service['reverseGeocode'](mockPosition.coords).pipe(first()).subscribe();

    const request = httpTestingController.expectOne(expectedUrl);
    expect(request.request.method).toBe(expectedMethod);

    request.flush({});
  });

  it('#currentAddress$ should call #reverseGeocode but not #getCachedAddress, and should save response in cache', async () => {
    const mockResponse = {
      items: [{ address: { county: 'Rome', countryName: 'Italy' } }],
    };
    const expectedCache = mockResponse;
    spyOn<any>(service, 'reverseGeocode').and.returnValue(from([mockResponse]));
    spyOn<any>(service, 'getCachedResponse');

    await service.currentAddress$().pipe(first()).toPromise();
    const cachedValues = service['_cache'].values();

    expect(service['reverseGeocode']).toHaveBeenCalledTimes(1);
    expect(service['getCachedResponse']).not.toHaveBeenCalled();
    expect(cachedValues.next().value).toEqual(JSON.stringify(expectedCache));
  });

  it('#errorHandler$ should catch the error', async () => {
    spyOn<any>(service, 'errorHandler').and.stub();

    const mockErrorResponse = {
      status: 503,
      title: 'Temporary server error',
      code: 503,
      cause: 'Error description',
      action: 'Action',
      correlationId: 'abc',
      requestId: 'abc',
    };
    const data = 'Temporary server error';

    service['reverseGeocode'](mockPosition.coords).subscribe(
      (data) => {},
      (error) => {}
    );

    httpTestingController
      .expectOne(expectedUrl)
      .error(new ErrorEvent(JSON.stringify(mockErrorResponse)));

    expect(service['errorHandler']).toHaveBeenCalled();
  });
});
