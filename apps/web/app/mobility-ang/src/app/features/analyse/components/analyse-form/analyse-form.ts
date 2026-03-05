import { Component, output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MobilityInput } from '../../../../models/mobility.model';

interface Step {
  key: keyof MobilityInput;
  label: string;
  description: string;
  progressEmoji: string;
  valueEmojis: [string, string, string, string, string];
  rangeLabels: [string, string];
  color: string;
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

  readonly steps: Step[] = [
    {
      key: 'budget',
      label: 'Budget',
      description: 'Wie wichtig ist dir ein niedriger Preis?',
      progressEmoji: '💰',
      valueEmojis: ['🤷', '💳', '💰', '💸', '🤑'],
      rangeLabels: ['Egal', 'Entscheidend'],
      color: '#f59e0b',
    },
    {
      key: 'comfort',
      label: 'Komfort',
      description: 'Wie wichtig ist dir Bequemlichkeit?',
      progressEmoji: '🛋️',
      valueEmojis: ['🪨', '🪑', '😊', '🌟', '👑'],
      rangeLabels: ['Egal', 'Sehr wichtig'],
      color: '#ec4899',
    },
    {
      key: 'eco',
      label: 'Nachhaltigkeit',
      description: 'Wie wichtig ist dir Umweltfreundlichkeit?',
      progressEmoji: '🌿',
      valueEmojis: ['🏭', '🌫️', '🌱', '🌿', '🌳'],
      rangeLabels: ['Egal', 'Sehr wichtig'],
      color: '#10b981',
    },
    {
      key: 'distance',
      label: 'Distanz',
      description: 'Wie weit ist dein typischer Weg?',
      progressEmoji: '📍',
      valueEmojis: ['🏠', '🚶', '🚲', '🚗', '✈️'],
      rangeLabels: ['Sehr kurz', 'Sehr weit'],
      color: '#0080C8',
    },
    {
      key: 'availability',
      label: 'Anbindung',
      description: 'Wie gut ist deine ÖPNV-Anbindung?',
      progressEmoji: '🚌',
      valueEmojis: ['🏜️', '🛤️', '🚏', '🚌', '🚆'],
      rangeLabels: ['Sehr schlecht', 'Sehr gut'],
      color: '#8b5cf6',
    },
    {
      key: 'flexibility',
      label: 'Flexibilität',
      description: 'Wie wichtig ist dir zeitliche Flexibilität?',
      progressEmoji: '⏰',
      valueEmojis: ['📅', '🕐', '⚡', '🗓️', '🦋'],
      rangeLabels: ['Egal', 'Sehr wichtig'],
      color: '#f97316',
    },
  ];

  readonly ratingValues = [1, 2, 3, 4, 5];
  readonly currentStep = signal(0);

  get currentSlider(): Step {
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
