"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import RiskCard from "@/app/_components/RiskCard";
import * as Types from "@/lib/types";

function AssessmentFlowContent() {
  const [formData, setFormData] = useState({ companyName: "" });
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<Types.Assessment | null>(null);
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/assess", {
        companyName: formData.companyName,
      });
      setAssessment(res.data);

      const pollInterval = setInterval(async () => {
        const statusRes = await axios.get(`/api/assess?id=${res.data.assessmentId}`);
        if (statusRes.data.status === "COMPLETED" || statusRes.data.status === "FAILED") {
          setAssessment(statusRes.data);
          clearInterval(pollInterval);
          setLoading(false);
        } else {
          setAssessment(statusRes.data);
        }
      }, 2000);
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
              Company Name or GST
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ companyName: e.target.value })}
              placeholder="e.g., Elcon Engineers or GST number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Assessing..." : "Start Assessment"}
          </button>
        </form>

        {loading && (
          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">Processing assessment...</p>
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
