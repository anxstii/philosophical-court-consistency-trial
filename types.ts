
export enum GamePhase {
  LOADING = 'LOADING',
  START = 'START',
  DILEMMA = 'DILEMMA',
  WAITING_FOR_USER = 'WAITING_FOR_USER',
  CROSS_EXAMINATION = 'CROSS_EXAMINATION',
  EVALUATING = 'EVALUATING',
  FINAL_REPORT = 'FINAL_REPORT',
  FAILED = 'FAILED'
}

export interface StoredPrinciple {
  principle_id: string;
  principle_summary: string;
  source_round: number;
}

export interface NotedContradiction {
  round: number;
  conflict_between: string[];
  explanation: string;
}

export interface GameState {
  round: number;
  score: number;
  principles: StoredPrinciple[];
  contradictions: NotedContradiction[];
  history: Message[];
  phase: GamePhase;
}

export interface Message {
  role: 'court' | 'player' | 'system';
  content: string;
}

export interface TrialResult {
  next_step: 'dilemma' | 'cross_examination' | 'final_report';
  content: string;
  score_delta: number;
  new_principle?: StoredPrinciple;
  new_contradiction?: NotedContradiction;
  final_summary?: string;
  consistency_report?: string;
}
