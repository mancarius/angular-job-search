import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/shared/models/theMuse.model';
import { TheMuseAPIService } from 'src/app/the-muse-api.service';

@Component({
  selector: 'app-results-item',
  templateUrl: './results-item.component.html',
  styleUrls: ['./results-item.component.css'],
})
export class ResultsItemComponent implements OnInit {
  @Input() item!: Job;
  locations: string[] = [];

  constructor(private router: Router) {}

  ngOnChanges(): void {
    this.locations = this.item.locations.map((location) => location?.name !== "Flexible / Remote" ? location.name : 'Remote')
  }

  ngOnInit(): void { }

  openJob(id: number): void {
    this.router.navigate(['/jobs', id]);
  }
}
