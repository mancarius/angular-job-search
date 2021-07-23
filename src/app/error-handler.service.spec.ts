import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: { open: () => {}}}
      ]
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#add should add error to #_errorList', () => {
    const fakeTypeError = new TypeError('test');

    service.add(fakeTypeError);

    expect(service['_errorList'].pop()).toBeInstanceOf(TypeError);
  });

  it('#add().and.showMessage should call #openSnackBar with param "test"', () => {
    const fakeError = new Error('test');
    const fakeMessage = 'test';
    spyOn<any>(service,'openSnackBar');

    service.add(fakeError).and.showMessage(fakeMessage);

    expect(service['openSnackBar']).toHaveBeenCalledWith(fakeMessage);
  });

  it('#setMessage should save syntax default message to #_message', () => {
    service['_errorList'].push(new SyntaxError());
    const expectedMessage = service['_defaultMessages'].syntax;

    service['setMessage']();

    expect(service['_message']).toEqual(expectedMessage);
  });
  
  it('#setMessage should save custom message in #_message', () => {
    service['_errorList'].push(new SyntaxError());
    const expectedMessage = 'fake error message';

    service['setMessage'](expectedMessage);

    expect(service['_message']).toEqual(expectedMessage);
  });

  it('#setMessage should return "undefined" if no error in #_errorList', () => {
    const response = service['setMessage']();

    expect(response).not.toBeDefined();
  });

  it('#getLastMessage should return #_message', () => {
    const expectedMessage = 'test message';
    service['_message'] = expectedMessage;
    
    expect(service.getLastMessage()).toEqual(expectedMessage);
  })
});
