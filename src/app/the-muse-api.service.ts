import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { FilterParams } from './shared/models/FilterParams.model';
import { Company, Job, JobsResults } from './shared/models/theMuse.model';

@Injectable({
  providedIn: 'root',
})
export class TheMuseAPIService {
  base_url = 'https://www.themuse.com/api/public/';

  constructor(private http: HttpClient) {}

  /**
   * Returns a list of jobs that match the search criteria
   *
   * @param {Array<string>} locations
   * @param {Array<string>} levels
   * @param {number} [page=1]
   * @return {*}  {Observable<JobsResults>}
   * @memberof TheMuseAPIService
   */
  getJobs$(params: FilterParams): Observable<JobsResults> {
    const { locations, levels, page} = params;

    let locationsParams: string = locations?.length > 0
      ? '&' +
        locations
          .map((location) => 'location=' + encodeURIComponent(location))
          .join('&')
      : '';

    let levelsParams: string = levels?.length > 0
      ? '&' +
        levels.map((level) => 'level=' + encodeURIComponent(level)).join('&')
      : '';

    let fullUrl =
      this.base_url +
      'jobs?category=' +
      encodeURIComponent('Software Engineer') +
      levelsParams +
      locationsParams +
      '&page=' +
      String(page);

    return this.http.get<JobsResults>(fullUrl).pipe(
      map((response: any) => {
        if ('error' in response) {
          throw throwError(response.error);
        }
        return response;
      }),
      catchError(this.errorHandler)
    );
  }

  /**
   * Returns a job informations by id
   *
   * @param {number} id
   * @return {*}  {Observable<Job>}
   * @memberof TheMuseAPIService
   */
  job(id: number): Observable<Job> {
    let completeUrl = this.base_url + 'jobs/' + id;
    return this.http.get<Job>(completeUrl).pipe(catchError(this.errorHandler));
  }

  /**
   * Returns company informations by id
   *
   * @param {number} id
   * @return {*}  {Observable<Company>}
   * @memberof TheMuseAPIService
   */
  company(id: number): Observable<Company> {
    let completeUrl = this.base_url + 'companies/' + id;
    return this.http.get<Company>(completeUrl).pipe(
      map((response: any) => {
        if ('error' in response) {
          throw throwError(response.error);
        }
        return response;
      }),
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: any) {
    // if (typeof error === 'object') {
    //   switch (error.code) {
    //     case 400:
    //       break;
    //     case 403:
    //       break;
    //     case 404:
    //       break;
    //     default:
    //       break;
    //   }
    // }

    return throwError(error || 'server error.');
  }
}