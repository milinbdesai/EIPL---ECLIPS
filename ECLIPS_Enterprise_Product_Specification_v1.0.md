# ECLIPS -- Excelsource Credit & Lending Intelligence Platform Suite

> **Enterprise Product Specification (PRD + SRS + AI Implementation
> Guide)**

**Version:** 1.0\
**Status:** Draft

------------------------------------------------------------------------

# About this document

This specification defines the vision, architecture, user experience, AI
intelligence layer, backend architecture, implementation guidance,
security, testing and deployment strategy for **ECLIPS (Excelsource
Credit & Lending Intelligence Platform Suite)**.

It is intended to serve as the **master implementation document** for
Claude Code.

------------------------------------------------------------------------

# Table of Contents

1.  Product Vision
2.  Business Requirements
3.  Functional Requirements
4.  User Personas
5.  User Experience Specification
6.  Information Architecture
7.  AI Orchestration
8.  Specialist AI Agents
9.  Credit Decision Engine
10. Executive Report Engine
11. Backend Architecture
12. Firestore Data Model
13. API Specifications
14. Business Rules Engine
15. Risk Scoring Engine
16. Credit Limit Engine
17. Payment Terms Engine
18. Security
19. Audit & Logging
20. Performance
21. Testing
22. Deployment
23. Roadmap

------------------------------------------------------------------------

# 1. Product Vision

ECLIPS is an AI-powered decision support platform for assessing the
creditworthiness of customers, vendors, suppliers and business partners.

**Guiding Principle**

> AI assists. Humans decide.

The platform shall provide transparent, explainable and evidence-backed
recommendations.

------------------------------------------------------------------------

# 2. Business Objectives

-   Reduce credit assessment time
-   Standardize decisions
-   Reduce payment default risk
-   Improve due diligence quality
-   Produce executive-ready reports
-   Maintain complete audit history

------------------------------------------------------------------------

# 3. Core Functional Requirements

-   Company Search
-   Company Discovery
-   Financial Analysis
-   Legal & Compliance Analysis
-   Market Intelligence
-   Document Intelligence
-   Credit Recommendation
-   Suggested Credit Limit
-   Suggested Payment Terms
-   Executive Reports
-   Portfolio Dashboard
-   Watchlist
-   Audit History

------------------------------------------------------------------------

# 4. User Personas

-   Finance
-   Procurement
-   Sales
-   Leadership
-   Internal Audit
-   System Administrator

------------------------------------------------------------------------

# 5. UX Principles

-   Minimal
-   Professional
-   Explainable
-   Responsive
-   Accessible (WCAG 2.1 AA)

Primary navigation:

-   Dashboard
-   Company Search
-   Portfolio
-   Assessments
-   Reports
-   Watchlist
-   Audit History
-   Administration
-   Settings

------------------------------------------------------------------------

# 6. AI Architecture

## Orchestrator

Coordinates all specialist agents.

## Agents

1.  Company Discovery
2.  Financial Intelligence
3.  Legal & Compliance
4.  Market Intelligence
5.  Document Intelligence
6.  Credit Decision
7.  Executive Report

All agents return structured JSON.

------------------------------------------------------------------------

# 7. Company Discovery Agent

Responsibilities:

-   Resolve legal entity
-   Validate website
-   Identify registration
-   Industry classification
-   Headquarters
-   Parent/Subsidiary detection

Output:

-   Company profile
-   Identity confidence
-   Supporting evidence

------------------------------------------------------------------------

# 8. Financial Intelligence Agent

Extract:

-   Revenue
-   EBITDA
-   Net Worth
-   Working Capital
-   Assets
-   Liabilities
-   Cash Flow

Calculate:

-   Current Ratio
-   Quick Ratio
-   Debt/Equity
-   ROE
-   ROA
-   EBITDA Margin
-   Net Margin

Every ratio must include:

-   Formula
-   Value
-   Industry benchmark (where available)
-   Interpretation
-   Risk level
-   Trend

------------------------------------------------------------------------

# 9. Legal & Compliance Agent

Assess:

-   Registration
-   Insolvency
-   Litigation
-   GST/Tax
-   Regulatory actions
-   Director status
-   Sanctions

