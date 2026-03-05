import { Component, input } from '@angular/core';
import { MobilityResult } from '../../../../models/mobility.model';

@Component({
  selector: 'app-analyse-result',
  standalone: true,
  templateUrl: './analyse-result.html',
  styleUrl: './analyse-result.scss',
})
export class AnalyseResultComponent {
  readonly result = input.required<MobilityResult>();

  get empfehlungEmoji(): string {
    const map: Record<string, string> = {
      'Auto':     '🚗',
      'Jobrad':   '🚲',
      'ÖPNV':     '🚌',
      'E-Scooter': '🛴',
    };
    return map[this.result().empfehlung] ?? '🚀';
  }
}
