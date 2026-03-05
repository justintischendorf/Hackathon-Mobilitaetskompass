import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auto.html',
  styleUrl: './auto.scss',
})
export class AutoComponent {}
