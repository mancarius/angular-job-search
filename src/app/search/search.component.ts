import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { first, take } from 'rxjs/operators';
import { FiltersComponent } from '../filters/filters.component';
import { GeolocationService } from '../geolocation.service';
import { LEVELS, LOCATION, REMOTE_STR } from '../shared/defaultFilters';
import { FilterParams } from '../shared/models/FilterParams.model';
import { HereAddresses } from '../shared/models/HereAddresses';
import { Job } from '../shared/models/theMuse.model';
import { SearchQueryParams } from '../shared/models/SearchQueryParams.model';
import { TheMuseAPIService } from '../the-muse-api.service';
import { ErrorHandlerService } from '../error-handler.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  isLoading = false;
  JobsList: Array<Job> = [];
  filters: FilterParams = {
    locations: [LOCATION, REMOTE_STR],
    levels: [LEVELS.entry, LEVELS.mid, LEVELS.senior],
    page: 1,
  };
  pageCount: number = 1;

  @ViewChild(FiltersComponent) FiltersComponent: FiltersComponent | undefined;

  constructor(
    private api: TheMuseAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private geolocation: GeolocationService,
    private errorHandler: ErrorHandlerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe((params) => {
      try{
        this.onQueryParamsChange.apply(this, [params])
      } catch (e) {
        this._errorHandler(e);
      }
    },
    error => {
      console.warn(error)
    });
  }

  private _errorHandler(error: any) {

    this.errorHandler.add(error).and.showMessage();
    
  }

  private async onQueryParamsChange(params: Params): Promise<void>{
    let newFilters: FilterParams = this.filters;

    if (Object.keys(params).length) {
      this.isLoading = true;

      try {
        newFilters = await this.getFiltersByParams(params as SearchQueryParams);
      } catch (error) {
        console.warn(error);
      }

      try {
        const jobsResponse = await this.api
          .getJobs$(newFilters)
          .pipe(first())
          .toPromise();
        this.updateJobsList(jobsResponse?.results);
        this.pageCount = jobsResponse?.page_count ?? this.pageCount;
        this.refreshFiltersParams({
          ...newFilters,
          page: jobsResponse?.page ?? newFilters?.page,
        });
      } catch (e) {
        console.warn(e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    }
  }

  /**
   * Obtain filters values from given url's query params.
   * If location is emty, try to load the current user location
   *
   * @private
   * @param {SearchQueryParams} params
   * @return {*}  {Promise<FilterParams>}
   * @memberof SearchComponent
   */
  private async getFiltersByParams(
    params: SearchQueryParams
  ): Promise<FilterParams> {
    let { location, level, page } = params;

    if (location?.length) {
      location = typeof location === 'string' ? [location] : location;
    } else {
      let address: undefined | HereAddresses;

      try {
        address = await this.geolocation
          .currentAddress$()
          .pipe(take(1))
          .toPromise();
      } catch (err) {
        console.warn(err);
      }

      if (typeof address !== 'undefined') {
        location = [address.county + ', ' + address.countryName];
      } else {
        location = [LOCATION, REMOTE_STR];
      }
    }

    if (level?.length) {
      level = typeof level === 'string' ? [level] : level;
    } else {
      level = [LEVELS.entry, LEVELS.mid, LEVELS.senior];
    }

    if ('page' in params) {
      page = page;
    } else {
      page = 1;
    }

    return { locations: location, levels: level, page };
  }

  /**
   * Assign passed params to #JobList.
   *
   * @param {Job[] | undefined} data
   * @memberof SearchComponent
   */
  private updateJobsList(data: Job[] | undefined): void {
    this.JobsList = data ?? [];
  }

  /**
   * Updates filters with given params
   *
   * @param {FilterParams} params
   * @memberof SearchComponent
   */
  private refreshFiltersParams(params: FilterParams) {
    this.filters = params;
  }

  /**
   * update the url's param 'page'
   *
   * @param {number} page
   * @memberof SearchComponent
   */
  goToPage(page: number): void {
    if (page > 0) {
      const newParams: SearchQueryParams = { 
        location: this.filters.locations,
        level: this.filters.levels,
        page: page
      };
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: newParams,
      });
    }
  }
}