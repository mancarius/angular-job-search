import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../company.service';
import { Company } from '../shared/models/theMuse.model';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
})
export class CompanyComponent implements OnInit {
  company: Company | undefined;

  /**
   * Returns locations as a list
   *
   * @memberof CompanyComponent
   */
  locationsList = () => {
    return CompanyService.getLocationsList(this.company?.locations);
  };

  /**
   * Returns industries as a list
   *
   * @memberof CompanyComponent
   */
  industriesList = () => {
    return CompanyService.getIndustriesList(
      this.company?.industries || [{ name: 'Other' }]
    );
  };

  /**
   * Return the company size as a string
   *
   * @memberof CompanyComponent
   */
  companySize = () => {
    return CompanyService.convertSizeForHumans(this.company?.size?.short_name);
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public companyService: CompanyService
  ) {}

  ngOnInit(): void {
    const companyID = Number(this.route.snapshot.paramMap.get('id'));
    
    this.companyService.get(companyID).subscribe(
      (data) => {
        this.company = data;
      },
      (error) => {
        console.warn(error);
        this.router.navigate(['/companies', 'not-found']);
      }
    );
  }
}
