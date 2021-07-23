import { Overlay } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { CompanyPreviewComponent } from './company-preview.component';

describe('CompanyPreviewComponent', () => {
  let component: CompanyPreviewComponent;
  let fixture: ComponentFixture<CompanyPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyPreviewComponent ],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [MatSnackBar, Overlay]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render component when #company is undefined', () => {
    expect(fixture.debugElement.query(By.css('.company-preview-container'))).toBeNull();
  })
});
