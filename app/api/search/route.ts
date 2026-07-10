// app/api/search/route.ts
// API endpoint for searching companies

import { NextRequest, NextResponse } from "next/server";
import * as Utils from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get("q")?.toLowerCase();

    if (!searchQuery || searchQuery.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query must be at least 2 characters",
          results: [],
        },
        { status: 400 }
      );
    }

    // Get all companies
    const allCompanies = Utils.getAllCompanies();

    // Search by name, website, or industry
    const results = allCompanies.filter((company) => {
      const nameMatch = company.legalName
        .toLowerCase()
        .includes(searchQuery);
      const tradingNameMatch = company.tradingName
        ?.toLowerCase()
        .includes(searchQuery);
      const websiteMatch = company.website
        .toLowerCase()
        .includes(searchQuery);
      const industryMatch = company.industry
        .toLowerCase()
        .includes(searchQuery);

      return (
        nameMatch ||
        tradingNameMatch ||
        websiteMatch ||
        industryMatch
      );
    });

    return NextResponse.json(
      {
        success: true,
        message: `Found ${results.length} companies`,
        results: results.map((c) => ({
          companyId: c.companyId,
          legalName: c.legalName,
          website: c.website,
          country: c.country,
          industry: c.industry,
          registrationNumber: c.registrationNumber,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SEARCH API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: Utils.handleError(error),
        results: [],
      },
      { status: 500 }
    );
  }
}
