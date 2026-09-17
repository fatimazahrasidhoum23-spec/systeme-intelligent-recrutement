import { Component } from '@angular/core';
import { Navbar } from "../../Shared/navbar/navbar";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-offre-add',
  imports: [Navbar, RouterLink],
  templateUrl: './offre-add.html',
  styleUrl: './offre-add.css',
})
export class OffreAdd {}
