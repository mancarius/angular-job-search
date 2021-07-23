import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Job } from '../shared/models/theMuse.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
})
export class SearchResultsComponent implements OnInit {
  @Input() items: Job[] = [];
  @Input() isLoading: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {}
}
