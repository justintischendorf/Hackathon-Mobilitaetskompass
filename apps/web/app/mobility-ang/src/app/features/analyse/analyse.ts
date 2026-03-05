import { Component, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MobilityInput, MobilityResult } from '../../models/mobility.model';
import { MobilityService } from '../../services/mobility.service';
import { AnalyseFormComponent } from './components/analyse-form/analyse-form';
import { AnalyseResultComponent } from './components/analyse-result/analyse-result';

@Component({
  selector: 'app-analyse',
  standalone: true,
  imports: [AnalyseFormComponent, AnalyseResultComponent],
  templateUrl: './analyse.html',
  styleUrl: './analyse.scss',
})
export class AnalyseComponent {
  private readonly mobilityService = inject(MobilityService);
  private readonly doc = inject(DOCUMENT);

  readonly result = signal<MobilityResult | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly darkMode = signal(false);

  toggleDarkMode(): void {
    this.darkMode.update((v) => !v);
    this.doc.documentElement.setAttribute('data-theme', this.darkMode() ? 'dark' : '');
  }

  onFormSubmitted(input: MobilityInput): void {
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.mobilityService.analyse(input).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
