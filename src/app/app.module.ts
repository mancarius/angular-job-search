import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { SearchComponent } from './search/search.component';
import { JobComponent } from './job/job.component';
import { CompanyComponent } from './company/company.component';
import { FiltersComponent } from './filters/filters.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Page404Component } from './page404/page404.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ResultsItemComponent } from './search-results/results-item/results-item.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyPreviewComponent } from './company/company-preview/company-preview.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    SearchComponent,
    JobComponent,
    CompanyComponent,
    FiltersComponent,
    Page404Component,
    SearchResultsComponent,
    PaginatorComponent,
    ResultsItemComponent,
    CompanyPreviewComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    NgbModule,
    MatIconModule,
    MatChipsModule
  ],
  providers: [
    MatSnackBar,
    Overlay,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {duration: 5000}
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
