// lib/utils.ts
// Utility functions for ECLIPS

import * as Types from "./types";

// In-memory storage (for local development)
// In production, this would be replaced with Firestore
const assessmentStore = new Map<string, Types.Assessment>();
const companyStore = new Map<string, Types.Company>();

/**
 * Company Store Functions
 */
export function saveCompany(company: Types.Company): void {
  company.updatedAt = new Date();
  companyStore.set(company.companyId, company);
  console.log(
    `[STORE] Company saved: ${company.companyId}`
  );
}

export function getCompany(companyId: string): Types.Company | null {
  return companyStore.get(companyId) || null;
}

export function getAllCompanies(): Types.Company[] {
  return Array.from(companyStore.values());
}

/**
 * Assessment Store Functions
 */
export function saveAssessment(assessment: Types.Assessment): void {
  assessment.updatedAt = new Date();
  assessmentStore.set(assessment.assessmentId, assessment);
  console.log(
    `[STORE] Assessment saved: ${assessment.assessmentId}`
  );
}

export function getAssessment(assessmentId: string): Types.Assessment | null {
  return assessmentStore.get(assessmentId) || null;
}

export function getAllAssessments(): Types.Assessment[] {
  return Array.from(assessmentStore.values()).sort(
    (a, b) =>
      new Date(b.startedAt).getTime() -
      new Date(a.startedAt).getTime()
  );
}

export function getCompanyAssessments(
  companyId: string
): Types.Assessment[] {
  return Array.from(assessmentStore.values()).filter(
    (a) => a.companyId === companyId
  );
}

/**
 * Format functions
 */
