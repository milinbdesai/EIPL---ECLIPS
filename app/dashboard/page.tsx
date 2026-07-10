// app/dashboard/page.tsx
// Dashboard showing portfolio metrics and recent assessments

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as Types from "@/lib/types";
import * as Utils from "@/lib/utils";

interface DashboardMetrics {
  totalAssessments: number;
  greenCount: number;
  amberCount: number;
  redCount: number;
  reviewRequiredCount: number;
  averageRiskScore: number;
  averageConfidence: number;
  averageDataQuality: number;
  riskDistribution: {
    green: number;
    amber: number;
    red: number;
    reviewRequired: number;
  };
  recentAssessments: Array<{
    assessmentId: string;
    companyName: string;
    status: string;
    riskScore?: number;
    recommendation?: string;
    confidence?: number;
    completedAt?: Date;
    startedAt: Date;
  }>;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/dashboard");
      const data = await response.json();

      if (data.success) {
        setMetrics(data.metrics);
      } else {
        setError(data.message || "Failed to fetch metrics");
      }
    } catch (err) {
      setError(Utils.handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!metrics) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-600">No data available</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ECLIPS</h1>
          <p className="text-lg text-gray-600">Portfolio Dashboard</p>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Link
            href="/assessment/new"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + New Assessment
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            label="Total Assessments"
            value={metrics.totalAssessments}
            icon="📊"
          />
          <SummaryCard label="Approved" value={metrics.greenCount} icon="✓" />
          <SummaryCard label="Review" value={metrics.amberCount} icon="⚠" />
          <SummaryCard label="Declined" value={metrics.redCount} icon="✗" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            label="Avg Risk Score"
            value={metrics.averageRiskScore}
            unit="/100"
            color={Utils.getScoreColor(metrics.averageRiskScore)}
          />
          <MetricCard
            label="Avg Confidence"
            value={metrics.averageConfidence}
            unit="%"
            color="#3b82f6"
          />
          <MetricCard
            label="Avg Data Quality"
            value={metrics.averageDataQuality}
            unit="%"
            color="#a855f7"
          />
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Risk Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <RiskDistributionBar
              label="Approved (GREEN)"
              percentage={metrics.riskDistribution.green}
              color="#10b981"
            />
            <RiskDistributionBar
              label="Review (AMBER)"
              percentage={metrics.riskDistribution.amber}
              color="#f59e0b"
            />
            <RiskDistributionBar
              label="Declined (RED)"
              percentage={metrics.riskDistribution.red}
              color="#ef4444"
            />
            <RiskDistributionBar
              label="Review Required"
              percentage={metrics.riskDistribution.reviewRequired}
              color="#6b7280"
            />
          </div>
        </div>

        {/* Recent Assessments */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Assessments
            </h2>
          </div>

          {metrics.recentAssessments.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-600">
              No assessments yet. Start by creating a new assessment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Recommendation
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentAssessments.map((assessment) => (
                    <tr
                      key={assessment.assessmentId}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          href={`/assessment/${assessment.assessmentId}`}
                          className="font-medium text-blue-600 hover:text-blue-700"
                        >
                          {assessment.companyName}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={assessment.status} />
                      </td>
                      <td className="px-6 py-4">
                        {assessment.riskScore ? (
                          <span
                            className="font-semibold"
                            style={{
                              color: Utils.getScoreColor(
                                assessment.riskScore
                              ),
                            }}
                          >
                            {assessment.riskScore}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {assessment.recommendation ? (
                          <RecommendationBadge
                            recommendation={
                              assessment.recommendation as Types.RecommendationStatus
                            }
                          />
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {assessment.confidence ? (
                          <span className="text-gray-900">
                            {assessment.confidence}%
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {Utils.formatDate(
                          assessment.completedAt || assessment.startedAt
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/**
 * Summary card component
 */
function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

/**
 * Metric card component
 */
function MetricCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      <div className="flex items-baseline">
        <span className="text-4xl font-bold" style={{ color }}>
          {value}
        </span>
        <span className="text-lg text-gray-600 ml-1">{unit}</span>
      </div>
    </div>
  );
}

/**
 * Risk distribution bar
 */
function RiskDistributionBar({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {percentage}%
        </span>
      </div>
      <div className="bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all"
          style={{
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
}

/**
 * Status badge
 */
function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    COMPLETED: { bg: "bg-green-50", text: "text-green-700" },
    RUNNING: { bg: "bg-blue-50", text: "text-blue-700" },
    FAILED: { bg: "bg-red-50", text: "text-red-700" },
  };

  const colors = statusColors[status] || { bg: "bg-gray-50", text: "text-gray-700" };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}>
      {status}
    </span>
  );
}

/**
 * Recommendation badge
 */
function RecommendationBadge({
  recommendation,
}: {
  recommendation: Types.RecommendationStatus;
}) {
  const label = Utils.getRiskLabel(recommendation);
  const color = Utils.getRiskColor(recommendation);

  return (
    <span
      className="px-3 py-1 rounded-full text-sm font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
