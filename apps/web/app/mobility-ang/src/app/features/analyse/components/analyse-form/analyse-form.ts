import { Component, output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MobilityInput } from '../../../../models/mobility.model';

interface CriterionStep {
  key: keyof MobilityInput;
  label: string;
  description: string;
  icon: string;
  labels: [string, string, string, string, string];
  rangeHints: [string, string];
}

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

  readonly steps: CriterionStep[] = [
    {
      key: 'budget',
      label: 'Budget',
      description: 'Wie wichtig ist Ihnen ein niedriger Preis?',
      icon: '💰',
      labels: ['Unwichtig', 'Wenig', 'Mittel', 'Wichtig', 'Entscheidend'],
      rangeHints: ['Preis egal', 'Sehr preisbewusst'],
    },
    {
      key: 'comfort',
      label: 'Komfort',
      description: 'Wie wichtig ist Ihnen Bequemlichkeit unterwegs?',
      icon: '🛋️',
      labels: ['Unwichtig', 'Wenig', 'Mittel', 'Wichtig', 'Sehr wichtig'],
      rangeHints: ['Spartanisch', 'Maximaler Komfort'],
    },
    {
      key: 'eco',
      label: 'Nachhaltigkeit',
      description: 'Wie wichtig ist Ihnen Umweltfreundlichkeit?',
      icon: '🌿',
      labels: ['Unwichtig', 'Wenig', 'Mittel', 'Wichtig', 'Sehr wichtig'],
      rangeHints: ['Nebensächlich', 'Höchste Priorität'],
    },
    {
      key: 'distance',
      label: 'Distanz',
      description: 'Wie weit ist Ihr typischer Arbeitsweg?',
      icon: '📍',
      labels: ['Sehr kurz', 'Kurz', 'Mittel', 'Weit', 'Sehr weit'],
      rangeHints: ['< 2 km', '> 30 km'],
    },
    {
      key: 'availability',
      label: 'ÖPNV-Anbindung',
      description: 'Wie gut ist Ihre Anbindung an den öffentlichen Nahverkehr?',
      icon: '🚏',
      labels: ['Sehr schlecht', 'Schlecht', 'Mittel', 'Gut', 'Sehr gut'],
      rangeHints: ['Keine Anbindung', 'Hervorragend'],
    },
    {
      key: 'flexibility',
      label: 'Flexibilität',
      description: 'Wie wichtig ist Ihnen zeitliche Unabhängigkeit?',
      icon: '⏰',
      labels: ['Unwichtig', 'Wenig', 'Mittel', 'Wichtig', 'Sehr wichtig'],
      rangeHints: ['Feste Zeiten ok', 'Volle Flexibilität'],
    },
  ];

  readonly values = [1, 2, 3, 4, 5];
  readonly currentStep = signal(0);

  get step(): CriterionStep {
    return this.steps[this.currentStep()]!;
  }

  get isFirst(): boolean {
    return this.currentStep() === 0;
  }

  get isLast(): boolean {
    return this.currentStep() === this.steps.length - 1;
  }

  get progress(): number {
    return ((this.currentStep() + 1) / this.steps.length) * 100;
  }

  getControl(key: keyof MobilityInput): FormControl<number> {
    return this.form.controls[key];
  }

  selectValue(value: number): void {
    this.getControl(this.step.key).setValue(value);
  }

  next(): void {
    if (!this.isLast) {
      this.currentStep.update(s => s + 1);
    }
  }

  back(): void {
    if (!this.isFirst) {
      this.currentStep.update(s => s - 1);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const raw = this.form.getRawValue();
      this.submitted.emit({
        budget: Number(raw.budget),
        comfort: Number(raw.comfort),
        eco: Number(raw.eco),
        distance: Number(raw.distance),
        availability: Number(raw.availability),
        flexibility: Number(raw.flexibility),
      });
    }
  }
}
