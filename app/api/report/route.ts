'use dynamic';

import { NextRequest, NextResponse } from "next/server";
import * as Utils from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const assessmentId = request.nextUrl.searchParams.get("id");
    console.log(`[REPORT API] Generating report for: ${assessmentId}`);

    if (!assessmentId) {
      return NextResponse.json(
        { error: "Assessment ID required" },
        { status: 400 }
      );
    }

    const assessment = Utils.getAssessment(assessmentId);
    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found" },
        { status: 404 }
      );
    }

    const reportContent = `
ECLIPS Credit Assessment Report
Assessment ID: ${assessment.assessmentId}
Company: ${assessment.companyName}
Date: ${Utils.formatDateTime(assessment.startedAt)}
Risk Score: ${assessment.riskScore || "N/A"}
Recommendation: ${assessment.recommendation || "PENDING"}
    `.trim();

    return NextResponse.json({
      success: true,
      data: reportContent,
    });
  } catch (error) {
    console.error("[REPORT API] Error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
