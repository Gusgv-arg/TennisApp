
export enum StrokeType {
  DRIVE = 'Drive (Forehand)',
  BACKHAND = 'Backhand',
  SERVE = 'Serve',
  VOLLEY = 'Volley',
  SMASH = 'Smash',
  FOOTWORK = 'Court Movement'
}

export interface ScoreDetail {
  label: string;
  score: number;
}

export interface AnalysisResult {
  strokeType: string;
  overallScore: number;
  breakdown: ScoreDetail[];
  summary: string;
  improvementAreas: string[];
  actionableTips: {
    title: string;
    description: string;
  }[];
}

export interface AppState {
  isAnalyzing: boolean;
  result: AnalysisResult | null;
  error: string | null;
  videoPreviewUrl: string | null;
}
