import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsItemComponent } from './results-item.component';
import {mockSearchResults} from '../../shared/mockSearchResults'
import { Router } from '@angular/router';

describe('ResultsItemComponent', () => {
  let component: ResultsItemComponent;
  let fixture: ComponentFixture<ResultsItemComponent>;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsItemComponent ],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsItemComponent);
    component = fixture.componentInstance;
    component.item = mockSearchResults.results[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate with /jobs/1', ()=>{
    component.openJob(1);
    expect (routerSpy.navigate).toHaveBeenCalledWith(['/jobs', 1]);
  });
});
