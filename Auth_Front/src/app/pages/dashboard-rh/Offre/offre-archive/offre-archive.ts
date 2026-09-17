import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { OffreResponse } from '../../../../models/offre/offre';
import { OffreSevice } from '../../../../services/offre/offre-service';
import { CurrencyPipe } from '@angular/common';
import { RhSidebar } from "../../Shared/rh-sidebar/rh-sidebar";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-offre-archive',
  imports: [CurrencyPipe, RhSidebar,RouterLink],
  standalone:true,
  templateUrl: './offre-archive.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrl: './offre-archive.css',
})
export class OffreArchive implements OnInit {
    offreListeArchive:OffreResponse[]=[];
  offreService=inject(OffreSevice);

  ngOnInit() {
    this.getAllarchive();
    console.table(this.offreListeArchive);
  }
  getAllarchive(){
    this.offreService.getAllArchive().subscribe({
       next:(res)=>
       {this.offreListeArchive=res ; },
      }
    )
  }
}
