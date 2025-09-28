
export enum HealthRating {
  Safe = 'Safe',
  Caution = 'Caution',
  Avoid = 'Avoid',
}

export interface FlaggedIngredient {
  name: string;
  description: string;
  rating: HealthRating;
}

export interface AnalysisResult {
  overallRating: HealthRating;
  summary: string;
  flaggedIngredients: FlaggedIngredient[];
  allIngredients: string[];
}
