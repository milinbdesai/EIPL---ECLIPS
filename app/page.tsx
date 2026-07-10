// app/page.tsx
// ECLIPS Homepage

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ECLIPS</h1>
          <div className="space-x-4">
            <Link
              href="/assessment/new"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              New Assessment
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">ECLIPS</h1>
          <p className="text-2xl text-gray-700 mb-2">
            Excelsource Credit & Lending Intelligence Platform Suite
          </p>
          <p className="text-lg text-gray-600 mb-8">
            AI-powered credit risk assessment & lending decisions
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <Link
            href="/assessment/new"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Start New Assessment →
          </Link>
          <Link
            href="/dashboard"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
          >
            View Dashboard
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon="🔍"
            title="Company Discovery"
            description="AI-powered identification and verification of legal entities with full compliance checks"
          />
          <FeatureCard
            icon="💰"
            title="Financial Analysis"
            description="Comprehensive financial health assessment with ratio analysis and trend detection"
          />
          <FeatureCard
            icon="⚠️"
            title="Risk Scoring"
            description="Intelligent credit risk calculation with actionable recommendations and limits"
          />
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Step number="1" title="Enter Company" description="Provide company details" />
            <Step number="2" title="Run Agents" description="AI analyzes in parallel" />
            <Step number="3" title="Score Risk" description="Calculate weighted score" />
            <Step number="4" title="Get Decision" description="Recommendation & limits" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard number="4" label="AI Agents" description="Company, Financial, Market, Document" />
          <StatCard number="6" label="Risk Factors" description="Weighted across 6 dimensions" />
          <StatCard number="180s" label="Assessment Time" description="Complete analysis in 2-3 minutes" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p>© 2024 Excelsource International Pvt. Ltd. All rights reserved.</p>
          <p className="text-gray-400 mt-2">ECLIPS v1.0 - MVP</p>
        </div>
      </footer>
    </main>
  );
}

/**
 * Feature Card Component
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

/**
 * Step Component
 */
function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold text-lg">
        {number}
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  number,
  label,
  description,
}: {
  number: string;
  label: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <h3 className="font-bold text-gray-900 mb-1">{label}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
