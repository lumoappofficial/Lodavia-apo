export type JuryMemberId = 
  | 'business' 
  | 'financial' 
  | 'market' 
  | 'marketing' 
  | 'customer' 
  | 'growth' 
  | 'risk';

export interface ProjectJuryInput {
  projectName: string;
  projectType: string;
  location?: string;
  description: string;
  expectedBudget?: string;
  monthlyExpenses?: string;
  expectedRevenue?: string;
  targetAudience?: string;
  competitors?: string;
  additionalInfo?: string;
}

export interface JuryMemberEvaluation {
  id: JuryMemberId;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  icon: string;
  score: number; // 0.0 - 10.0
  strengths: string[];
  weaknesses: string[];
  keyOpportunity: string;
  biggestRisk: string;
  recommendation: string;
}

export interface JuryBreakdownScores {
  financial: number; // 0 - 10
  market: number;    // 0 - 10
  marketing: number; // 0 - 10
  customer: number;  // 0 - 10
  growth: number;    // 0 - 10
  riskLevel: 'منخفض' | 'متوسط' | 'مرتفع' | 'Low' | 'Medium' | 'High';
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface FinancialEstimates {
  estimatedRevenue: string;
  estimatedCosts: string;
  estimatedProfit: string;
  breakEvenMonths: string;
  notesAr: string;
  notesEn: string;
}

export interface WhatIfScenario {
  titleAr: string;
  titleEn: string;
  projectionAr: string;
  projectionEn: string;
  keyDriverAr: string;
  keyDriverEn: string;
}

export interface WhatIfScenarios {
  optimistic: WhatIfScenario;
  realistic: WhatIfScenario;
  conservative: WhatIfScenario;
}

export interface RecommendedToolAction {
  toolId: string;
  titleAr: string;
  titleEn: string;
  reasonAr: string;
  reasonEn: string;
  iconName: string;
}

export interface ProjectJuryResult {
  id: string;
  input: ProjectJuryInput;
  timestamp: string;
  overallScore: number; // e.g. 8.4
  verdictAr: string;
  verdictEn: string;
  verdictStatus: 'promising' | 'good' | 'caution' | 'needs_pivot';
  breakdown: JuryBreakdownScores;
  members: JuryMemberEvaluation[];
  swot: SWOTAnalysis;
  financialEstimates: FinancialEstimates;
  summaryAr: string;
  summaryEn: string;
  nextStepAr: string;
  nextStepEn: string;
  whatIf: WhatIfScenarios;
  recommendedTools: RecommendedToolAction[];
  previousScore?: number;
  evaluationCount: number;
}

export interface JuryAnswerResponse {
  targetMember: JuryMemberId | 'all';
  question: string;
  perspectives?: Array<{
    memberId: JuryMemberId;
    memberNameAr: string;
    memberNameEn: string;
    answerAr: string;
    answerEn: string;
    icon: string;
  }>;
  finalVerdictAr?: string;
  finalVerdictEn?: string;
  singleAnswerAr?: string;
  singleAnswerEn?: string;
}
