import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

interface ReturnedObject {
  and: {
    showMessage: Function
  }
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  private _message: string | undefined;
  private _defaultMessages = {
    syntax: "I'm sorry but i can't complete this operation because my developer is an ass.",
    type: "Ops, i received an unexpcted parameter and i don't know how to handle it.",
    uri: "Oh, i had some problems while was working on URI.",
    reference: "Ehm, sorry but i received an undefined reference.",
    range: "Some value is out of range.",
    generic: "I'm sorry but something unexpected happened and i can't complete this operation."
  };
  private _errorList: any[] = [];

  constructor(private _snackBar: MatSnackBar) { }

  /**
   * 
   *
   * @private
   * @param {string} [message]
   * @return {*}  {(void | undefined)}
   * @memberof ErrorHandlerService
   */
  private openSnackBar(message: string | undefined): void | undefined {
    message !== undefined && this._snackBar.open(message);
  }

  /**
   *
   *
   * @private
   * @param {string} [message]
   * @return {*}  {(void | undefined)}
   * @memberof ErrorHandlerService
   */
  private setMessage(message?: string): void | undefined {
    let error = this._errorList;

    if(this._errorList === undefined || this._errorList?.length === 0) {
      return undefined;
    } else if (typeof message === 'string' && message.length > 0) {
      this._message = message;
    } else if(error.pop() instanceof SyntaxError) {
      this._message = this._defaultMessages.syntax;
    } else if(error.pop() instanceof TypeError) {
      this._message = this._defaultMessages.type;
    } else if(error.pop() instanceof URIError) {
      this._message = this._defaultMessages.uri;
    } else if(error.pop() instanceof ReferenceError) {
      this._message = this._defaultMessages.reference;
    } else if(error.pop() instanceof RangeError) {
      this._message = this._defaultMessages.range;
    } else {
      this._message = this._defaultMessages.generic;
    }
  }

  /**
   *
   *
   * @param {Error} error
   * @return {*}  {ReturnedObject}
   * @memberof ErrorHandlerService
   */
  add(error: Error): ReturnedObject {

    this._errorList.push(error);

    return {
      and: {
        showMessage: (message: string) => {
          this.setMessage(message);
          return this.openSnackBar.apply(this, [this._message]);
        }
      }
    }
  }

  getLastMessage(): string {
    return this._message || '';
  }
}