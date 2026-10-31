'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';
import {
  Sparkles,
  Brain,
  ShieldCheck,
  Target,
  Users,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  Lock,
} from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Evaluations Completed', value: '50,000+', change: '+124% this year' },
    { label: 'Psychometric Reliability', value: '99.4%', change: 'Cronbach Alpha 0.91' },
    { label: 'Corporate & Academic Users', value: '180+', change: 'Across 14 industries' },
    { label: 'Report Generation Speed', value: '< 90s', change: 'Instant AI Synthesis' },
  ];

  const pillars = [
    {
      icon: Brain,
      color: 'purple' as const,
      title: 'Psychometrically Grounded',
      description:
        'Every question, scoring scale, and dimension archetype is grounded in established psychometric frameworks and cognitive aptitude benchmarking.',
    },
    {
      icon: Sparkles,
      color: 'blue' as const,
      title: 'Next-Gen AI Diagnostic Synthesis',
      description:
        'Instead of generic cookie-cutter templates, our LLM engine analyzes nuanced dimension interactions to generate custom behavioral blueprints.',
    },
    {
      icon: ShieldCheck,
      color: 'green' as const,
      title: 'DPDP 2023 & Enterprise Privacy',
      description:
        'Your assessment data is strictly confidential. Zero third-party training leakage, encrypted storage, and full right to erasure compliance.',
    },
    {
      icon: Target,
      color: 'orange' as const,
      title: 'Actionable Career Trajectories',
      description:
        'We go beyond scores. Every report provides a 90-day concrete development plan, high-fit leadership roles, and behavioral blindspots.',
    },
  ];

  const teamValues = [
    {
      title: 'Scientific Objectivity',
      desc: 'Our scoring algorithms use normative standard distributions (μ=100, σ=15) to guarantee fair, unbiased talent evaluations.',
    },
    {
      title: 'Radical Privacy by Design',
      desc: 'Candidate responses are never used for public LLM training or sold to third-party advertisers.',
    },
    {
      title: 'Bilingual Equity (EN & HI)',
      desc: 'Equal-fidelity psychometric evaluations crafted natively in both English and Hindi with culturally balanced context.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border bg-gradient-to-b from-light-blue/50 via-background to-background">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-surface text-navy text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-border shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              Our Mission &amp; Foundation
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-heading max-w-4xl mx-auto leading-[1.15]">
            Bridging Human Psychology with <span className="text-primary">Intelligent Diagnostics</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-body max-w-2xl mx-auto leading-relaxed">
            SelfGrow was engineered to empower professionals, candidates, and enterprise teams with precision psychometric evaluations that uncover true cognitive potential and actionable leadership trajectories.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" size="lg" className="shadow-xs font-semibold">
                Explore Assessments <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/methodology">
              <Button variant="outline" size="lg" className="font-semibold">
                View Scientific Methodology
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="py-12 bg-surface border-b border-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-background border border-border/80">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-heading tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-heading mt-1">
                  {s.label}
                </div>
                <div className="text-[11px] text-primary font-medium mt-1">
                  {s.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Pillars */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <SectionHeader
            badge="The Foundation"
            title="Built on Four Rigorous Standards"
            subtitle="How SelfGrow transforms raw assessment answers into deep executive diagnostic intelligence."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {pillars.map((pillar, idx) => (
              <Card key={idx} className="p-8 border-border bg-surface shadow-card hover:border-primary/40 transition-all">
                <div className="flex items-start space-x-4">
                  <IconBox icon={pillar.icon} color={pillar.color} size="lg" />
                  <div>
                    <h3 className="text-lg font-bold text-heading mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-body leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Values & Ethics */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-light-blue px-3 py-1 rounded-full mb-3">
              Integrity &amp; Trust
            </span>
            <h2 className="text-3xl font-bold text-heading">
              Ethical AI and Transparent Standards
            </h2>
            <p className="mt-3 text-sm text-body leading-relaxed">
              We believe talent intelligence must be fair, auditable, and respectful of personal dignity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamValues.map((val, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-background border border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm mb-4">
                  0{idx + 1}
                </div>
                <h4 className="text-base font-bold text-heading mb-2">{val.title}</h4>
                <p className="text-xs text-body leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-light-blue via-surface to-background text-center">
        <div className="max-w-[800px] mx-auto px-4 lg:px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-heading">
            Ready to Begin Your Evaluation?
          </h2>
          <p className="mt-4 text-base text-body">
            Choose from our psychometric and cognitive assessments and receive your personalized AI diagnostic report within minutes.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/products">
              <Button variant="primary" size="lg" className="shadow-xs font-semibold">
                View Available Assessments <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

