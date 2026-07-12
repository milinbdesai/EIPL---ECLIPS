export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";

// In-memory storage (will reset on hot reload, but good for testing)
const assessments = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName } = body;

    if (!companyName) {
      return NextResponse.json({ error: "Company name required" }, { status: 400 });
    }

    const assessmentId = `ASS-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const assessment = {
      assessmentId,
      companyId: companyName,
      companyName,
      status: "COMPLETED",
      progress: 100,
      startedAt: new Date(),
      riskScore: 72,
      recommendation: "GREEN",
      confidence: 80,
      dataQuality: 75,
      categoryScores: { financial: 75, legal: 70, market: 68, stability: 72, documentQuality: 65, industryCountry: 70 },
      creditLimit: { 
        amount: 5000000, 
        currency: "INR", 
        basis: "5% of turnover",
        calculationDetails: { turnoverBased: 0.05, internalCap: 50000000, adjustmentFactor: 1.0, adjustmentReason: "Standard" }
      },
      paymentTerms: "Net 30 days",
      reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      strengths: ["Established presence", "Good metrics", "Low risk"],
      risks: ["Limited visibility", "Sector volatility"],
      evidence: [],
      businessRulesApplied: [],
      auditTrail: [],
      agentOutputs: {},
      completedAt: new Date(),
    };

    assessments.set(assessmentId, assessment);
    console.log(`[ASSESS] Created assessment: ${assessmentId}`);
    
    return NextResponse.json(assessment);
  } catch (error) {
    console.error("[ASSESS] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const assessment = assessments.get(id);
    
    if (!assessment) {
      console.log(`[ASSESS] Not found: ${id}. Available: ${Array.from(assessments.keys())}`);
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log(`[ASSESS] Retrieved: ${id}`);
    return NextResponse.json(assessment);
  } catch (error) {
    console.error("[ASSESS] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
