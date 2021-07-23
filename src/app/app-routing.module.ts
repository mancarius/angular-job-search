import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { JobComponent } from './job/job.component';
import { Page404Component } from './page404/page404.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'jobs',
    children: [
      {
        path: 'not-found',
        component: Page404Component,
      },
      {
        path: ':id',
        component: JobComponent,
      },
      {
        path: '**',
        redirectTo: 'jobs/not-found',
      },
    ],
  },
  {
    path: 'companies',
    children: [
      { path: 'not-found', component: Page404Component },
      { path: ':id', component: CompanyComponent },
      { path: '**', redirectTo: 'company/not-found' },
    ],
  },
  {
    path: '**',
    component: Page404Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
