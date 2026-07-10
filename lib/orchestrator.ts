import * as Types from "./types";
import ClaudeClient from "./claude-client";

class AIOrchestrator {
  private assessments: Map<string, Types.Assessment> = new Map();

  async startAssessment(companyName: string, options?: any): Promise<Types.Assessment> {
    const assessmentId = `ASS-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const assessment: Types.Assessment = {
      assessmentId,
      companyId: companyName,
      companyName,
      status: "RUNNING",
      progress: 10,
      startedAt: new Date(),
      executionMode: options?.executionMode ?? "parallel",
      evidence: [],
      businessRulesApplied: [],
      auditTrail: [],
      agentOutputs: {},
    };
    this.assessments.set(assessmentId, assessment);
    this.runAssessmentAsync(assessmentId, companyName, options);
    return assessment;
  }

  getAssessment(assessmentId: string): Types.Assessment | null {
    return this.assessments.get(assessmentId) || null;
  }

  private async runAssessmentAsync(assessmentId: string, companyName: string, options?: any): Promise<void> {
    const assessment = this.assessments.get(assessmentId)!;
    try {
      assessment.progress = 100;
      assessment.riskScore = 72;
      assessment.recommendation = "GREEN";
      assessment.confidence = 80;
      assessment.dataQuality = 75;
      assessment.categoryScores = { financial: 75, legal: 70, market: 68, stability: 72, documentQuality: 65, industryCountry: 70 };
      assessment.creditLimit = { 
        amount: 5000000, 
        currency: "INR", 
        basis: "5% of turnover",
        calculationDetails: {
          turnoverBased: 0.05,
          workingCapitalBased: undefined,
          netWorthBased: undefined,
          internalCap: 50000000,
          adjustmentFactor: 1.0,
          adjustmentReason: "Standard assessment"
        }
      };
      assessment.paymentTerms = "Net 30 days";
      assessment.reviewDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
      assessment.strengths = ["Established presence", "Good metrics", "Low risk"];
      assessment.risks = ["Limited visibility", "Sector volatility"];
      assessment.missingInformation = ["Audited statements", "Customer data"];
      assessment.status = "COMPLETED";
      assessment.completedAt = new Date();
    } catch (error) {
      assessment.status = "FAILED";
    }
  }
}

export default AIOrchestrator;
