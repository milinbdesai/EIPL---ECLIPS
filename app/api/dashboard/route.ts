// app/api/dashboard/route.ts
// API endpoint for dashboard metrics

import { NextRequest, NextResponse } from "next/server";
import * as Utils from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    console.log("[DASHBOARD API] Fetching metrics");

    // Get all assessments
    const allAssessments = Utils.getAllAssessments();

    // Calculate metrics
    const metrics = Utils.getDashboardMetrics(allAssessments);

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard metrics retrieved",
        metrics: {
          totalAssessments: metrics.totalAssessments,
          greenCount: metrics.greenCount,
          amberCount: metrics.amberCount,
          redCount: metrics.redCount,
          reviewRequiredCount: metrics.reviewRequiredCount,
          averageRiskScore: metrics.averageRiskScore,
          averageConfidence: metrics.averageConfidence,
          averageDataQuality: metrics.averageDataQuality,
          riskDistribution: metrics.riskDistribution,
          recentAssessments: metrics.recentAssessments.map(
            (assessment) => ({
              assessmentId: assessment.assessmentId,
              companyName: assessment.companyName,
              status: assessment.status,
              riskScore: assessment.riskScore,
              recommendation: assessment.recommendation,
              confidence: assessment.confidence,
              completedAt: assessment.completedAt,
              startedAt: assessment.startedAt,
            })
          ),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DASHBOARD API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: Utils.handleError(error),
      },
      { status: 500 }
    );
  }
}
