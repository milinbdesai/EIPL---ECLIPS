// app/assessment/new/page.tsx
// Page for starting a new assessment

import AssessmentFlow from "@/app/_components/AssessmentFlow";

export default function NewAssessmentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ECLIPS</h1>
          <p className="text-xl text-gray-600">
            Credit & Lending Intelligence Platform Suite
          </p>
        </div>

        {/* Main Content */}
        <AssessmentFlow />

        {/* Footer Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            title="Company Discovery"
            description="AI-powered identification and verification of legal entities"
          />
          <InfoCard
            title="Financial Analysis"
            description="Comprehensive financial health assessment and ratio analysis"
          />
          <InfoCard
            title="Risk Scoring"
            description="Intelligent credit risk calculation and recommendations"
          />
        </div>
      </div>
    </main>
  );
}

/**
 * Info card component
 */
function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
