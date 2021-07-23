import { Overlay } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, inject, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterParams } from '../shared/models/FilterParams.model';

import { FiltersComponent } from './filters.component';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  const initialFilters: FilterParams = {
    locations: ['Rome, Italy'],
    levels: ['Mid Level'],
    page: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule, RouterTestingModule],
      providers: [MatSnackBar, Overlay],
      declarations: [FiltersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    component.inputFilters = initialFilters;
    component.setFiltersFormGroup(initialFilters);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#filtersForm should have location attribute', () => {
    expect(component.filtersForm.value.location).toBeTruthy();
  });

  it('#removeLocationIfExist should return true and remove "Rome, Italy" from location field', () => {
    const sourceData = 'Rome, Italy';

    const result = component['removeLocationFromFormIfExist'](sourceData);
    let textFieldValue = fixture.debugElement.query(By.css('#location-filter'))
      .nativeElement.value;

    expect(result).toBeTruthy();
    expect(textFieldValue).not.toContain(sourceData);
  });

  it('#removeLevelIfExist should return true and turn off the Mid Level checkbox', () => {
    const sourceData = 'Mid Level';

    const result = component['removeLevelFromFormIfExist'](sourceData);
    let checkboxValue = fixture.debugElement.query(By.css('#mid-level-filter'))
      .nativeElement.checked;

    expect(result).toBeTruthy();
    expect(checkboxValue).toBeFalsy();
  });

  it('#submit should update query params with current filters', inject([Router, ActivatedRoute], (router: Router, route: ActivatedRoute) => {
    const expectedNavigationParams = {
      relativeTo: route,
      queryParams: {
        location: initialFilters.locations,
        level: initialFilters.levels,
        page: initialFilters.page
      }
    };
    spyOn(router, 'navigate').and.stub();

    component.submit();

    expect(router.navigate).toHaveBeenCalledWith([], expectedNavigationParams);
  }));

  it('#createFilterList should converts filters in a list of string for the chips', () => {
    const expectedLocation = component.inputFilters.locations.join(',');
    const expectedLevel = component.inputFilters.levels.join(',');

    component.createFiltersList();
    const filtersList2String = component.filtersList.join(',');

    expect(filtersList2String).toContain(expectedLocation);
    expect(filtersList2String).toContain(expectedLevel);
  })

  it('#submit and #closeModal should be called on form submit', fakeAsync(() => {
    spyOn(component, 'submit').and.stub();
    spyOn(component, 'closeModal').and.stub();

    const formEl = fixture.debugElement.query(By.css('.filter-form'));
    formEl.triggerEventHandler('ngSubmit', null);

    tick();

    expect(component.submit).toHaveBeenCalled();
    expect(component.closeModal).toHaveBeenCalled();
  }));

  it('#openModal should remove css class "hidden" to element .form-container', () => {
    component.closeModal();
    
    fixture.detectChanges();
    
    component.openModal();
    
    fixture.detectChanges();

    const formContainerEl = fixture.debugElement.query(By.css('.form-container')).nativeElement;

    expect(formContainerEl).not.toHaveClass('hidden');
  });

  it('#closeModal should add css class "hidden" to element .form-container', () => {
    component.closeModal();
    
    fixture.detectChanges();

    const formContainerEl = fixture.debugElement.query(By.css('.form-container')).nativeElement;

    expect(formContainerEl).toHaveClass('hidden');
  });
});
