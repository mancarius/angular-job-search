import { Input } from '@angular/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit {
  @Input() page: number = 1;
  @Input() pageCount: number = 1;
  @Output() goToPage = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  goToNextPage(): void {
    this.goToPage.emit(++this.page);
  }

  goToPrevPage(): void {
    this.goToPage.emit(--this.page);
  }
}
