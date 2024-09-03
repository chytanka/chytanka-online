import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogService } from '../../../catalog/data-access/catalog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent {
  catalog = inject(CatalogService)
  router = inject(Router)

  onSubmit(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl(`/?q=${this.catalog.query()}&apge=1`)
  }

  changeQuery(q: string) {    
    this.catalog.query.set(q)
  }
}
