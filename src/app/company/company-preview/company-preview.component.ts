import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyService } from 'src/app/company.service';
import { Company } from 'src/app/shared/models/theMuse.model';
import { ErrorHandlerService } from 'src/app/error-handler.service';

@Component({
  selector: 'app-company-preview',
  templateUrl: './company-preview.component.html',
  styleUrls: ['./company-preview.component.css']
})
export class CompanyPreviewComponent implements OnInit {

  @Input() companyId: number | undefined;
  company: Company | undefined;
  locationsList = () => {
    return CompanyService.getLocationsList(this.company?.locations);
  };
  industriesList = () => {
    return CompanyService.getIndustriesList(this.company?.industries || [{name:'Other'}]);
  };
  companySize = () => {
    return CompanyService.convertSizeForHumans(this.company?.size?.short_name);
  }

  constructor(private router: Router, public companyService: CompanyService, private errorHandler: ErrorHandlerService) {
  }

  ngOnChanges(): void{
    if( typeof this.companyId === 'number' ) {
      this.companyService.get(this.companyId).subscribe(data =>{
        if( typeof data === 'object') {
          this.company = data;
        }
      },
      error => {
        console.warn(error);
        this.errorHandler.add(error).and.showMessage("Can't load company informations");
      });
    }
  }

  ngOnInit(): void {}

}