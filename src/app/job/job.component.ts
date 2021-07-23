import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService } from '../error-handler.service';
import { Job } from '../shared/models/theMuse.model';
import { TheMuseAPIService } from '../the-muse-api.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements OnInit {
  job: Job | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: TheMuseAPIService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    const jobID = Number(this.route.snapshot.paramMap.get('id'));
    
    this.apiService.job(jobID).subscribe(
      (data) => {
        this.job = data;
      },
      (error) => {
        console.warn(error);
        this.errorHandler.add(error);
        this.router.navigate(['/jobs', 'not-found']);
      }
    );
  }
}
