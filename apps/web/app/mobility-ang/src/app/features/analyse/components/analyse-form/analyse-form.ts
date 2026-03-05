import { Component, output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MobilityInput } from '../../../../models/mobility.model';

@Component({
  selector: 'app-analyse-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './analyse-form.html',
  styleUrl: './analyse-form.scss',
})
export class AnalyseFormComponent {
  readonly submitted = output<MobilityInput>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    budget: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    comfort: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    eco: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    distance: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    availability: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    flexibility: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  readonly steps: { key: keyof MobilityInput; label: string; description: string }[] = [
    { key: 'budget', label: 'Budget', description: 'Wie wichtig ist dir ein niedriger Preis?' },
    { key: 'comfort', label: 'Komfort', description: 'Wie wichtig ist dir Bequemlichkeit?' },
    { key: 'eco', label: 'Nachhaltigkeit', description: 'Wie wichtig ist dir Umweltfreundlichkeit?' },
    { key: 'distance', label: 'Distanz', description: 'Wie weit ist dein typischer Weg?' },
    { key: 'availability', label: 'Anbindung', description: 'Wie gut ist deine ÖPNV-Anbindung?' },
    { key: 'flexibility', label: 'Flexibilität', description: 'Wie wichtig ist dir zeitliche Flexibilität?' },
  ];

  readonly currentStep = signal(0);

  get currentSlider() {
    return this.steps[this.currentStep()]!;
  }

  get isLastStep(): boolean {
    return this.currentStep() === this.steps.length - 1;
  }

  getControl(key: keyof MobilityInput): FormControl<number> {
    return this.form.controls[key];
  }

  next(): void {
    if (!this.isLastStep) {
      this.currentStep.update((s) => s + 1);
    }
  }

  back(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((s) => s - 1);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      const parsed: MobilityInput = {
        budget: Number(raw.budget),
        comfort: Number(raw.comfort),
        eco: Number(raw.eco),
        distance: Number(raw.distance),
        availability: Number(raw.availability),
        flexibility: Number(raw.flexibility),
      };
      this.submitted.emit(parsed);
    }
  }
}
