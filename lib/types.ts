// lib/types.ts
// Core TypeScript interfaces and types for ECLIPS

// ============================================
// ASSESSMENT & SCORING TYPES
// ============================================

export type RecommendationStatus = "GREEN" | "AMBER" | "RED" | "REVIEW_REQUIRED";
export type ExecutionMode = "parallel" | "sequential";
export type Reliability = "TIER_1" | "TIER_2" | "TIER_3" | "TIER_4" | "TIER_5" | "TIER_6";
export type VerificationStatus = "VERIFIED" | "UNVERIFIED" | "CONFLICTED";
export type AgentStatusType = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "PARTIAL";

// ============================================
// EVIDENCE & AUDIT
// ============================================

export interface Evidence {
  id: string;
  assessmentId: string;
  fact: string;
  value: any;
  source: string;
  sourceUrl?: string;
  retrievedAt: Date;
  reliability: Reliability;
  confidence: number;
  verificationStatus: VerificationStatus;
  agentOrigin: string;
}

export interface AuditEvent {
  timestamp: Date;
  event: string;
  userId?: string;
  assessmentId?: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  details?: Record<string, any>;
}

// ============================================
// AI AGENT TYPES
// ============================================

export interface AgentResponse {
  status: AgentStatusType;
  agentName: string;
  confidence: number;
  processingTimeMs: number;
  facts: Array<{
    type: string;
    value: any;
    confidence: number;
  }>;
  evidence: Evidence[];
  warnings: string[];
  missingInformation: string[];
  errors: string[];
}

export interface AgentInput {
  assessmentId: string;
  companyId?: string;
  companyName: string;
  website?: string;
  country?: string;
  gstNumber?: string;
  registrationNumber?: string;
  documentContent?: string;
  previousAgentOutputs?: Record<string, AgentResponse>;
}

// ============================================
// COMPANY DATA
// ============================================

export interface Company {
  companyId: string;
  legalName: string;
  tradingName?: string;
  website: string;
  country: string;
  industry: string;
  registrationNumber?: string;
  gstNumber?: string;
  panNumber?: string;
  headquarters?: string;
  companyType?: string;
  founded?: Date;
  employees?: string;
  parentCompany?: string;
  subsidiaries?: string[];
  assessments: Assessment[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// FINANCIAL DATA
// ============================================

export interface FinancialMetrics {
  revenue?: {
    value: number;
    currency: string;
    year: number;
    verified: boolean;
  };
  ebitda?: {
    value: number;
    currency: string;
    year: number;
  };
  netProfit?: {
    value: number;
    currency: string;
    year: number;
  };
  totalAssets?: {
    value: number;
    currency: string;
    year: number;
  };
  totalLiabilities?: {
    value: number;
    currency: string;
    year: number;
  };
  equity?: {
    value: number;
    currency: string;
    year: number;
  };
  cash?: {
    value: number;
    currency: string;
    year: number;
  };
  debt?: {
    value: number;
    currency: string;
    year: number;
  };
}

export interface FinancialRatios {
  currentRatio?: number;
  quickRatio?: number;
  debtToEquity?: number;
  roe?: number;
  roa?: number;
  profitMargin?: number;
  operatingMargin?: number;
  ebitdaMargin?: number;
  workingCapitalRatio?: number;
  interestCoverage?: number;
  cashRatio?: number;
  inventoryTurnover?: number;
  receivableDays?: number;
  payableDays?: number;
  cashConversionCycle?: number;
}

export interface FinancialHealth {
  classification: "STRONG" | "MODERATE" | "WEAK" | "CRITICAL";
  metrics: FinancialMetrics;
  ratios: FinancialRatios;
  trends?: {
    revenueGrowth3Y?: number;
    profitGrowth3Y?: number;
    marginTrend?: "IMPROVING" | "STABLE" | "DECLINING";
  };
  warnings: string[];
  score: number;
}

// ============================================
// ASSESSMENT RESULTS
// ============================================

export interface CategoryScores {
  financial: number;
  legal: number;
  market: number;
  stability: number;
  documentQuality: number;
  industryCountry: number;
}

export interface CreditLimitRecommendation {
  amount: number;
  currency: string;
  basis: string;
  calculationDetails: {
    turnoverBased?: number;
    workingCapitalBased?: number;
    netWorthBased?: number;
    internalCap?: number;
    adjustmentFactor?: number;
    adjustmentReason?: string;
  };
}

export interface Assessment {
  assessmentId: string;
  companyId: string;
  companyName: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  executionMode: ExecutionMode;

  riskScore?: number;
  recommendation?: RecommendationStatus;
  confidence?: number;
  dataQuality?: number;
  categoryScores?: CategoryScores;

  creditLimit?: CreditLimitRecommendation;
  paymentTerms?: string;
  reviewDate?: Date;

  strengths?: string[];
  risks?: string[];
  missingInformation?: string[];

  evidence?: Evidence[];
  businessRulesApplied?: string[];
  auditTrail?: AuditEvent[];
  agentOutputs?: Record<string, AgentResponse>;

  override?: {
    originalRecommendation: RecommendationStatus;
    newRecommendation: RecommendationStatus;
    approver: string;
    reason: string;
    timestamp: Date;
  };
}

// ============================================
// BUSINESS RULES
// ============================================

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  condition: {
    type: string;
    field: string;
    operator: "EQ" | "LT" | "GT" | "LTE" | "GTE" | "CONTAINS" | "NOT_CONTAINS";
    value: any;
  };
  action: {
    type: "OVERRIDE_SCORE" | "FORCE_RECOMMENDATION" | "REDUCE_LIMIT" | "CHANGE_TERMS";
    targetRecommendation?: RecommendationStatus;
    scoreAdjustment?: number;
    limitAdjustment?: number;
  };
  enabled: boolean;
  priority: number;
}

// ============================================
// CONFIGURATION
// ============================================

export interface RiskWeights {
  financial: number;
  legal: number;
  market: number;
  stability: number;
  documentQuality: number;
  industryCountry: number;
}

export interface RatingThresholds {
  greenLowerBound: number;
  amberLowerBound: number;
  redUpperBound: number;
}

export interface CreditPolicy {
  weights: RiskWeights;
  thresholds: RatingThresholds;
  creditLimitFormulas: {
    turnoverPercentage: number;
    workingCapitalPercentage: number;
    netWorthPercentage: number;
    internalMaximum: number;
  };
  paymentTerms: {
    green: string;
    amber: string;
    red: string;
  };
  reviewIntervals: {
    green: number;
    amber: number;
    red: number;
  };
}

// ============================================
// API REQUESTS/RESPONSES
// ============================================

export interface AssessmentRequest {
  companyName: string;
  website?: string;
  country?: string;
  gstNumber?: string;
  registrationNumber?: string;
  documents?: File[];
  executionMode?: ExecutionMode;
}

export interface AssessmentResponse {
  assessmentId: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  progress: number;
  result?: Assessment;
}

export interface DashboardMetrics {
  totalAssessments: number;
  greenCount: number;
  amberCount: number;
  redCount: number;
  reviewRequiredCount: number;
  averageRiskScore: number;
  averageConfidence: number;
  averageDataQuality: number;
  recentAssessments: Assessment[];
  riskDistribution: {
    green: number;
    amber: number;
    red: number;
    reviewRequired: number;
  };
}