export function formatCurrency(
  amount: number,
  currency: string = "INR"
): string {
  if (currency === "INR") {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
  return `${amount.toLocaleString("en-US")} ${currency}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(
  date: Date | string
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Risk color/badge functions
 */
export function getRiskColor(
  recommendation: Types.RecommendationStatus
): string {
  switch (recommendation) {
    case "GREEN":
      return "#10b981";
    case "AMBER":
      return "#f59e0b";
    case "RED":
      return "#ef4444";
    case "REVIEW_REQUIRED":
      return "#6b7280";
    default:
      return "#9ca3af";
  }
}

export function getRiskLabel(
  recommendation: Types.RecommendationStatus
): string {
  switch (recommendation) {
    case "GREEN":
      return "Approve";
    case "AMBER":
      return "Review";
    case "RED":
      return "Decline";
    case "REVIEW_REQUIRED":
      return "Review Required";
    default:
      return "Unknown";
  }
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "#10b981";
  if (score >= 30) return "#f59e0b";
  return "#ef4444";
}

/**
 * Assessment status functions
 */
export function isAssessmentComplete(
  assessment: Types.Assessment
): boolean {
  return assessment.status === "COMPLETED";
}

export function isAssessmentFailed(
  assessment: Types.Assessment
): boolean {
  return assessment.status === "FAILED";
}

export function isAssessmentRunning(
  assessment: Types.Assessment
): boolean {
  return assessment.status === "RUNNING";
}

/**
 * Calculation functions
 */
export function calculateDaysUntilReview(reviewDate: Date): number {
  const today = new Date();
  const diff = new Date(reviewDate).getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculateAssessmentDuration(
  assessment: Types.Assessment
): number {
  if (!assessment.completedAt) {
    return Date.now() - new Date(assessment.startedAt).getTime();
  }
  return (
    new Date(assessment.completedAt).getTime() -
    new Date(assessment.startedAt).getTime()
  );
}

export function calculateAverageScore(
  assessments: Types.Assessment[]
): number {
  const completed = assessments.filter(
    (a) => a.riskScore !== undefined
  );
  if (completed.length === 0) return 0;

  const sum = completed.reduce((acc, a) => acc + (a.riskScore || 0), 0);
  return Math.round(sum / completed.length);
}

/**
 * Summary statistics
 */
export function getDashboardMetrics(
  assessments: Types.Assessment[]
): Types.DashboardMetrics {
  const completed = assessments.filter((a) => a.status === "COMPLETED");

  const greenCount = completed.filter(
    (a) => a.recommendation === "GREEN"
  ).length;
  const amberCount = completed.filter(
    (a) => a.recommendation === "AMBER"
  ).length;
  const redCount = completed.filter(
    (a) => a.recommendation === "RED"
  ).length;
  const reviewRequiredCount = completed.filter(
    (a) => a.recommendation === "REVIEW_REQUIRED"
  ).length;

  const riskScores = completed
    .filter((a) => a.riskScore !== undefined)
    .map((a) => a.riskScore || 0);
  const confidences = completed
    .filter((a) => a.confidence !== undefined)
    .map((a) => a.confidence || 0);
  const dataQualities = completed
    .filter((a) => a.dataQuality !== undefined)
    .map((a) => a.dataQuality || 0);

  const averageRiskScore =
    riskScores.length > 0
      ? Math.round(
          riskScores.reduce((a, b) => a + b, 0) /
            riskScores.length
        )
      : 0;

  const averageConfidence =
    confidences.length > 0
      ? Math.round(
          confidences.reduce((a, b) => a + b, 0) /
            confidences.length
        )
      : 0;

  const averageDataQuality =
    dataQualities.length > 0
      ? Math.round(
          dataQualities.reduce((a, b) => a + b, 0) /
            dataQualities.length
        )
      : 0;

  const total = completed.length;
  const greenPct = total > 0 ? (greenCount / total) * 100 : 0;
  const amberPct = total > 0 ? (amberCount / total) * 100 : 0;
  const redPct = total > 0 ? (redCount / total) * 100 : 0;
  const reviewPct =
    total > 0 ? (reviewRequiredCount / total) * 100 : 0;

  return {
    totalAssessments: assessments.length,
    greenCount,
    amberCount,
    redCount,
    reviewRequiredCount,
    averageRiskScore,
    averageConfidence,
    averageDataQuality,
    recentAssessments: assessments.slice(0, 5),
    riskDistribution: {
      green: Math.round(greenPct),
      amber: Math.round(amberPct),
      red: Math.round(redPct),
      reviewRequired: Math.round(reviewPct),
    },
  };
}

/**
 * Validation functions
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Export/Download functions
 */
export function downloadJSON(data: any, filename: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(data: any[], filename: string): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return "";
          if (typeof value === "string" && value.includes(",")) {
            return `"${value}"`;
          }
          return value;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Sample data generators
 */
export function generateSampleCompanies(): Types.Company[] {
  return [
    {
      companyId: "elcon-1",
      legalName: "Elcon Engineers Pvt. Ltd.",
      website: "https://elconeers.com",
      country: "IN",
      industry: "Engineering",
      registrationNumber: "27AABCT1234A1Z5",
      gstNumber: "27AABCT1234A1Z5",
      headquarters: "Vadodara, India",
      companyType: "Private Limited",
      founded: new Date("2015-03-15"),
      assessments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      companyId: "rishabh-1",
      legalName: "Rishabh Software Pvt. Ltd.",
      website: "https://rishabh.com",
      country: "IN",
      industry: "Software",
      registrationNumber: "27AABCS5678A1Z9",
      gstNumber: "27AABCS5678A1Z9",
      headquarters: "Pune, India",
      companyType: "Private Limited",
      founded: new Date("2008-06-20"),
      assessments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      companyId: "tix-1",
      legalName: "Tix Ecosystems Pvt. Ltd.",
      website: "https://tixecosystems.com",
      country: "IN",
      industry: "Technology",
      registrationNumber: "27AABCU9012A1Z3",
      gstNumber: "27AABCU9012A1Z3",
      headquarters: "Bangalore, India",
      companyType: "Private Limited",
      founded: new Date("2012-11-10"),
      assessments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

/**
 * Error handling
 */
export function handleError(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unexpected error occurred";
}

/**
 * Local storage helpers
 */
export function serializeAssessment(assessment: Types.Assessment): string {
  return JSON.stringify(assessment);
}

export function deserializeAssessment(json: string): Types.Assessment {
  const data = JSON.parse(json);
  return {
    ...data,
    startedAt: new Date(data.startedAt),
    completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
    reviewDate: data.reviewDate ? new Date(data.reviewDate) : undefined,
  };
}
