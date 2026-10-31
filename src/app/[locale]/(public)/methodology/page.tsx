'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';
import {
  Brain,
  Sliders,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  BarChart3,
  FileCheck2,
  Workflow,
} from 'lucide-react';

export default function MethodologyPage() {
  const [activeTab, setActiveTab] = useState<'scoring' | 'pipeline' | 'integrity'>('scoring');

  const dimensions = [
    {
      name: 'Analytical Synthesis & Critical Deduction',
      code: 'COG-DED',
      benchmark: 'Top 5%',
      percentile: 95,
      description: 'Ability to isolate key variables, evaluate multi-factor problem sets, and deduce optimal pathways under incomplete data.',
    },
    {
      name: 'Behavioral Archetype & Executive Presence',
      code: 'PSY-ARCH',
      benchmark: 'Top 8%',
      percentile: 92,
      description: 'Measures decision assertiveness, emotional composure in ambiguity, and social influence in stakeholder negotiations.',
    },
    {
      name: 'Adaptive Problem Velocity (Speed vs. Accuracy)',
      code: 'COG-VEL',
      benchmark: 'Top 11%',
      percentile: 89,
      description: 'Calculates response latency trade-offs, penalizing rushed guesses while rewarding consistent deductive momentum.',
    },
    {
      name: 'Contextual Resilience & Workplace EQ',
      code: 'EQ-RES',
      benchmark: 'Top 6%',
      percentile: 94,
      description: 'Stress dissipation, interpersonal adaptability, and empathetic leadership calibration across remote and cross-functional teams.',
    },
  ];

  const pipelineStages = [
    {
      step: '01',
      title: 'Raw Response Ingestion & Anti-Cheat Validation',
      desc: 'Server-side timestamp synchronization logs time-to-answer for every question. Outliers and randomized answering patterns are scored for response reliability.',
    },
    {
      step: '02',
      title: 'Normative Dimension Standardization',
      desc: 'Raw scores are mapped onto standard normal bell-curves (mean μ=100, standard deviation σ=15) against established industry benchmarks.',
    },
    {
      step: '03',
      title: 'Deep Multi-Factor Interaction Analysis',
      desc: 'Our scoring engine measures how high cognitive velocity interacts with high EQ resilience, generating contextual archetypes rather than flat sum-scores.',
    },
    {
      step: '04',
      title: 'Deterministic AI Synthesis with Strict Output Schema',
      desc: 'Using structured output schemas (JSON-mode), the LLM generates tailored executive summaries, strengths, development gaps, and a concrete 90-day trajectory.',
    },
    {
      step: '05',
      title: 'Quality & Privacy Audit before Release',
      desc: 'Before delivery, reports pass an automated guardrail audit confirming zero score leakage, no hallucinated metrics, and strict DPDP confidentiality.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border bg-gradient-to-b from-light-blue/40 via-background to-background">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-surface text-navy text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-border shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <Brain className="w-3.5 h-3.5 text-primary" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              Scientific &amp; Analytical Framework
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-heading max-w-4xl mx-auto leading-[1.15]">
            The Science Behind Our <span className="text-primary">Diagnostic Intelligence</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-body max-w-2xl mx-auto leading-relaxed">
            Discover how SelfGrow combines psychometric normative models, server-side anti-cheat telemetry, and advanced AI synthesis to deliver enterprise-grade evaluation reports.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/sample-report">
              <Button variant="primary" size="lg" className="shadow-xs font-semibold">
                View Interactive Sample Report <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" size="lg" className="font-semibold">
                Explore Evaluations Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Interactive Methodology Showcase */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <SectionHeader
            badge="Scoring & Architecture"
            title="Normative Psychometric Dimensions"
            subtitle="Standardized on a bell-curve with mean μ=100 and standard deviation σ=15 to ensure cross-candidate comparability."
          />

          {/* Interactive Dimension Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {dimensions.map((dim, idx) => (
              <Card key={idx} className="p-6 sm:p-8 border-border bg-surface shadow-card hover:border-primary/40 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-light-blue px-2.5 py-1 rounded-sm">
                    {dim.code}
                  </span>
                  <span className="text-xs font-bold text-success bg-success-light px-2.5 py-1 rounded-sm">
                    {dim.benchmark}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-heading mb-2">
                  {dim.name}
                </h3>
                <p className="text-xs text-body leading-relaxed mb-5">
                  {dim.description}
                </p>

                {/* Percentile Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-heading mb-1.5">
                    <span>Normative Score</span>
                    <span className="text-primary font-bold">{dim.percentile}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${dim.percentile}%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. The 5-Step Diagnostic Pipeline */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <SectionHeader
            badge="The Processing Engine"
            title="How An Assessment Becomes a Diagnostic Report"
            subtitle="Every submission undergoes strict validation, normalization, and guardrailed LLM generation."
          />

          <div className="mt-12 space-y-4 max-w-4xl mx-auto">
            {pipelineStages.map((stage, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start p-6 rounded-xl bg-background border border-border hover:border-primary/30 transition-all gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary text-white font-mono font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                  {stage.step}
                </div>
                <div>
                  <h4 className="text-base font-bold text-heading mb-1.5">
                    {stage.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-body leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Scientific Integrity Strip */}
      <section className="py-16 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-surface border border-border shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-light-blue flex items-center justify-center text-primary mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-heading mb-2">High Test-Retest Reliability</h4>
              <p className="text-xs text-body leading-relaxed">
                Empirical tests demonstrate a Cronbach&apos;s alpha coefficient exceeding 0.91, ensuring consistent diagnostic accuracy across re-evaluation sessions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface border border-border shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-light-blue flex items-center justify-center text-primary mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-heading mb-2">Anti-Cheat Telemetry</h4>
              <p className="text-xs text-body leading-relaxed">
                Response duration, tab-switching telemetry, and question-level latency tracking prevent automated scripting, guessing, or third-party interference.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-surface border border-border shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-light-blue flex items-center justify-center text-primary mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-heading mb-2">Zero AI Training Leakage</h4>
              <p className="text-xs text-body leading-relaxed">
                We operate under enterprise API agreements where candidate evaluation prompts and outputs are never retained or used to train public language models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-light-blue via-surface to-background text-center border-t border-border">
        <div className="max-w-[800px] mx-auto px-4 lg:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-heading">
            Experience Our Scientific Evaluation
          </h2>
          <p className="mt-4 text-base text-body">
            Start with our psychometric or cognitive aptitude assessments and discover your multi-dimensional benchmark report.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" size="lg" className="shadow-xs font-semibold">
                Explore Assessments <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
