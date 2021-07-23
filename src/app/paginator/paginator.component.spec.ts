import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PaginatorComponent } from './paginator.component';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call #goToNextPage on Next button click', fakeAsync(() => {
    spyOn(component, 'goToNextPage').and.stub();

    const button = fixture.debugElement.query(By.css('#goToNextPageBtn'));
    button.triggerEventHandler('click', null);

    tick();

    expect(component.goToNextPage).toHaveBeenCalled();
  }));

  it('should call #goToPrevPage on Previous button click', fakeAsync(() => {
    spyOn(component, 'goToPrevPage').and.stub();

    const button = fixture.debugElement.query(By.css('#goToPrevPageBtn'));
    button.triggerEventHandler('click', null);

    tick();

    expect(component.goToPrevPage).toHaveBeenCalled();
  }));

  it('#goToNextPageBtn should be an html element', () => {
    const button = fixture.debugElement.query(By.css('#goToNextPageBtn')).nativeElement;
    expect(button).toBeTruthy();
  });

  it('#goToPrevPageBtn should be an html element', () => {
    const button = fixture.debugElement.query(By.css('#goToPrevPageBtn')).nativeElement;
    expect(button).toBeTruthy();
  });

  it('#goToNextPage sould emit #page + 1', () => {
    spyOn(component.goToPage, 'emit').and.stub();
    component.page = 1;
    const expectedPage = 2;

    component.goToNextPage();

    expect(component.goToPage.emit).toHaveBeenCalledWith(expectedPage);
  });

  it('#goToPrevPage sould emit #page - 1', () => {
    spyOn(component.goToPage, 'emit').and.stub();
    component.page = 2;
    const expectedPage = 1;

    component.goToPrevPage();

    expect(component.goToPage.emit).toHaveBeenCalledWith(expectedPage);
  });
});
