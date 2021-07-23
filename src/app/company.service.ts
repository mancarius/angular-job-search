import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company, Industries, Location } from './shared/models/theMuse.model';
import { TheMuseAPIService } from './the-muse-api.service';

type Sizes = "small" | "medium" | "large";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private apiService: TheMuseAPIService) { }

  /**
   * Returns company informations by id
   *
   * @param {number} id
   * @return {*}  {Observable<Company>}
   * @memberof CompanyService
   */
  get(id: number): Observable<Company> {
    return this.apiService.company(id);
  }

  /**
   * Convert a list of objects in a list of strings
   *
   * @static
   * @param {(Location[] | undefined)} locations
   * @return {*}  {string[]}
   * @memberof CompanyService
   */
  static getLocationsList(locations:Location[] | undefined): string[] {
    if( typeof locations === 'object' && locations !== null ) {
      return locations.map( location => location.name);
    } else {
      return [];
    }
  }

  /**
   * Convert a ist of objects in a list of strings
   *
   * @static
   * @param {(Industries[] | undefined)} industries
   * @return {*}  {string[]}
   * @memberof CompanyService
   */
  static getIndustriesList(industries: Industries[] | undefined): string[] {
    if( typeof industries === 'object' && industries !== null ) {
      return industries.map( industry => industry.name);
    } else {
      return [];
    }
  }

  /**
   * Returns literal size by tags
   *
   * @static
   * @param {(string | undefined)} size
   * @return {*}  {string}
   * @memberof CompanyService
   */
  static convertSizeForHumans(size: string | undefined): string {
    switch (size) {
      case 'small':
        return '51-200 employees';
      case 'medium':
        return '201 - 500 employees';
      case 'large':
        return '10,000+ employees';
      default:
        return 'other';
    }
  }
}
