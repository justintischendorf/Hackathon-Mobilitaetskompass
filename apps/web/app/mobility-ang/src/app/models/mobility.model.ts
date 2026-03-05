export interface MobilityInput {
  budget: number;
  comfort: number;
  eco: number;
  distance: number;
  availability: number;
  flexibility: number;
}

export interface MobilityResult {
  empfehlung: string;
  erklaerung: string;
}

export interface ApiError {
  error: string;
}
