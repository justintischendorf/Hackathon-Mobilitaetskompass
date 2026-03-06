import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MobilityResult, CATEGORIES } from '../../../../models/mobility.model';

@Component({
  selector: 'app-analyse-result',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './analyse-result.html',
  styleUrl: './analyse-result.scss',
})
export class AnalyseResultComponent {
  readonly result = input.required<MobilityResult>();
  readonly reset = output<void>();

  get categoryRoute(): string {
    const cat = CATEGORIES.find(c => c.name === this.result().empfehlung);
    return cat?.route ?? '/home';
  }

  onReset(): void {
    this.reset.emit();
  }
}
