// app/api/assess/route.ts
// API endpoint for starting a new assessment

import { NextRequest, NextResponse } from "next/server";
import AIOrchestrator from "@/lib/orchestrator";
import * as Types from "@/lib/types";

const orchestrator = new AIOrchestrator();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      website,
      country,
      gstNumber,
      registrationNumber,
      executionMode = "parallel",
    } = body;

    if (!companyName || companyName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Company name is required" },
        { status: 400 }
      );
    }

    console.log("[ASSESS API] Starting assessment for:", companyName);

    // Start assessment with orchestrator (async)
    const assessment = await orchestrator.startAssessment(companyName, {
      website,
      country,
      gstNumber,
      registrationNumber,
      executionMode: executionMode as Types.ExecutionMode,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Assessment started",
        assessmentId: assessment.assessmentId,
        status: assessment.status,
        progress: assessment.progress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ASSESS API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const assessmentId = request.nextUrl.searchParams.get("id");

    if (!assessmentId) {
      return NextResponse.json(
        { success: false, message: "Assessment ID is required" },
        { status: 400 }
      );
    }

    // Get assessment from orchestrator
    const assessment = orchestrator.getAssessment(assessmentId);

    if (!assessment) {
      return NextResponse.json(
        { success: false, message: "Assessment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Assessment retrieved",
        assessment: {
          assessmentId: assessment.assessmentId,
          companyName: assessment.companyName,
          status: assessment.status,
          progress: assessment.progress,
          riskScore: assessment.riskScore,
          recommendation: assessment.recommendation,
          confidence: assessment.confidence,
          dataQuality: assessment.dataQuality,
          categoryScores: assessment.categoryScores,
          creditLimit: assessment.creditLimit,
          paymentTerms: assessment.paymentTerms,
          reviewDate: assessment.reviewDate,
          strengths: assessment.strengths,
          risks: assessment.risks,
          missingInformation: assessment.missingInformation,
          completedAt: assessment.completedAt,
          agentOutputs: assessment.agentOutputs,
          evidence: assessment.evidence?.slice(0, 10),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ASSESS API GET] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
