import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-uber',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './uber.html',
  styleUrl: './uber.scss',
})
export class UberComponent {}
