import { Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit{
  ngOnInit(): void {
    this.title.setTitle(`Про Читанку Онлайн`)
    this.meta.updateTag({
      name: "title",
      content: `Про Читанку Онлайн`
    })
    this.meta.updateTag({
      name: "description",
      content: `Про Читанку Онлайн — проєкт, для зручного читанння манґи українською.`
    })
  }
  title = inject(Title)
  meta = inject(Meta)


}
