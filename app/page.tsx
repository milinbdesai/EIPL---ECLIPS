"use client";

import Link from "next/link";
import { TrendingUp, BarChart3, Shield, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ECLIPS</h1>
          <Link
            href="/assessment/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Start Assessment
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Credit & Lending Intelligence Platform Suite
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered counterparty risk assessment for Indian SMEs & startups
        </p>
        <Link
          href="/assessment/new"
          className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition"
        >
          Start Risk Assessment <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
            <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Company Discovery</h3>
            <p className="text-gray-600">
              AI-powered identification and verification of legal entities
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
            <BarChart3 className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Financial Analysis</h3>
            <p className="text-gray-600">
              Comprehensive financial health assessment and ratio analysis
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition">
            <Shield className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Risk Scoring</h3>
            <p className="text-gray-600">
              Intelligent credit risk calculation and recommendations
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { num: "1", title: "Enter Company", desc: "Provide company name or GST" },
            { num: "2", title: "AI Analysis", desc: "Multi-agent assessment runs" },
            { num: "3", title: "Risk Score", desc: "Get GREEN/AMBER/RED rating" },
            { num: "4", title: "Download Report", desc: "PDF with recommendations" },
          ].map((step) => (
            <div key={step.num} className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {step.num}
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold">1000+</p>
            <p>Companies Assessed</p>
          </div>
          <div>
            <p className="text-4xl font-bold">95%</p>
            <p>Accuracy Rate</p>
          </div>
          <div>
            <p className="text-4xl font-bold">30s</p>
            <p>Average Assessment</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center">
        <p>&copy; 2026 ECLIPS. Powered by Anthropic Claude.</p>
      </footer>
    </div>
  );
}
