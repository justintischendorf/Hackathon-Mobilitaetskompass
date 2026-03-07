import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fahrrad',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './fahrrad.html',
  styleUrl: './fahrrad.scss',
})
export class FahrradComponent {}
