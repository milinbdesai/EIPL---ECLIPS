'use dynamic';

import { NextRequest, NextResponse } from "next/server";
import * as Utils from "@/lib/utils";
import sampleCompanies from "@/data/sample-companies.json";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")?.toLowerCase() || "";
    console.log(`[SEARCH API] Query: ${query}`);

    if (!query || query.length < 2) {
      return NextResponse.json({ companies: [] });
    }

    const filtered = sampleCompanies.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.gstNumber.toLowerCase().includes(query) ||
        c.website?.toLowerCase().includes(query)
    );

    return NextResponse.json({ companies: filtered });
  } catch (error) {
    console.error("[SEARCH API] Error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
