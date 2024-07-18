import { Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrl: './read.component.scss'
})
export class ReadComponent {
  protected route: ActivatedRoute = inject(ActivatedRoute)
  sanitizer = inject(DomSanitizer)
  id = this.route.snapshot.params['id'];
}
