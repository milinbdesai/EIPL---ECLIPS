export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, gstNumber, country } = body;

    if (!companyName) {
      return NextResponse.json({ error: "Company name required" }, { status: 400 });
    }

    const prompt = `You are a credit risk analyst. Analyze the following company and provide a credit risk assessment in JSON format.

Company Name: ${companyName}
GST Number: ${gstNumber || "Not provided"}
Country: ${country}

Based on the company name and available information, provide:
1. A risk score (0-100, where 0 is lowest risk and 100 is highest)
2. A recommendation (GREEN for low risk, AMBER for medium risk, RED for high risk)
3. Confidence level (0-100)
4. Key risks (list of 2-3 risks)
5. Strengths (list of 2-3 strengths)
6. Suggested credit limit as a percentage of estimated turnover
7. Payment terms recommendation

Return ONLY valid JSON with these fields: riskScore, recommendation, confidence, risks, strengths, creditLimitPercentage, paymentTerms, reasoning`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const analysis = JSON.parse(responseText);

    const assessment = {
      assessmentId: `ASS-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      companyName,
      gstNumber: gstNumber || null,
      country,
      status: "COMPLETED",
      riskScore: analysis.riskScore,
      recommendation: analysis.recommendation,
      confidence: analysis.confidence,
      strengths: analysis.strengths,
      risks: analysis.risks,
      paymentTerms: analysis.paymentTerms,
      creditLimit: {
        amount: Math.round(500000 * (analysis.creditLimitPercentage / 100)),
        currency: "INR",
        basis: `${analysis.creditLimitPercentage}% of estimated turnover`,
      },
      reasoning: analysis.reasoning,
      createdAt: new Date(),
      updatedAt: new Date(),
      categoryScores: {
        financial: analysis.riskScore > 70 ? 60 : 75,
        legal: analysis.riskScore > 70 ? 55 : 70,
        market: analysis.riskScore > 70 ? 50 : 70,
        stability: analysis.riskScore > 70 ? 55 : 75,
        documentQuality: 70,
        industryCountry: 65,
      },
    };

    const docRef = await addDoc(collection(db, "assessments"), assessment);
    assessment.assessmentId = docRef.id;

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("[ASSESS] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const companyName = request.nextUrl.searchParams.get("company");

    if (id) {
      const assessmentsRef = collection(db, "assessments");
      const q = query(assessmentsRef, where("assessmentId", "==", id));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      return NextResponse.json(snapshot.docs[0].data());
    }

    if (companyName) {
      const assessmentsRef = collection(db, "assessments");
      const q = query(
        assessmentsRef,
        where("companyName", "==", companyName),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);

      return NextResponse.json({
        company: companyName,
        assessments: snapshot.docs.map((doc) => doc.data()),
      });
    }

    return NextResponse.json({ error: "ID or company name required" }, { status: 400 });
  } catch (error) {
    console.error("[ASSESS] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
