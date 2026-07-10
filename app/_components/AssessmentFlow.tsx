// app/_components/AssessmentFlow.tsx
// Component to manage assessment flow from start to completion

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as Types from "@/lib/types";
import * as Utils from "@/lib/utils";
import RiskCard from "./RiskCard";

export default function AssessmentFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: searchParams.get("company") || "",
    website: searchParams.get("website") || "",
    country: "",
    gstNumber: "",
    registrationNumber: "",
    executionMode: "parallel" as Types.ExecutionMode,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<Types.Assessment | null>(null);
  const [assessmentId, setAssessmentId] = useState<string>("");
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assessmentId || !isPolling) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/assess?id=${assessmentId}`);
        const data = await response.json();

        if (data.success && data.assessment) {
          setAssessment(data.assessment);

          if (
            data.assessment.status === "COMPLETED" ||
            data.assessment.status === "FAILED"
          ) {
            setIsPolling(false);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [assessmentId, isPolling]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setAssessmentId(data.assessmentId);
        setIsPolling(true);
        setAssessment({
          assessmentId: data.assessmentId,
          companyId: formData.companyName,
          companyName: formData.companyName,
          status: data.status,
          progress: data.progress,
          startedAt: new Date(),
          executionMode: formData.executionMode,
          evidence: [],
          businessRulesApplied: [],
          auditTrail: [],
          agentOutputs: {},
        } as Types.Assessment);
      } else {
        setError(data.message || "Failed to start assessment");
      }
    } catch (err) {
      setError(Utils.handleError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!assessmentId) return;

    try {
      const response = await fetch(`/api/report?id=${assessmentId}`);
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ECLIPS-Report-${assessmentId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError("Failed to download report");
    }
  };

  const handleStartNew = () => {
    setAssessment(null);
    setAssessmentId("");
    setFormData({
      companyName: "",
      website: "",
      country: "",
      gstNumber: "",
      registrationNumber: "",
      executionMode: "parallel",
    });
    setError("");
  };

  if (assessment && assessment.status === "COMPLETED") {
    return (
      <div>
        <RiskCard
          assessment={assessment}
          onDownloadReport={handleDownloadReport}
        />
        <button
          onClick={handleStartNew}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Start New Assessment
        </button>
      </div>
    );
  }

  if (assessment && assessment.status === "FAILED") {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Assessment Failed
          </h3>
          <p className="text-red-700 mb-4">
            The assessment could not be completed. Please try again.
          </p>
          <button
            onClick={handleStartNew}
            className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isPolling && assessment) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {assessment.companyName}
        </h2>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Assessment Progress
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {assessment.progress}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${assessment.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-700 font-medium">
            Running AI agents...
          </p>
          <p className="text-sm text-gray-600">
            This may take 1-2 minutes
          </p>
        </div>

        {assessment.executionMode === "parallel" && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Active Agents
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <AgentStatus
                name="Company Discovery"
                running={assessment.progress < 30}
              />
              <AgentStatus
                name="Financial Intelligence"
                running={
                  assessment.progress >= 20 && assessment.progress < 60
                }
              />
              <AgentStatus
                name="Market Intelligence"
                running={
                  assessment.progress >= 20 && assessment.progress < 60
                }
              />
              <AgentStatus
                name="Risk Scoring"
                running={assessment.progress >= 70}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        New Credit Assessment
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="e.g., Acme Corp Pvt. Ltd."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="e.g., IN"
              maxLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleInputChange}
              placeholder="27AABCT1234A1Z5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="CIN/ROC number"
              className="w-full px-4 py-2 border border-gray-300
cat > app/_components/AssessmentFlow.tsx << 'EOF'
// app/_components/AssessmentFlow.tsx
// Component to manage assessment flow from start to completion

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import * as Types from "@/lib/types";
import * as Utils from "@/lib/utils";
import RiskCard from "./RiskCard";

export default function AssessmentFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    companyName: searchParams.get("company") || "",
    website: searchParams.get("website") || "",
    country: "",
    gstNumber: "",
    registrationNumber: "",
    executionMode: "parallel" as Types.ExecutionMode,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assessment, setAssessment] = useState<Types.Assessment | null>(null);
  const [assessmentId, setAssessmentId] = useState<string>("");
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!assessmentId || !isPolling) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/assess?id=${assessmentId}`);
        const data = await response.json();

        if (data.success && data.assessment) {
          setAssessment(data.assessment);

          if (
            data.assessment.status === "COMPLETED" ||
            data.assessment.status === "FAILED"
          ) {
            setIsPolling(false);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [assessmentId, isPolling]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/assess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setAssessmentId(data.assessmentId);
        setIsPolling(true);
        setAssessment({
          assessmentId: data.assessmentId,
          companyId: formData.companyName,
          companyName: formData.companyName,
          status: data.status,
          progress: data.progress,
          startedAt: new Date(),
          executionMode: formData.executionMode,
          evidence: [],
          businessRulesApplied: [],
          auditTrail: [],
          agentOutputs: {},
        } as Types.Assessment);
      } else {
        setError(data.message || "Failed to start assessment");
      }
    } catch (err) {
      setError(Utils.handleError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!assessmentId) return;

    try {
      const response = await fetch(`/api/report?id=${assessmentId}`);
      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ECLIPS-Report-${assessmentId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError("Failed to download report");
    }
  };

  const handleStartNew = () => {
    setAssessment(null);
    setAssessmentId("");
    setFormData({
      companyName: "",
      website: "",
      country: "",
      gstNumber: "",
      registrationNumber: "",
      executionMode: "parallel",
    });
    setError("");
  };

  if (assessment && assessment.status === "COMPLETED") {
    return (
      <div>
        <RiskCard
          assessment={assessment}
          onDownloadReport={handleDownloadReport}
        />
        <button
          onClick={handleStartNew}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          Start New Assessment
        </button>
      </div>
    );
  }

  if (assessment && assessment.status === "FAILED") {
    return (
      <div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Assessment Failed
          </h3>
          <p className="text-red-700 mb-4">
            The assessment could not be completed. Please try again.
          </p>
          <button
            onClick={handleStartNew}
            className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isPolling && assessment) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {assessment.companyName}
        </h2>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Assessment Progress
            </span>
            <span className="text-sm font-semibold text-blue-600">
              {assessment.progress}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${assessment.progress}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-3 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-700 font-medium">
            Running AI agents...
          </p>
          <p className="text-sm text-gray-600">
            This may take 1-2 minutes
          </p>
        </div>

        {assessment.executionMode === "parallel" && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Active Agents
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <AgentStatus
                name="Company Discovery"
                running={assessment.progress < 30}
              />
              <AgentStatus
                name="Financial Intelligence"
                running={
                  assessment.progress >= 20 && assessment.progress < 60
                }
              />
              <AgentStatus
                name="Market Intelligence"
                running={
                  assessment.progress >= 20 && assessment.progress < 60
                }
              />
              <AgentStatus
                name="Risk Scoring"
                running={assessment.progress >= 70}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        New Credit Assessment
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="e.g., Acme Corp Pvt. Ltd."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="e.g., IN"
              maxLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleInputChange}
              placeholder="27AABCT1234A1Z5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="CIN/ROC number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Execution Mode
          </label>
          <select
            name="executionMode"
            value={formData.executionMode}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="parallel">Parallel (Faster, ~2 min)</option>
            <option value="sequential">Sequential (Thorough, ~3 min)</option>
          </select>
          <p className="text-xs text-gray-600 mt-1">
            Parallel runs all agents simultaneously. Sequential runs them one by
            one for more thorough analysis.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isSubmitting ? "Starting Assessment..." : "Start Assessment"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t">
        <p className="text-sm text-gray-600 text-center">
          💡 Tip: Fill in as much information as possible for a more accurate
          assessment.
        </p>
      </div>
    </div>
  );
}

function AgentStatus({ name, running }: { name: string; running: boolean }) {
  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
      <div
        className={`w-2 h-2 rounded-full ${
          running ? "bg-blue-600 animate-pulse" : "bg-gray-300"
        }`}
      ></div>
      <span className="text-xs text-gray-700">{name}</span>
    </div>
  );
}
