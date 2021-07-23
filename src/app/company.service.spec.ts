import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CompanyService } from './company.service';
import { Industries, Location } from './shared/models/theMuse.model';

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule]
    });
    service = TestBed.inject(CompanyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('"getLocationsList" should return a list of strings', () => {
    const source: Location[] = [
      { name: 'test1' },
      { name: 'test2' }
    ];
    const expected = ['test1', 'test2'];

    const result = CompanyService.getLocationsList(source);

    expect(result).toEqual(expected);
  });

  it('"getIndustriesList" should return a list of strings', () => {
    const source: Industries[] = [
      { name: 'test1' },
      { name: 'test2' }
    ];
    const expected = ['test1', 'test2'];

    const result = CompanyService.getIndustriesList(source);

    expect(result).toEqual(expected);
  });

  it('#convertSizeForHumans should return correct string', () => {
    const expected = ['51-200 employees','201 - 500 employees','10,000+ employees', 'other'];

    const results = [
      CompanyService.convertSizeForHumans('small'),
      CompanyService.convertSizeForHumans('medium'),
      CompanyService.convertSizeForHumans('large'),
      CompanyService.convertSizeForHumans('undefined')
    ];

    results.forEach((value, index) => expect(value).toEqual(expected[index]));
  })
});
