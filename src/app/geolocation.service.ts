import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservableInput, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnvironmentService } from './environment.service';
import { ErrorHandlerService } from './error-handler.service';
import { HereAddresses } from './shared/models/HereAddresses';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  isSupported: boolean = !!navigator.geolocation;
  private _cache = new Map();

  constructor(private http: HttpClient, private env: EnvironmentService, private errorHandlerService: ErrorHandlerService) {}

  /**
   * Returns location info by coords.
   *
   * @private
   * @param {GeolocationCoordinates} coords
   * @return {*}  {Observable<Object>}
   * @memberof GeolocationService
   */
  private reverseGeocode(coords: GeolocationCoordinates): Observable<Object> {
    const coords2String = JSON.stringify(coords);
    if( this._cache.has(coords2String) ) {
      return of(this.getCachedResponse(coords2String));
    }
    else {
      const queryCoords = 'at=' + coords.latitude + ',' + coords.longitude;
      const queryApiKey = 'apiKey=' + this.env.get().hereApiKey;

      let url = this.env.get().hereApiEndpoint + queryCoords + '&' + queryApiKey;

      return this.http.get<Object>(url).pipe(
        catchError(this.errorHandler<Object>('reverseGeocode', []))
      );
    }
  }

  /**
   *
   *
   * @private
   * @template T
   * @param {string} [operation='operation']
   * @param {T} [result]
   * @return {*} 
   * @memberof GeolocationService
   */
  private errorHandler<T>( operation: string = 'operation', result?:T ): any {
    return (error: any): Observable<T> => {
      console.error(error);
      this.errorHandlerService.add(error);
      return throwError(result as T);
    }
  }

  /**
   * Returns all cached responses
   *
   * @private
   * @param {string} key The stringifyed GeolocationCoordinates
   * @return {*}  {HereAddresses}
   * @memberof GeolocationService
   */
  private getCachedResponse(key: string): HereAddresses {
    return JSON.parse(this._cache.get(key));
  }

  /**
   * Returns the current location informations based on geolocation coordinates
   *
   * @return {*}  {Observable<HereAddresses>}
   * @memberof GeolocationService
   */
  currentAddress$(): Observable<HereAddresses> {
    return new Observable((subscriber) => {
      if (window.navigator && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          (position) => {
            this.reverseGeocode(position.coords).subscribe(
              (data: any) => {
                if( 'items' in data && data?.items?.length > 0 ) {
                  this._cache.set(JSON.stringify(position.coords), JSON.stringify(data));
                  subscriber.next(data?.items[0].address);
                }
                else {
                  console.error(data);
                  subscriber.error('Invalid api response');
                }
              },
              (error) => {
                subscriber.error(error);
              },
              subscriber.complete
            );
          },
          (error) => subscriber.error(error)
        );
      } else {
        subscriber.error('Unsupported Browser');
      }
    });
  }
}
