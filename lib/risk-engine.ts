// lib/risk-engine.ts
// Risk Scoring Engine: Calculates risk scores and credit recommendations

import * as Types from "./types";

class RiskScoringEngine {
  private policy: Types.CreditPolicy;
  private businessRules: Types.BusinessRule[];

  constructor(
    policy?: Types.CreditPolicy,
    businessRules?: Types.BusinessRule[]
  ) {
    this.policy = policy || {
      weights: {
        financial: 0.35,
        legal: 0.2,
        market: 0.15,
        stability: 0.1,
        documentQuality: 0.1,
        industryCountry: 0.1,
      },
      thresholds: {
        greenLowerBound: 70,
        amberLowerBound: 30,
        redUpperBound: 29,
      },
      creditLimitFormulas: {
        turnoverPercentage: 5,
        workingCapitalPercentage: 10,
        netWorthPercentage: 15,
        internalMaximum: 50000000,
      },
      paymentTerms: {
        green: "Net 45-90 Days",
        amber: "Net 15-30 Days",
        red: "Advance Payment / Letter of Credit",
      },
      reviewIntervals: {
        green: 365,
        amber: 180,
        red: 30,
      },
    };

    this.businessRules = businessRules || this.getDefaultBusinessRules();
  }

  /**
   * Main scoring function
   */
  calculateRiskScore(assessment: Types.Assessment): {
    riskScore: number;
    recommendation: Types.RecommendationStatus;
    confidence: number;
    dataQuality: number;
    categoryScores: Types.CategoryScores;
    strengths: string[];
    risks: string[];
    missingInformation: string[];
    businessRulesApplied: string[];
    creditLimit: Types.CreditLimitRecommendation;
    paymentTerms: string;
    reviewDate: Date;
  } {
    const categoryScores = this.calculateCategoryScores(assessment);
    const riskScore = this.calculateWeightedScore(categoryScores);
    const confidence = this.calculateConfidence(assessment);
    const dataQuality = this.calculateDataQuality(assessment);

    let recommendation = this.scoreToRecommendation(riskScore);

    const strengths = this.extractStrengths(assessment, categoryScores);
    const risks = this.extractRisks(assessment, categoryScores);
    const missingInformation = assessment.missingInformation || [];

    const businessRulesApplied: string[] = [];
    const ruleResult = this.applyBusinessRules(assessment, recommendation);
    recommendation = ruleResult.recommendation;
    businessRulesApplied.push(...ruleResult.appliedRules);

    const creditLimit = this.calculateCreditLimit(assessment, recommendation);
    const paymentTerms = this.policy.paymentTerms[
      recommendation.toLowerCase() as keyof typeof this.policy.paymentTerms
    ] || this.policy.paymentTerms.amber;

    const reviewDate = this.calculateReviewDate(recommendation);

    return {
      riskScore,
      recommendation,
      confidence,
      dataQuality,
      categoryScores,
      strengths,
      risks,
      missingInformation,
      businessRulesApplied,
      creditLimit,
      paymentTerms,
      reviewDate,
    };
  }

  /**
   * Calculate scores for each risk category
   */
  private calculateCategoryScores(
    assessment: Types.Assessment
  ): Types.CategoryScores {
    return {
      financial: this.scoreFinancialHealth(assessment),
      legal: this.scoreLegalCompliance(assessment),
      market: this.scoreMarketIntelligence(assessment),
      stability: this.scoreBusinessStability(assessment),
      documentQuality: this.scoreDocumentQuality(assessment),
      industryCountry: this.scoreIndustryCountryRisk(assessment),
    };
  }

