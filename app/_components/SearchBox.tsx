// app/_components/SearchBox.tsx
// Search component for finding companies

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  companyId: string;
  legalName: string;
  website: string;
  country: string;
  industry: string;
}

export default function SearchBox() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCompany = (company: SearchResult) => {
    router.push(`/assessment/new?company=${encodeURIComponent(company.legalName)}&website=${encodeURIComponent(company.website)}`);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for a company..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {results.map((company) => (
            <button
              key={company.companyId}
              onClick={() => handleSelectCompany(company)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
            >
              <div className="font-semibold text-gray-900">{company.legalName}</div>
              <div className="text-sm text-gray-600">{company.industry} • {company.country}</div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && searchQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
          No companies found
        </div>
      )}
    </div>
  );
}
