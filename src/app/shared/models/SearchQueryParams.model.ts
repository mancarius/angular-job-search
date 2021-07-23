import { Params } from "@angular/router";

export interface SearchQueryParams extends Params {
    location?: string[];
    level?: string[];
    page: number;
}