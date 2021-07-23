import { Overlay } from '@angular/cdk/overlay';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, throwError } from 'rxjs';
import { of } from 'rxjs';
import { mockJob } from '../shared/mockJob';
import { TheMuseAPIService } from '../the-muse-api.service';

import { JobComponent } from './job.component';

describe('JobComponent', () => {
  let component: JobComponent;
  let fixture: ComponentFixture<JobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobComponent],
      imports: [RouterTestingModule, RouterModule.forRoot([])],
      providers: [
        HttpClient,
        HttpHandler,
        MatSnackBar,
        Overlay,
        {
          provide: TheMuseAPIService,
          useValue: {
            job(): Observable<any> {
              return of();
            },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get(): string {
                  return '5781216';
                },
              },
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobComponent);
    component = fixture.componentInstance;
    component.job = mockJob;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "jobs/not-found"', inject(
    [Router],
    fakeAsync((router: Router) => {
      spyOn(component['apiService'], 'job').and.returnValue(
        throwError(new Error('error'))
      );
      spyOn(router, 'navigate').and.stub();

      component.ngOnInit();

      tick();

      expect(router.navigate).toHaveBeenCalledWith(['/jobs', 'not-found']);
    })
  ));
});
