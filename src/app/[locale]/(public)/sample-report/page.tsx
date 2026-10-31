'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';
import {
  FileText,
  Brain,
  Sparkles,
  Award,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Download,
  ArrowRight,
  Sliders,
  Compass,
  Target,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function SampleReportPage() {
  const [activeTab, setActiveTab] = useState<'dimensions' | 'archetype' | 'trajectory' | 'actionPlan'>('dimensions');

  const dimensionData = [
    {
      title: 'Analytical Synthesis & Critical Deduction',
      score: 95,
      tier: 'Top 1.8% Tier',
      norm: 'μ=100, σ=15',
      summary: 'Exceptional capacity to dissect ambiguous data streams, identify causal factors, and deduce optimal pathways with high quantitative confidence.',
    },
    {
      title: 'Contextual Clarity & Leadership EQ',
      score: 94,
      tier: 'Top 2.5% Tier',
      norm: 'μ=100, σ=15',
      summary: 'Pronounced emotional composure under pressure, adept at building consensus across divergent stakeholder groups without losing strategic focus.',
    },
    {
      title: 'Decision Agility & Execution Velocity',
      score: 92,
      tier: 'Top 4.2% Tier',
      norm: 'μ=100, σ=15',
      summary: 'High bias for action paired with disciplined risk containment. Rapid iterative validation reduces project cycle times.',
    },
    {
      title: 'Adaptive Problem Velocity (Speed vs. Precision)',
      score: 89,
      tier: 'Top 7.1% Tier',
      norm: 'μ=100, σ=15',
      summary: 'Calibrated deductive pacing. Balances cognitive speed with low error frequency under timed stress testing.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-border bg-gradient-to-b from-light-blue/50 via-background to-background">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-surface text-navy text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-border shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              Interactive Report Preview
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-heading max-w-3xl mx-auto leading-tight">
            SelfGrow AI Psychometric <span className="text-primary">Diagnostic Evaluation</span>
          </h1>

          <p className="mt-4 text-base text-body max-w-2xl mx-auto leading-relaxed">
            This interactive preview demonstrates the exact multi-dimensional depth, normative benchmarking, and actionable blueprints provided in your evaluation report.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" size="lg" className="shadow-xs font-semibold">
                Start Your Own Evaluation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Interactive Report Document Wrapper */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1050px] mx-auto px-4 lg:px-6">
          <div className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden">
            {/* Report Document Header */}
            <div className="p-6 sm:p-8 border-b border-border bg-gradient-to-r from-surface via-surface-secondary to-surface flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-light-blue px-3 py-1 rounded-full mb-2 inline-block">
                  Confidential Candidate Dossier
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-heading">
                  Personality &amp; Leadership Dynamics Diagnostic
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted mt-2">
                  <span>Candidate: <strong>Alex R. (Sample Benchmark)</strong></span>
                  <span>•</span>
                  <span>Norm: <strong>Executive Tier 2026</strong></span>
                  <span>•</span>
                  <span>Status: <strong className="text-success">RELEASED</strong></span>
                </div>
              </div>

              <div className="shrink-0 flex items-center space-x-2">
                <div className="px-3 py-1.5 rounded-sm bg-success-light border border-success/20 text-success text-xs font-bold flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-success" />
                  <span>Anti-Cheat Verified</span>
                </div>
              </div>
            </div>

            {/* Key Score Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border border-b border-border bg-background/50">
              <div className="p-5 text-center">
                <div className="text-xs font-semibold text-muted mb-1">Overall Percentile</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-heading">94.8%</div>
                <div className="text-[11px] font-semibold text-primary mt-1">Top 2% Globally</div>
              </div>
              <div className="p-5 text-center">
                <div className="text-xs font-semibold text-muted mb-1">Deductive Agility</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-heading">95 / 100</div>
                <div className="text-[11px] font-semibold text-purple mt-1">Analytical Lead</div>
              </div>
              <div className="p-5 text-center">
                <div className="text-xs font-semibold text-muted mb-1">Archetype</div>
                <div className="text-xl sm:text-2xl font-bold text-heading">The Catalyst</div>
                <div className="text-[11px] font-semibold text-success mt-1">Strategic Exec</div>
              </div>
              <div className="p-5 text-center">
                <div className="text-xs font-semibold text-muted mb-1">Reliability Index</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-heading">99.8%</div>
                <div className="text-[11px] font-semibold text-[#D97706] mt-1">High Validity</div>
              </div>
            </div>

            {/* Interactive Section Tabs */}
            <div className="flex border-b border-border px-6 sm:px-8 space-x-4 overflow-x-auto bg-surface">
              <button
                onClick={() => setActiveTab('dimensions')}
                className={cn(
                  'py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap',
                  activeTab === 'dimensions'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body hover:text-heading'
                )}
              >
                1. Dimension Breakdown
              </button>
              <button
                onClick={() => setActiveTab('archetype')}
                className={cn(
                  'py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap',
                  activeTab === 'archetype'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body hover:text-heading'
                )}
              >
                2. Behavioral Archetype
              </button>
              <button
                onClick={() => setActiveTab('trajectory')}
                className={cn(
                  'py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap',
                  activeTab === 'trajectory'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body hover:text-heading'
                )}
              >
                3. Leadership &amp; Blindspots
              </button>
              <button
                onClick={() => setActiveTab('actionPlan')}
                className={cn(
                  'py-4 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap',
                  activeTab === 'actionPlan'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-body hover:text-heading'
                )}
              >
                4. 90-Day Action Plan
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 sm:p-8 lg:p-10">
              {/* Tab 1: Dimensions */}
              {activeTab === 'dimensions' && (
                <div className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-heading">Multi-Factor Cognitive &amp; Behavioral Matrix</h3>
                    <p className="text-xs sm:text-sm text-body mt-1">
                      Scores benchmarked against our standard executive cohort. A score of 90+ denotes top-decile execution capability.
                    </p>
                  </div>

                  <div className="space-y-5">
                    {dimensionData.map((d, idx) => (
                      <div key={idx} className="p-5 rounded-xl bg-background border border-border">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <span className="font-bold text-sm text-heading">{d.title}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-primary">{d.tier}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-primary/10 text-primary">
                              {d.score}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-2 w-full bg-surface rounded-full overflow-hidden mb-3 border border-border">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-700"
                            style={{ width: `${d.score}%` }}
                          />
                        </div>

                        <p className="text-xs text-body leading-relaxed">{d.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Archetype */}
              {activeTab === 'archetype' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-light-blue via-surface to-background border border-[#D4E4FC]">
                    <div className="flex items-center space-x-3 mb-3">
                      <IconBox icon={Sparkles} color="purple" size="md" />
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          Primary Behavioral Archetype
                        </span>
                        <h3 className="text-xl font-bold text-heading">The Strategic Catalyst</h3>
                      </div>
                    </div>
                    <p className="text-sm text-body leading-relaxed">
                      Candidates aligned with <strong>The Strategic Catalyst</strong> archetype operate with exceptional clarity in ambiguous operating environments. They naturally synthesize complex quantitative constraints into rapid, decisive action while maintaining high emotional composure and team confidence.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-5 rounded-xl bg-background border border-border">
                      <h4 className="text-sm font-bold text-heading mb-3 flex items-center text-primary">
                        <Target className="w-4 h-4 mr-2" />
                        Dominant Decision Pattern
                      </h4>
                      <p className="text-xs text-body leading-relaxed">
                        Employs inductive reasoning backed by empirical guardrails. Rather than over-indexing on consensus, they build rapid prototypes or test cohorts to validate strategic hypotheses.
                      </p>
                    </div>

                    <div className="p-5 rounded-xl bg-background border border-border">
                      <h4 className="text-sm font-bold text-heading mb-3 flex items-center text-success">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Stakeholder &amp; Influence Style
                      </h4>
                      <p className="text-xs text-body leading-relaxed">
                        Articulate and outcome-driven. Solicits candid feedback early to de-risk high-stakes initiatives, inspiring confidence through structured objective roadmaps.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Trajectory & Blindspots */}
              {activeTab === 'trajectory' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    <div className="p-6 rounded-xl bg-surface border border-border shadow-xs">
                      <h4 className="text-base font-bold text-heading mb-4 flex items-center text-success">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Validated Strengths
                      </h4>
                      <ul className="space-y-3 text-xs text-body">
                        <li className="flex items-start space-x-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                          <span><strong>High Stress Dissipation:</strong> Maintains cognitive accuracy during tight turnaround deadlines.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                          <span><strong>Cross-Functional Alignment:</strong> Bridges technical architecture with commercial business KPIs.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                          <span><strong>Disciplined Iteration:</strong> Unafraid to pivot under disconfirming empirical telemetry.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Blindspots */}
                    <div className="p-6 rounded-xl bg-surface border border-border shadow-xs">
                      <h4 className="text-base font-bold text-heading mb-4 flex items-center text-[#D97706]">
                        <Sliders className="w-5 h-5 mr-2" />
                        Identified Blindspots &amp; Risks
                      </h4>
                      <ul className="space-y-3 text-xs text-body">
                        <li className="flex items-start space-x-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
                          <span><strong>Execution Impatience:</strong> May inadvertently outpace team members during exploratory phases.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
                          <span><strong>Under-Documentation:</strong> Preference for rapid execution can lead to informal institutional memory.</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D97706] mt-1.5 shrink-0" />
                          <span><strong>High Autonomous Burden:</strong> Reluctance to delegate analytical modeling in crunch periods.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: 90-Day Action Plan */}
              {activeTab === 'actionPlan' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-xl bg-background border border-border">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                      Month 01 (Days 1 - 30) • Strategic Calibration
                    </span>
                    <h4 className="text-sm font-bold text-heading mt-1 mb-2">
                      Formalize Delegation &amp; Decision Frameworks
                    </h4>
                    <p className="text-xs text-body leading-relaxed">
                      Implement two-way door decision protocols to empower leads. Establish weekly asynchronous memos to bridge communication gaps without slowing execution velocity.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-background border border-border">
                    <span className="text-[11px] font-bold text-success uppercase tracking-wider">
                      Month 02 (Days 31 - 60) • Influence Expansion
                    </span>
                    <h4 className="text-sm font-bold text-heading mt-1 mb-2">
                      Cross-Functional Stakeholder Alignment
                    </h4>
                    <p className="text-xs text-body leading-relaxed">
                      Host strategic sprint workshops with adjacent departmental leads. Benchmark team velocity metrics and identify operational bottlenecks early.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-background border border-border">
                    <span className="text-[11px] font-bold text-purple uppercase tracking-wider">
                      Month 03 (Days 61 - 90) • Executive Presence
                    </span>
                    <h4 className="text-sm font-bold text-heading mt-1 mb-2">
                      High-Leverage Mentorship &amp; Systemic Benchmarking
                    </h4>
                    <p className="text-xs text-body leading-relaxed">
                      Transition from direct executor to organizational multiplier. Re-evaluate cognitive metrics with a follow-up assessment to measure growth velocity.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Document Footer Callout */}
            <div className="p-6 bg-surface-secondary border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-body">
                <span>Want to uncover your own multi-dimensional diagnostic report?</span>
              </div>
              <Link href="/products">
                <Button variant="primary" size="md" className="font-semibold shadow-xs">
                  Take Your Assessment <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