Output:

-   Compliance score
-   Legal risk
-   Evidence

------------------------------------------------------------------------

# 10. Market Intelligence Agent

Assess:

-   News sentiment
-   Industry outlook
-   Country risk
-   Reputation
-   Leadership stability

Generate:

-   AI Insight Cards
-   Opportunity Engine
-   Risk Engine

------------------------------------------------------------------------

# 11. Document Intelligence Agent

Support:

-   Annual Reports
-   Balance Sheets
-   P&L
-   Cash Flow
-   Auditor Reports
-   GST
-   PAN

Provide:

-   OCR
-   Structured extraction
-   Financial freshness indicator

------------------------------------------------------------------------

# 12. Credit Decision Agent

Weighted scoring:

  Category             Weight
  ------------------ --------
  Financial               35%
  Legal                   20%
  Market                  15%
  Stability               10%
  Documents               10%
  Industry/Country        10%

Decision Bands:

-   Green: 70--100
-   Amber: 30--69
-   Red: 0--29
-   Review Required: insufficient evidence

Produce:

-   Risk Score
-   Confidence
-   Data Quality
-   Suggested Credit Limit
-   Suggested Payment Terms
-   Review Date
-   Explainability

------------------------------------------------------------------------

# 13. Executive Report Agent

Generate:

-   Executive Summary
-   Due Diligence Report
-   Credit Committee Report
-   Audit Report

Formats:

-   PDF
-   DOCX
-   HTML

------------------------------------------------------------------------

# 14. Business Rules

Rules override AI.

Examples:

-   Insolvency ⇒ Not Green
-   Sanctions ⇒ Red
-   Missing audited financials ⇒ Review Required unless manually
    approved

------------------------------------------------------------------------

# 15. Credit Limit Logic

Calculate multiple limits:

-   \% Annual Turnover
-   \% Working Capital
-   \% Net Worth

Choose the most conservative value after risk adjustment.

------------------------------------------------------------------------

# 16. Payment Terms

-   Green: Net 45--90
-   Amber: Net 15--30
-   Red: Advance / LC

Configurable.

------------------------------------------------------------------------

# 17. Evidence Model

Every fact includes:

-   Value
-   Source
-   Date
-   Confidence
-   Verification status

Nothing is displayed without evidence.

------------------------------------------------------------------------

# 18. Firestore Collections

-   companies
-   assessments
-   evidence
-   reports
-   users
-   settings
-   audit_logs
-   watchlist
-   uploaded_documents

------------------------------------------------------------------------

# 19. Security

-   Firebase Authentication
-   Role-based access
-   HTTPS
-   Encryption at rest
-   Audit logs
-   OWASP compliance
-   No hard-coded secrets

------------------------------------------------------------------------

# 20. Technology Stack

Frontend

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   shadcn/ui

Backend

-   Next.js API
-   Firebase
-   Firestore
-   Firebase Storage

Deployment

-   Vercel
-   GitHub Actions

AI

-   Claude (Primary)
-   OpenAI (Optional)

------------------------------------------------------------------------

# 21. Testing

-   Unit
-   Integration
-   End-to-end
-   AI output validation
-   Security
-   Performance

------------------------------------------------------------------------

# 22. Deployment

-   GitHub
-   CI/CD
-   Vercel
-   Firebase

------------------------------------------------------------------------

# 23. Product Roadmap

Version 1

-   Credit assessment
-   Reports
-   Dashboard

Version 2

-   Continuous monitoring
-   ERP integrations
-   Alerts
-   Portfolio analytics

Version 3

-   Commercial SaaS
-   Multi-tenant
-   API marketplace
-   White-label

------------------------------------------------------------------------

# Appendix A

## Guiding Principles

-   AI never hallucinates.
-   Every fact has evidence.
-   Business rules override AI.
-   Human approval is final.
-   Conservative recommendations when uncertain.

------------------------------------------------------------------------

# Appendix B

## Suggested Tagline

**ECLIPS**

**Excelsource Credit & Lending Intelligence Platform Suite**

**Intelligent Credit Decisions. Backed by Evidence.**
