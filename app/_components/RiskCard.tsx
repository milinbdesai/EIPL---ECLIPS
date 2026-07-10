// app/_components/RiskCard.tsx
// Component to display risk assessment card

"use client";

import * as Utils from "@/lib/utils";
import * as Types from "@/lib/types";

interface RiskCardProps {
  assessment: Types.Assessment;
  onDownloadReport?: () => void;
}

export default function RiskCard({
  assessment,
  onDownloadReport,
}: RiskCardProps) {
  if (!assessment.recommendation) {
    return null;
  }

  const riskColor = Utils.getRiskColor(assessment.recommendation);
  const riskLabel = Utils.getRiskLabel(assessment.recommendation);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {assessment.companyName}
        </h2>
        <div
          className="px-4 py-2 rounded-full text-white font-semibold"
          style={{ backgroundColor: riskColor }}
        >
          {riskLabel}
        </div>
      </div>

      {/* Risk Score */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Risk Score</div>
          <div className="text-3xl font-bold" style={{ color: riskColor }}>
            {assessment.riskScore}
          </div>
          <div className="text-xs text-gray-500 mt-1">out of 100</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Confidence</div>
          <div className="text-3xl font-bold text-blue-600">
            {assessment.confidence}%
          </div>
          <div className="text-xs text-gray-500 mt-1">in assessment</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Data Quality</div>
          <div className="text-3xl font-bold text-purple-600">
            {assessment.dataQuality}%
          </div>
          <div className="text-xs text-gray-500 mt-1">available info</div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Next Review</div>
          <div className="text-lg font-bold text-gray-900">
            {assessment.reviewDate
              ? Utils.formatDate(assessment.reviewDate)
              : "N/A"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {assessment.reviewDate
              ? `in ${Utils.calculateDaysUntilReview(
                  new Date(assessment.reviewDate)
                )} days`
              : "Not set"}
          </div>
        </div>
      </div>

      {/* Category Scores */}
      {assessment.categoryScores && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Score Breakdown
          </h3>
          <div className="space-y-3">
            <ScoreBar
              label="Financial Health"
              score={assessment.categoryScores.financial}
              weight="35%"
            />
            <ScoreBar
              label="Legal & Compliance"
              score={assessment.categoryScores.legal}
              weight="20%"
            />
            <ScoreBar
              label="Market & Reputation"
              score={assessment.categoryScores.market}
              weight="15%"
            />
            <ScoreBar
              label="Business Stability"
              score={assessment.categoryScores.stability}
              weight="10%"
            />
            <ScoreBar
              label="Document Quality"
              score={assessment.categoryScores.documentQuality}
              weight="10%"
            />
            <ScoreBar
              label="Industry & Country Risk"
              score={assessment.categoryScores.industryCountry}
              weight="10%"
            />
          </div>
        </div>
      )}

      {/* Credit Decision */}
      {assessment.creditLimit && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Credit Recommendation
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Suggested Credit Limit</div>
              <div className="text-2xl font-bold text-blue-600">
                {Utils.formatCurrency(
                  assessment.creditLimit.amount,
                  assessment.creditLimit.currency
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {assessment.creditLimit.basis}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Payment Terms</div>
              <div className="text-2xl font-bold text-blue-600">
                {assessment.paymentTerms || "N/A"}
              </div>
              <div className="text-xs text-gray-500 mt-1">recommended</div>
            </div>
          </div>
        </div>
      )}

      {/* Strengths */}
      {assessment.strengths && assessment.strengths.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-green-700 mb-2">
            ✓ Key Strengths
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {assessment.strengths.map((strength, idx) => (
              <li key={idx} className="text-gray-700">
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks */}
      {assessment.risks && assessment.risks.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-red-700 mb-2">
            ⚠ Key Risks
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {assessment.risks.map((risk, idx) => (
              <li key={idx} className="text-gray-700">
                {risk}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missing Information */}
      {assessment.missingInformation &&
        assessment.missingInformation.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-amber-700 mb-2">
              ⓘ Missing Information
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {assessment.missingInformation.map((info, idx) => (
                <li key={idx} className="text-gray-700">
                  {info}
                </li>
              ))}
            </ul>
          </div>
        )}

      {/* Metadata */}
      <div className="border-t pt-4 mt-6 text-sm text-gray-600">
        <div>
          Assessment ID: <span className="font-mono">{assessment.assessmentId}</span>
        </div>
        <div>
          Completed: {Utils.formatDateTime(assessment.completedAt || new Date())}
        </div>
      </div>

      {/* Download Button */}
      {onDownloadReport && (
        <button
          onClick={onDownloadReport}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Download PDF Report
        </button>
      )}
    </div>
  );
}

/**
 * Score bar component
 */
function ScoreBar({
  label,
  score,
  weight,
}: {
  label: string;
  score: number;
  weight: string;
}) {
  const color = Utils.getScoreColor(score);

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-600">
          {score}/100 ({weight})
        </span>
      </div>
      <div className="bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all"
          style={{
            width: `${Math.min(score, 100)}%`,
            backgroundColor: color,
          }}
        ></div>
      </div>
    </div>
  );
}
