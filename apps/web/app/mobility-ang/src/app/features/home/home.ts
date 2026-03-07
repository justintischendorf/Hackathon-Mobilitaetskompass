import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../models/mobility.model';
import { CompassComponent } from '../../components/compass/compass';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CompassComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  readonly categories = CATEGORIES;
}
