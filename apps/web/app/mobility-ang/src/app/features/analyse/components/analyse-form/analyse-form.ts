import { Component, output, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { MobilityInput } from '../../../../models/mobility.model';

interface CriterionStep {
  key: keyof MobilityInput;
  label: string;
  description: string;
  icon: string;
  labels: [string, string, string, string, string];
  rangeHints: [string, string];
  type: 'rating' | 'boolean' | 'address';
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
  private readonly http = inject(HttpClient);

  readonly form = this.fb.nonNullable.group({
    budget: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    comfort: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    eco: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    distance: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    availability: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    flexibility: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  readonly fuehrerschein = signal(false);
  readonly addressInput = signal('');
  readonly addressLoading = signal(false);
  readonly addressResult = signal<string | null>(null);
  readonly addressSuggestions = signal<Array<{ display_name: string; lat: string; lon: string }>>([]);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly steps: CriterionStep[] = [
    {
      key: 'budget',
      label: 'Budget',
      description: 'Wie wichtig ist Ihnen ein niedriger Preis?',
      icon: '💰',
      labels: ['Unwichtig', 'Wenig', 'Mittel', 'Wichtig', 'Entscheidend'],
      rangeHints: ['Geringe Priorität', 'Hohe Kostenpriorisierung'],
      type: 'rating',
    },
    {
      key: 'comfort',
      label: 'Komfort',
      description: 'Wie wichtig ist Ihnen Bequemlichkeit unterwegs?',
      icon: '🛋️',
      labels: ['Unwichtig', 'Wenig', 'Mittel', 'Wichtig', 'Sehr wichtig'],
      rangeHints: ['Spartanisch', 'Maximaler Komfort'],
      type: 'rating',
    },
    {
      key: 'eco',
      label: 'Nachhaltigkeit',
      description: 'Wie wichtig ist Ihnen Umweltfreundlichkeit?',
      icon: '🌿',
      labels: ['Unwichtig', 'Wenig', 'Mittel', 'Wichtig', 'Sehr wichtig'],
      rangeHints: ['Nebensächlich', 'Höchste Priorität'],
      type: 'rating',
    },
    {
      key: 'distance',
      label: 'Distanz',
      description: 'Wie weit ist Ihr typischer Arbeitsweg?',
      icon: '📍',
      labels: ['Sehr kurz', 'Kurz', 'Mittel', 'Weit', 'Sehr weit'],
      rangeHints: ['< 2 km', '> 150 km'],
      type: 'rating',
    },
    {
      key: 'availability',
      label: 'Wohnort',
      description: 'Geben Sie Ihre Adresse ein, um die ÖPNV-Anbindung automatisch zu ermitteln.',
      icon: '🏠',
      labels: ['Sehr schlecht', 'Schlecht', 'Mittel', 'Gut', 'Sehr gut'],
      rangeHints: ['Keine Anbindung', 'Hervorragend'],
      type: 'address',
    },
    {
      key: 'flexibility',
      label: 'Flexibilität',
      description: 'Wie wichtig ist Ihnen zeitliche Unabhängigkeit?',
      icon: '⏰',
      labels: ['Unwichtig', 'Wenig', 'Mittel', 'Wichtig', 'Sehr wichtig'],
      rangeHints: ['Planbare Abfahrtszeiten', 'Maximale zeitliche Unabhängigkeit'],
      type: 'rating',
    },
    {
      key: 'fuehrerschein',
      label: 'Führerschein',
      description: 'Besitzen Sie einen gültigen Führerschein?',
      icon: '🪪',
      labels: ['Unwichtig', 'Wenig', 'Mittel', 'Wichtig', 'Sehr wichtig'],
      rangeHints: ['', ''],
      type: 'boolean',
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
    return this.form.controls[key as keyof typeof this.form.controls];
  }

  selectValue(value: number): void {
    if (this.step.type === 'rating' || this.step.type === 'address') {
      this.getControl(this.step.key).setValue(value);
    }
  }

  setFuehrerschein(value: boolean): void {
    this.fuehrerschein.set(value);
  }

  onAddressInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addressInput.set(input.value);
    this.fetchSuggestions(input.value);
  }

  private fetchSuggestions(query: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    if (query.trim().length < 3) {
      this.addressSuggestions.set([]);
      return;
    }
    this.debounceTimer = setTimeout(() => {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5&countrycodes=de`;
      this.http.get<Array<{ display_name: string; lat: string; lon: string }>>(url).subscribe({
        next: (results) => this.addressSuggestions.set(results),
        error: () => this.addressSuggestions.set([]),
      });
    }, 300);
  }

  selectSuggestion(suggestion: { display_name: string; lat: string; lon: string }): void {
    this.addressInput.set(suggestion.display_name);
    this.addressSuggestions.set([]);
    this.addressLoading.set(true);
    this.addressResult.set(null);
    this.checkTransitStops(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
  }

  lookupAddress(): void {
    const address = this.addressInput();
    if (!address.trim()) return;

    this.addressLoading.set(true);
    this.addressResult.set(null);

    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

    this.http.get<Array<{ lat: string; lon: string }>>(nominatimUrl).subscribe({
      next: (results) => {
        if (results.length === 0) {
          this.addressResult.set('Adresse nicht gefunden. Bitte überprüfen Sie Ihre Eingabe.');
          this.addressLoading.set(false);
          return;
        }

        const { lat, lon } = results[0]!;
        this.checkTransitStops(parseFloat(lat), parseFloat(lon));
      },
      error: () => {
        this.addressResult.set('Fehler bei der Adresssuche. Bitte versuchen Sie es erneut.');
        this.addressLoading.set(false);
      },
    });
  }

  private checkTransitStops(lat: number, lon: number): void {
    const radius = 1000;
    const overpassQuery = `[out:json][timeout:10];(node["highway"="bus_stop"](around:${radius},${lat},${lon});node["railway"="station"](around:${radius},${lat},${lon});node["railway"="halt"](around:${radius},${lat},${lon});node["railway"="tram_stop"](around:${radius},${lat},${lon});node["amenity"="bus_station"](around:${radius},${lat},${lon}););out body;`;

    const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

    this.http.get<{ elements: Array<Record<string, unknown>> }>(overpassUrl).subscribe({
      next: (data) => {
        const count = data.elements?.length ?? 0;

        let score: number;
        let label: string;

        if (count >= 10) {
          score = 5;
          label = 'Hervorragend';
        } else if (count >= 6) {
          score = 4;
          label = 'Gut';
        } else if (count >= 3) {
          score = 3;
          label = 'Mittel';
        } else if (count >= 1) {
          score = 2;
          label = 'Schlecht';
        } else {
          score = 1;
          label = 'Sehr schlecht';
        }

        this.getControl('availability').setValue(score);
        this.addressResult.set(`ÖPNV-Anbindung: ${label} (${count} Haltestellen im Umkreis von 1 km)`);
        this.addressLoading.set(false);
      },
      error: () => {
        this.addressResult.set('ÖPNV-Prüfung fehlgeschlagen. Sie können den Wert manuell setzen.');
        this.addressLoading.set(false);
      },
    });
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
        fuehrerschein: this.fuehrerschein(),
      });
    }
  }
}
