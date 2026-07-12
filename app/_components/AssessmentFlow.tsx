"use client";

import { useState, Suspense } from "react";
import axios from "axios";
import RiskCard from "@/app/_components/RiskCard";
import * as Types from "@/lib/types";

function AssessmentFlowContent() {
  const [formData, setFormData] = useState({ 
    companyName: "",
    gstNumber: "",
    country: "India"
  });
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<Types.Assessment | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/assess", formData);
      setAssessment(res.data);
    } catch (error) {
      console.error("Assessment error:", error);
      setLoading(false);
    }
  };

  if (assessment) {
    return <RiskCard assessment={assessment} />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">New Assessment</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="e.g., Elcon Engineers"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Number (optional)
            </label>
            <input
              type="text"
              value={formData.gstNumber}
              onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
              placeholder="e.g., 27AABCT1234A1Z5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>India</option>
              <option>UAE</option>
              <option>USA</option>
              <option>UK</option>
              <option>Singapore</option>
              <option>Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Start Assessment"}
          </button>
        </form>

        {loading && (
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">Researching company...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentFlow() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <AssessmentFlowContent />
    </Suspense>
  );
}
