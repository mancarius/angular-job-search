import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ErrorHandlerService } from '../error-handler.service';
import { GeolocationService } from '../geolocation.service';
import { LEVELS, REMOTE_STR } from '../shared/defaultFilters';
import { FilterParams } from '../shared/models/FilterParams.model';
import { SearchQueryParams } from '../shared/models/SearchQueryParams.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {

  @Input() inputFilters: FilterParams = {
    locations: [],
    levels: [],
    page: 1,
  };
  filtersForm: FormGroup = new FormGroup({});
  /**
   * used to print the chips
   *
   * @type {string[]}
   * @memberof FiltersComponent
   */
  filtersList: string[] = [];

  modalOpen = false;

  removable = true;

  constructor(private route: ActivatedRoute, private router: Router, private geolocation: GeolocationService, private errorHandler: ErrorHandlerService) {}

  ngOnChanges(): void {
    this.createFiltersList();
    this.setFiltersFormGroup(this.inputFilters);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if( !Object.keys(params).length ) {
        this.submit();
      }
    },
    error => {
      console.error(error);
      this.errorHandler.add(error);
    });
  }

  /**
   * update the url's query params with the current filters
   *
   * @memberof FiltersComponent
   */
  async submit(): Promise<void> {
    let formValues = this.filtersForm.value;
    let location: Array<string> = [];
    let level: Array<string> = [];
    let isRemote: boolean = formValues.remote;

    if (formValues.location.length > 0) {
      location = formValues.location;
    }
    else if( !isRemote ) {
      try {
        const {county, countryName} = await this.geolocation.currentAddress$().pipe(first()).toPromise();
        location = [county+", "+countryName];
      } catch (err) {
        console.warn(err);
        this.errorHandler.add(err);
      }
    }

    if (isRemote) {
      location.push(REMOTE_STR);
    }

    if (formValues.entryLevel) {
      level.push(LEVELS.entry);
    }

    if (formValues.midLevel) {
      level.push(LEVELS.mid);
    }

    if (formValues.seniorLevel) {
      level.push(LEVELS.senior);
    }

    //if no levels, select all levels
    if (level.length === 0) {
      level.push(LEVELS.entry, LEVELS.mid, LEVELS.senior);
    }

    const queryParams: SearchQueryParams = { location, level, page: 1 };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }

  /**
   * set the filters form group
   *
   * @param {FilterParams} filters
   * @memberof FiltersComponent
   */
  setFiltersFormGroup(filters: FilterParams): void {
    const { locations, levels } = filters;

    const isEntryLevel =
      levels?.some((level) => level === LEVELS.entry) ?? false;
    const isMidLevel =
      levels?.some((level) => level === LEVELS.mid) ?? false;
    const isSeniorLevel =
      levels?.some((level) => level === LEVELS.senior) ?? false;
    const trueIfNoLevels = !isEntryLevel && !isMidLevel && !isSeniorLevel;
    const isRemote =
      locations?.some((location) => location === REMOTE_STR) ?? false;

    this.filtersForm = new FormGroup({
      location: new FormControl(
        locations.filter((location) => location !== REMOTE_STR)
      ),
      entryLevel: new FormControl(isEntryLevel || trueIfNoLevels),
      midLevel: new FormControl(isMidLevel || trueIfNoLevels),
      seniorLevel: new FormControl(isSeniorLevel || trueIfNoLevels),
      remote: new FormControl(isRemote),
    });
  }

  /**
   * Remove the given filter from locations and levels, and reload results
   *
   * @param {string} filter
   * @memberof FiltersComponent
   */
  removeFilterFromFormAndReload(filter: string): void {
    if (this.removeLocationFromFormIfExist(filter) || this.removeLevelFromFormIfExist(filter))
      this.submit();
  }

  /**
   * Returns true if matched and removed, false if not matched
   *
   * @private
   * @param {string} location
   * @return {*}  {boolean}
   * @memberof FiltersComponent
   */
  private removeLocationFromFormIfExist(location: string): boolean {
    let locationsList: string[] = this.filtersForm.value.location;
    let locationIndex = locationsList.indexOf(location);

    if (locationIndex !== -1) {
      locationsList.splice(locationIndex, 1);
      this.filtersForm.controls['location'].setValue(locationsList.join(', '));
      return true;
    } else if (location === REMOTE_STR) {
      this.filtersForm.controls['remote'].setValue(false);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns true if matched and removed, false if not matched
   *
   * @private
   * @param {string} level
   * @returns {*} {boolean}
   * @memberof FiltersComponent
   */
  private removeLevelFromFormIfExist(level: string): boolean {
    let splittedString = level.split(' ');
    let key = splittedString[0].toLowerCase() + splittedString[1];
    if (this.filtersForm.controls[key]) {
      this.filtersForm.controls[key].setValue(false);
      return true;
    } else {
      return false;
    }
  }

  /**
   * convert filters in a list of string for the chips
   *
   * @memberof FiltersComponent
   */
  createFiltersList(): void {
    this.filtersList = [
      ...this.inputFilters.locations,
      ...this.inputFilters.levels
    ];
  }

  closeModal(): void {
    this.modalOpen = false;
  }

  openModal(): void {
    this.modalOpen = true;
  }
}