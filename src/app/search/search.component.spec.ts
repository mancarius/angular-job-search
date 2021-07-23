import { Overlay } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { from, Observable, of, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { GeolocationService } from '../geolocation.service';
import { LEVELS, LOCATION, REMOTE_STR } from '../shared/defaultFilters';
import { mockSearchResults } from '../shared/mockSearchResults';
import { FilterParams } from '../shared/models/FilterParams.model';
import { HereAddresses } from '../shared/models/HereAddresses';
import { SearchQueryParams } from '../shared/models/SearchQueryParams.model';
import { Job } from '../shared/models/theMuse.model';
import { TheMuseAPIService } from '../the-muse-api.service';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  const geolocationInjectedStub = {
    currentAddress$: function (params?: Params): Observable<HereAddresses> {
      return from([]);
    },
  };
  const theMuseMockService = {
    getJobs$: function (
      locations: Array<string>,
      levels: Array<string>,
      page: number = 1
    ): Observable<SearchQueryParams> {
      return of();
    },
  };
  const mockRoute = { queryParams : new Subject() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, RouterTestingModule ],
      declarations: [SearchComponent],
      providers: [
        { provide: GeolocationService, useValue: geolocationInjectedStub },
        { provide: TheMuseAPIService, useValue: theMuseMockService },
        { provide: ActivatedRoute, useValue: mockRoute },
        MatSnackBar, Overlay
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onQueryParamsChange should call #api.getJobs$, #getFiltersByParams, #updateJobsList, and #refreshFiltersParams', fakeAsync(() => {
    const mockParams: Params = {
      location: [LOCATION],
      level: [LEVELS.mid],
      page: 2
    };
    const mockReturnedFilters: FilterParams = {
      locations: [LOCATION],
      levels: [LEVELS.mid],
      page: 2
    };
    
    spyOn<any>(component['api'], 'getJobs$').and.returnValue(of(mockSearchResults));
    spyOn<any>(component, 'getFiltersByParams').and.returnValue(of(mockReturnedFilters).pipe(first()).toPromise());
    spyOn<any>(component, 'updateJobsList').and.stub();
    spyOn<any>(component, 'refreshFiltersParams').and.stub();
    
    component['onQueryParamsChange'](mockParams);

    tick();
  
    expect(component['api']['getJobs$']).toHaveBeenCalled();
    expect(component['getFiltersByParams']).toHaveBeenCalled();
    expect(component['updateJobsList']).toHaveBeenCalled();
    expect(component['refreshFiltersParams']).toHaveBeenCalled();
  }));

  it('#getFiltersByParams should return filters equal to passed params', async () => {
    const params: SearchQueryParams = {
      location: [LOCATION],
      level: [LEVELS.mid, LEVELS.senior],
      page: 1,
    };
    const expectedResponse: FilterParams = {
      locations: [LOCATION],
      levels: [LEVELS.mid, LEVELS.senior],
      page: 1,
    };

    let result = await component['getFiltersByParams'](params);

    expect(result).toEqual(expectedResponse);
  });

  it('#getFiltersByParams should call #currentAddress$', async () => {
    spyOn(geolocationInjectedStub, 'currentAddress$');
    const params: SearchQueryParams = {
      location: [],
      level: [LEVELS.mid, LEVELS.senior],
      page: 1,
    };

    component['getFiltersByParams'](params).finally(() => {
      expect(geolocationInjectedStub.currentAddress$).toHaveBeenCalledTimes(1);
    });
  });

  it('#updateJobsList should assign passed params to #JobList', async () => {
    const mockParams: Job[] = mockSearchResults.results;
    const expectedJobsList: Job[] = mockParams;

    component['updateJobsList'](mockParams);

    expect(component['JobsList']).toEqual(expectedJobsList);

  });

  it('#refreshFiltersParams should assign passed params to #filters', async () => {
    const mockParams: FilterParams = {
      locations: [LOCATION],
      levels: [LEVELS.mid], 
      page: 1
    };
    const expectedFilters: FilterParams = mockParams;

    component['refreshFiltersParams'](mockParams);

    expect(component['filters']).toEqual(expectedFilters);

  });

  it("#goToPage should update the url's param 'page'", inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
    const expectedPage = 10;
    const expectedNavigationParams = {
      relativeTo: route,
      queryParams: {
        location: component.filters.locations,
        level: component.filters.levels,
        page: expectedPage
      }
    };
    spyOn(router, 'navigate').and.stub();

    component['goToPage'](expectedPage);

    expect(router.navigate).toHaveBeenCalledWith([], expectedNavigationParams);
  }));
});