  /**
   * Financial Health Score (35% weight)
   */
  private scoreFinancialHealth(assessment: Types.Assessment): number {
    const output = assessment.agentOutputs?.["financialIntelligence"] as any;
    if (!output) return 50;

    let score = 0;

    const healthScores: Record<string, number> = {
      STRONG: 90,
      MODERATE: 70,
      WEAK: 40,
      CRITICAL: 10,
    };

    score = healthScores[output.financialHealth] || 50;

    const warnings = output.warnings || [];
    if (warnings.includes("Negative Net Worth")) score -= 20;
    if (warnings.includes("Negative Cash Flow")) score -= 15;
    if (warnings.includes("High Debt")) score -= 10;
    if (warnings.includes("Poor Liquidity")) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Legal & Compliance Score (20% weight)
   */
  private scoreLegalCompliance(assessment: Types.Assessment): number {
    return 85;
  }

  /**
   * Market & Reputation Score (15% weight)
   */
  private scoreMarketIntelligence(assessment: Types.Assessment): number {
    const output = assessment.agentOutputs?.["marketIntelligence"] as any;
    if (!output) return 50;

    let score = 50;

    const sentiment = output.newsSentiment || {};
    const positive = sentiment.positive || 0;
    const negative = sentiment.negative || 0;

    score = 50 + (positive - negative) * 0.5;

    const industryRiskScores: Record<string, number> = {
      LOW: 85,
      MEDIUM: 70,
      HIGH: 40,
    };

    score =
      (score + (industryRiskScores[output.industryRisk] || 70)) / 2;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Business Stability Score (10% weight)
   */
  private scoreBusinessStability(assessment: Types.Assessment): number {
    return 70;
  }

  /**
   * Document Quality Score (10% weight)
   */
  private scoreDocumentQuality(assessment: Types.Assessment): number {
    const output = assessment.agentOutputs?.[
      "documentIntelligence"
    ] as any;

    if (!output && (!assessment.evidence || assessment.evidence.length === 0)) {
      return 20;
    }

    if (!output) {
      const evidenceCount = assessment.evidence?.length || 0;
      return Math.min(100, 30 + evidenceCount * 10);
    }

    let score = 0;

    if (output.isAudited) score += 40;
    else score += 20;

    const freshnessScores: Record<string, number> = {
      CURRENT: 40,
      AGING: 20,
      OUTDATED: 5,
    };
    score += freshnessScores[output.dataFreshness] || 10;

    const metricsCount = Object.keys(output.metrics || {}).length;
    score += Math.min(20, metricsCount * 2);

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Industry & Country Risk Score (10% weight)
   */
  private scoreIndustryCountryRisk(assessment: Types.Assessment): number {
    const output = assessment.agentOutputs?.["marketIntelligence"] as any;
    if (!output) return 50;

    const countryRiskScores: Record<string, number> = {
      LOW: 85,
      MEDIUM: 65,
      HIGH: 35,
    };

    const score = countryRiskScores[output.countryRisk] || 50;
    return score;
  }

  /**
   * Calculate weighted overall risk score
   */
  private calculateWeightedScore(categoryScores: Types.CategoryScores): number {
    const weights = this.policy.weights;

    const weighted =
      categoryScores.financial * weights.financial +
      categoryScores.legal * weights.legal +
      categoryScores.market * weights.market +
      categoryScores.stability * weights.stability +
      categoryScores.documentQuality * weights.documentQuality +
      categoryScores.industryCountry * weights.industryCountry;

    return Math.round(weighted);
  }

  /**
   * Convert score to recommendation
   */
  private scoreToRecommendation(
    score: number
  ): Types.RecommendationStatus {
    const thresholds = this.policy.thresholds;

    if (score >= thresholds.greenLowerBound) return "GREEN";
    if (score >= thresholds.amberLowerBound) return "AMBER";
    return "RED";
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(assessment: Types.Assessment): number {
    const evidence = assessment.evidence || [];
    const agentOutputs = assessment.agentOutputs || {};

    let confidence = 50;

    confidence += Math.min(30, evidence.length * 2);

    const verifiedEvidence = evidence.filter(
      (e) => e.verificationStatus === "VERIFIED"
    ).length;
    confidence += Math.min(20, verifiedEvidence * 2);

    for (const agent of Object.values(agentOutputs)) {
      const agentResp = agent as any;
      if (agentResp.status === "FAILED") confidence -= 15;
      if (agentResp.confidence < 50) confidence -= 5;
    }

    return Math.max(0, Math.min(100, Math.round(confidence)));
  }

  /**
   * Calculate data quality score
   */
  private calculateDataQuality(assessment: Types.Assessment): number {
    let score = 0;

    const expectedMetrics = 15;
    const evidence = assessment.evidence || [];
    const completeness = Math.min(
      40,
      (evidence.length / expectedMetrics) * 40
    );
    score += completeness;

    const recentEvidence = evidence.filter((e) => {
      const daysSince =
        (Date.now() - new Date(e.retrievedAt).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSince < 180;
    }).length;
    score += Math.min(20, (recentEvidence / evidence.length) * 20);

    const verifiedEvidence = evidence.filter(
      (e) => e.verificationStatus === "VERIFIED"
    ).length;
    score += Math.min(
      40,
      (verifiedEvidence / evidence.length) * 40
    );

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Extract strengths
   */
  private extractStrengths(
    assessment: Types.Assessment,
    categoryScores: Types.CategoryScores
  ): string[] {
    const strengths: string[] = [];

    if (categoryScores.financial > 75) {
      strengths.push("Strong financial position");
    }

    if (categoryScores.legal > 80) {
      strengths.push("Good legal compliance");
    }

    if (categoryScores.market > 75) {
      strengths.push("Positive market reputation");
    }

    if (categoryScores.documentQuality > 75) {
      strengths.push("Well-documented financials");
    }

    return strengths;
  }

  /**
   * Extract risks
   */
  private extractRisks(
    assessment: Types.Assessment,
    categoryScores: Types.CategoryScores
  ): string[] {
    const risks: string[] = [];

    if (categoryScores.financial < 60) {
      risks.push("Weak financial position");
    }

    if (categoryScores.legal < 60) {
      risks.push("Legal or compliance concerns");
    }

    if (categoryScores.market < 60) {
      risks.push("Weak market position or negative sentiment");
    }

    if (categoryScores.industryCountry < 50) {
      risks.push("High industry or country risk");
    }

    return risks;
  }

  /**
   * Apply business rules
   */
  private applyBusinessRules(
    assessment: Types.Assessment,
    recommendation: Types.RecommendationStatus
  ): { recommendation: Types.RecommendationStatus; appliedRules: string[] } {
    const applied: string[] = [];
    let finalRecommendation = recommendation;

    for (const rule of this.businessRules) {
      if (!rule.enabled) continue;

      if (this.evaluateRuleCondition(rule.condition, assessment)) {
        applied.push(rule.name);

        if (
          rule.action.type === "FORCE_RECOMMENDATION" &&
          rule.action.targetRecommendation
        ) {
          finalRecommendation = rule.action.targetRecommendation;
        }
      }
    }

    return {
      recommendation: finalRecommendation,
      appliedRules: applied,
    };
  }

  /**
   * Evaluate rule condition
   */
  private evaluateRuleCondition(condition: any, assessment: Types.Assessment): boolean {
    return false;
  }

  /**
   * Calculate credit limit
   */
  private calculateCreditLimit(
    assessment: Types.Assessment,
    recommendation: Types.RecommendationStatus
  ): Types.CreditLimitRecommendation {
    const formulas = this.policy.creditLimitFormulas;

    let revenue = 0;
    const revenueFact = assessment.evidence?.find(
      (e) => e.fact === "Revenue"
    );
    if (revenueFact && typeof revenueFact.value === "number") {
      revenue = revenueFact.value;
    }

    const limits = {
      turnover: (revenue * formulas.turnoverPercentage) / 100,
      internalMax: formulas.internalMaximum,
    };

    const baseLimit = Math.min(limits.turnover, limits.internalMax);

    const adjustments: Record<Types.RecommendationStatus, number> = {
      GREEN: 1.0,
      AMBER: 0.6,
      RED: 0.0,
      REVIEW_REQUIRED: 0.5,
    };

    const adjustedLimit = baseLimit * adjustments[recommendation];

    return {
      amount: Math.round(adjustedLimit),
      currency: "INR",
      basis: `${formulas.turnoverPercentage}% of Annual Revenue`,
      calculationDetails: {
        turnoverBased: limits.turnover,
        internalCap: limits.internalMax,
        adjustmentFactor: adjustments[recommendation],
        adjustmentReason: `${recommendation} rating`,
      },
    };
  }

  /**
   * Calculate review date
   */
  private calculateReviewDate(
    recommendation: Types.RecommendationStatus
  ): Date {
    const intervals = this.policy.reviewIntervals;
    let daysUntilReview = intervals.green;

    switch (recommendation) {
      case "GREEN":
        daysUntilReview = intervals.green;
        break;
      case "AMBER":
        daysUntilReview = intervals.amber;
        break;
      case "RED":
        daysUntilReview = intervals.red;
        break;
      case "REVIEW_REQUIRED":
        daysUntilReview = 30;
        break;
    }

    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + daysUntilReview);
    return reviewDate;
  }

  /**
   * Default business rules
   */
  private getDefaultBusinessRules(): Types.BusinessRule[] {
    return [
      {
        id: "insolvency_rule",
        name: "Active Insolvency Cannot Be Green",
        description:
          "Company under insolvency proceeding cannot receive Green",
        condition: {
          type: "EVIDENCE",
          field: "legal_status",
          operator: "CONTAINS",
          value: "insolvency",
        },
        action: {
          type: "FORCE_RECOMMENDATION",
          targetRecommendation: "RED",
        },
        enabled: true,
        priority: 100,
      },
      {
        id: "sanctions_rule",
        name: "Sanctions Match Triggers Red",
        description: "Company on sanctions list should be Red",
        condition: {
          type: "EVIDENCE",
          field: "sanctions",
          operator: "EQ",
          value: true,
        },
        action: {
          type: "FORCE_RECOMMENDATION",
          targetRecommendation: "RED",
        },
        enabled: true,
        priority: 100,
      },
    ];
  }
}

export default RiskScoringEngine;
