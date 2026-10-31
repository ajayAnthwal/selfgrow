'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { FormField } from '@/components/ui/FormField';
import { Select } from '@/components/ui/Select';
import { IconBox } from '@/components/ui/IconBox';
import { useToast } from '@/components/ui/Toast';
import {
  Building2,
  Users2,
  ShieldCheck,
  BarChart4,
  Layers,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  Award,
  Clock,
  Send,
} from 'lucide-react';

export default function EnterprisePage() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [teamSize, setTeamSize] = useState('50-200');
  const [assessmentVolume, setAssessmentVolume] = useState('100-500');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !workEmail) {
      toast({
        title: 'Please fill in your company name and work email.',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setCompanyName('');
      setWorkEmail('');
      setNotes('');
      toast({
        title: 'Enterprise Inquiry Received!',
        description: 'An enterprise talent solutions advisor will contact you within 4 business hours.',
        variant: 'success',
      });
    }, 600);
  };

  const solutions = [
    {
      icon: Users2,
      color: 'purple' as const,
      title: 'Executive & Lateral Hiring',
      desc: 'Eliminate subjective interviews. Benchmark candidates on deductive speed, leadership composure, and high-stakes decision agility.',
    },
    {
      icon: BarChart4,
      color: 'blue' as const,
      title: 'Cohort Talent Analytics',
      desc: 'Compare departmental cohorts, identify rising high-potentials (HiPo), and spot skill gaps across technical and managerial pipelines.',
    },
    {
      icon: Layers,
      color: 'green' as const,
      title: 'Custom Scoring Weightings',
      desc: 'Tailor dimension benchmarks to your company DNA. Prioritize analytical deduction for engineering or interpersonal EQ for sales leadership.',
    },
    {
      icon: ShieldCheck,
      color: 'orange' as const,
      title: 'Dedicated VPC & DPDP Compliance',
      desc: 'Full data isolation, single sign-on (SSO/SAML), role-based audit logging, and automated compliance certificates for audit readiness.',
    },
  ];

  const enterpriseFeatures = [
    'Bulk candidate invitation links with custom expiration windows',
    'Real-time recruiter dashboard with pass/fail threshold flags',
    'Bilingual candidate evaluations (English & हिन्दी parity)',
    'Automated PDF report dispatch to hiring managers and candidates',
    'Dedicated customer success manager & psychometrician onboarding',
    'Custom branding and company-branded evaluation briefing screens',
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border bg-gradient-to-b from-light-blue/50 via-background to-background">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-surface text-navy text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-border shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              Enterprise &amp; Organizational Talent Intelligence
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-heading max-w-4xl mx-auto leading-[1.15]">
            Scale Your Talent Decisions with <span className="text-primary">Precision AI Diagnostics</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-body max-w-2xl mx-auto leading-relaxed">
            From lateral hiring to leadership succession planning, empower your HR leaders and executives with objective psychometric benchmarks and automated evaluation reports.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="#enterprise-form">
              <Button variant="primary" size="lg" className="shadow-xs font-semibold">
                Request Enterprise Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Link href="/sample-report">
              <Button variant="outline" size="lg" className="font-semibold">
                Inspect Sample Executive Report
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Solutions Grid */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <SectionHeader
            badge="Enterprise Capabilities"
            title="Engineered for High-Stakes Talent Decisions"
            subtitle="Transforming talent acquisition, leadership development, and organizational bench strength."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {solutions.map((sol, idx) => (
              <Card key={idx} className="p-8 border-border bg-surface shadow-card hover:border-primary/40 transition-all">
                <div className="flex items-start space-x-4">
                  <IconBox icon={sol.icon} color={sol.color} size="lg" />
                  <div>
                    <h3 className="text-lg font-bold text-heading mb-2">
                      {sol.title}
                    </h3>
                    <p className="text-sm text-body leading-relaxed">
                      {sol.desc}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Feature Checklist Strip */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-light-blue px-3 py-1 rounded-full mb-3">
                Built For Enterprise Teams
              </span>
              <h2 className="text-3xl font-bold text-heading tracking-tight">
                Enterprise Reliability, Security &amp; Scale
              </h2>
              <p className="mt-3 text-sm text-body leading-relaxed">
                Whether assessing 10 executive candidates or 10,000 campus graduates, SelfGrow delivers instant high-fidelity diagnostic reports with zero recruiter bottleneck.
              </p>
              <div className="mt-6 flex items-center space-x-3 text-xs font-semibold text-heading">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>SOC-2 Type II Aligned &amp; DPDP 2023 Compliant</span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {enterpriseFeatures.map((feat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-background border border-border flex items-start space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-heading leading-relaxed">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Enterprise Inquiry Form */}
      <section id="enterprise-form" className="py-20 bg-background scroll-mt-20">
        <div className="max-w-[900px] mx-auto px-4 lg:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-light-blue px-3 py-1 rounded-full mb-3">
              Consult Our Talent Team
            </span>
            <h2 className="text-3xl font-bold text-heading">
              Request an Enterprise Pilot
            </h2>
            <p className="mt-2 text-sm text-body">
              Tell us about your organization&apos;s evaluation volume and our psychometric consulting team will tailor a custom demo.
            </p>
          </div>

          <Card className="p-8 sm:p-10 border-border bg-surface shadow-card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Company Name" required>
                  <Input
                    placeholder="Acme Technologies Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </FormField>

                <FormField label="Work Email" required>
                  <Input
                    type="email"
                    placeholder="talent@company.com"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField label="Organization Size">
                  <Select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    options={[
                      { value: '10-50', label: '10 - 50 employees' },
                      { value: '50-200', label: '50 - 200 employees' },
                      { value: '200-1000', label: '200 - 1,000 employees' },
                      { value: '1000+', label: '1,000+ Enterprise' },
                    ]}
                  />
                </FormField>

                <FormField label="Estimated Annual Assessments">
                  <Select
                    value={assessmentVolume}
                    onChange={(e) => setAssessmentVolume(e.target.value)}
                    options={[
                      { value: '50-100', label: '50 - 100 evaluations' },
                      { value: '100-500', label: '100 - 500 evaluations' },
                      { value: '500-2500', label: '500 - 2,500 evaluations' },
                      { value: '2500+', label: '2,500+ High Volume' },
                    ]}
                  />
                </FormField>
              </div>

              <FormField label="Evaluation Objectives & Specific Needs">
                <Textarea
                  placeholder="Tell us about the roles you are hiring for, custom dimensions required, or timeline for rollout..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </FormField>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isFullWidth
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  className="font-bold shadow-xs"
                >
                  Submit Enterprise Inquiry
                </Button>
                <p className="text-[11px] text-center text-muted mt-3">
                  We guarantee zero spam. Your organization data is protected under our strict enterprise NDA policy.
                </p>
              </div>
            </form>
          </Card>
        </div>
      </section>
    </div>
  );
}

