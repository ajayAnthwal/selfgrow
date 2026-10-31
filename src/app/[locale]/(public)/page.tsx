import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { IconBox } from '@/components/ui/IconBox';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProductCard, ProductItem } from '@/features/products/ProductCard';
import {
  Sparkles,
  ArrowRight,
  ClipboardList,
  Timer,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Globe2,
  Brain,
  Search,
  Bell,
  LayoutDashboard,
  FileText,
  BarChart3,
  Sliders,
  Check,
  Download,
  Lock,
} from 'lucide-react';

async function getFeaturedProducts(locale: string): Promise<ProductItem[]> {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const res = await fetch(`${backendUrl}/api/v1/products?limit=3&lang=${locale}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.items || [];
  } catch {
    return [];
  }
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('home');
  const tNav = await getTranslations('nav');
  const featuredProducts = await getFeaturedProducts(locale);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-light-blue/80 via-light-blue/20 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 text-center relative z-10">
          {/* Top Innovation Pill */}
          <div className="inline-flex items-center space-x-2 bg-surface text-navy text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-border shadow-xs hover:border-primary/40 transition-all">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              {t('heroBadge') || 'Next-Gen Psychometric AI'}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-heading max-w-4xl mx-auto leading-[1.15]">
            Discover Your <span className="text-primary">True Potential</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-body max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle') ||
              'Evidence-based cognitive and talent evaluations with deep actionable AI diagnostic reports in English and हिन्दी.'}
          </p>

          {/* Perfectly Aligned Hero Action Buttons */}
          <div className="mt-8 flex flex-row items-center justify-center gap-3.5">
            <Link href="/products" className="inline-block">
              <Button
                size="lg"
                variant="primary"
                className="h-[50px] px-8 text-[15px] font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                rightIcon={<ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />}
              >
                <span>{t('heroCta') || 'Explore Assessments'}</span>
              </Button>
            </Link>
            <a href="#how-it-works" className="inline-block">
              <Button
                size="lg"
                variant="outline"
                className="h-[50px] px-8 text-[15px] font-semibold rounded-xl bg-surface hover:bg-surface-secondary text-heading border-border shadow-xs transition-all"
              >
                <span>{t('heroSecondaryCta') || 'How It Works'}</span>
              </Button>
            </a>
          </div>

          {/* 2. Premium SaaS Application Mockup (Finexa Style) */}
          <div className="mt-14 sm:mt-16 max-w-5xl mx-auto text-left relative">
            {/* Ambient Background Grid Nodes */}
            <div className="absolute -inset-4 bg-gradient-to-b from-light-blue/40 to-transparent rounded-3xl -z-10 blur-xl pointer-events-none" />

            {/* Window Outer Card with Glassmorphic Border */}
            <div className="rounded-2xl p-1.5 sm:p-2 bg-gradient-to-b from-white via-white/80 to-[#EAF2FF] border border-border shadow-2xl shadow-primary/10">
              <div className="rounded-xl bg-surface border border-border overflow-hidden">
                {/* Application Header Bar */}
                <div className="h-14 bg-surface px-4 sm:px-6 border-b border-border flex items-center justify-between gap-4">
                  {/* Left: Window Controls + Logo */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="flex space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                    </div>
                    <div className="h-4 w-[1px] bg-border mx-1" />
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-white">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-sm text-heading hidden sm:inline">SelfGrow OS</span>
                    </div>
                  </div>

                  {/* Center: Search Bar */}
                  <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
                    <div className="w-full relative flex items-center">
                      <Search className="w-4 h-4 text-muted absolute left-3 pointer-events-none" />
                      <div className="w-full h-8 pl-9 pr-14 bg-surface-secondary border border-border rounded-lg text-xs text-muted flex items-center">
                        Search dimensions, reports, or percentiles...
                      </div>
                      <span className="absolute right-2 px-1.5 py-0.5 text-[10px] font-semibold bg-surface border border-border text-muted rounded">
                        ⌘K
                      </span>
                    </div>
                  </div>

                  {/* Right: Notifications + User Pill */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-body relative">
                      <Bell className="w-4 h-4" />
                      <span className="w-2 h-2 rounded-full bg-primary absolute top-1.5 right-1.5" />
                    </div>
                    <div className="flex items-center space-x-2 pl-2 border-l border-border">
                      <div className="w-7 h-7 rounded-full bg-light-blue text-primary font-bold text-xs flex items-center justify-center border border-primary/20">
                        AM
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="text-xs font-bold text-heading leading-tight">Dr. Aarav Mehta</div>
                        <div className="text-[10px] text-muted">Executive Candidate</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Body: Sidebar + Main Content */}
                <div className="flex flex-col md:flex-row">
                  {/* Left Mini Sidebar */}
                  <div className="hidden md:flex flex-col w-48 bg-surface border-r border-border p-3 space-y-1">
                    <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg bg-light-blue text-primary font-semibold text-xs">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Executive Hub</span>
                    </div>
                    <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-body hover:bg-surface-secondary font-medium text-xs">
                      <FileText className="w-4 h-4" />
                      <span>Assessments</span>
                    </div>
                    <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-body hover:bg-surface-secondary font-medium text-xs">
                      <BarChart3 className="w-4 h-4" />
                      <span>Analytics</span>
                    </div>
                    <div className="flex items-center space-x-2.5 px-3 py-2 rounded-lg text-body hover:bg-surface-secondary font-medium text-xs">
                      <Lock className="w-4 h-4" />
                      <span>DPDP Compliance</span>
                    </div>
                  </div>

                  {/* Main Dashboard Panel */}
                  <div className="flex-1 p-5 sm:p-7 bg-[#FAFCFF] space-y-6">
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
                      <div>
                        <div className="flex items-center space-x-2.5">
                          <h3 className="text-lg sm:text-xl font-bold text-heading">
                            Executive Cognitive &amp; Leadership Profile
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-light text-success border border-[#CAEEDC]">
                            98th Percentile
                          </span>
                        </div>
                        <p className="text-xs text-muted mt-1">
                          Assessment ID #AGY-9821 • Benchmarked against 14,000+ Senior Professionals
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-light-blue text-primary font-semibold px-2.5 py-1 rounded-md border border-[#D4E4FC]">
                          EN / हिन्दी
                        </span>
                        <div className="flex items-center space-x-1 text-xs bg-surface text-heading font-semibold px-2.5 py-1 rounded-md border border-border shadow-xs">
                          <Download className="w-3.5 h-3.5 text-primary" />
                          <span>PDF Ready</span>
                        </div>
                      </div>
                    </div>

                    {/* 4 Finexa-Style Top Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {/* Metric 1 */}
                      <div className="p-4 bg-surface rounded-xl border border-border shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-muted">Cognitive Velocity</span>
                          <IconBox icon={Zap} color="blue" size="sm" />
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-heading">96%</div>
                        <div className="text-[11px] font-semibold text-success mt-1 flex items-center">
                          <span>↑ 14% vs benchmark</span>
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="p-4 bg-surface rounded-xl border border-border shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-muted">Analytical Synthesis</span>
                          <IconBox icon={Brain} color="purple" size="sm" />
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-heading">94 / 100</div>
                        <div className="text-[11px] font-semibold text-purple mt-1 flex items-center">
                          <span>Top 1.8% Tier</span>
                        </div>
                      </div>

                      {/* Metric 3 */}
                      <div className="p-4 bg-surface rounded-xl border border-border shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-muted">Decision Agility</span>
                          <IconBox icon={Sliders} color="green" size="sm" />
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-heading">92%</div>
                        <div className="text-[11px] font-semibold text-success mt-1 flex items-center">
                          <span>High Execution</span>
                        </div>
                      </div>

                      {/* Metric 4 */}
                      <div className="p-4 bg-surface rounded-xl border border-border shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-muted">Integrity Score</span>
                          <IconBox icon={ShieldCheck} color="orange" size="sm" />
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-heading">99.9%</div>
                        <div className="text-[11px] font-semibold text-[#D97706] mt-1 flex items-center">
                          <span>Anti-Cheat Verified</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Split: Dimension Breakdown + AI Synthesis */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
                      {/* Left: Psychometric Dimension Spectrum (7 cols) */}
                      <div className="lg:col-span-7 bg-surface p-5 rounded-xl border border-border shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-heading">
                            Psychometric Dimension Breakdown
                          </span>
                          <span className="text-xs font-semibold text-primary">Standard Normal (μ=100, σ=15)</span>
                        </div>

                        {/* Dimension 1 */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1.5 text-heading">
                            <span>Logical &amp; Critical Deduction</span>
                            <span className="text-primary font-bold">95%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-[95%]" />
                          </div>
                        </div>

                        {/* Dimension 2 */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1.5 text-heading">
                            <span>Strategic &amp; Scenario Versatility</span>
                            <span className="text-purple font-bold">91%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-purple rounded-full w-[91%]" />
                          </div>
                        </div>

                        {/* Dimension 3 */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1.5 text-heading">
                            <span>Adaptive Problem Velocity</span>
                            <span className="text-success font-bold">89%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full w-[89%]" />
                          </div>
                        </div>

                        {/* Dimension 4 */}
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1.5 text-heading">
                            <span>Contextual Clarity &amp; Leadership EQ</span>
                            <span className="text-primary font-bold">94%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-[94%]" />
                          </div>
                        </div>
                      </div>

                      {/* Right: AI Synthesis Callout (5 cols) */}
                      <div className="lg:col-span-5 bg-gradient-to-br from-light-blue/40 via-surface to-surface-secondary p-5 rounded-xl border border-[#D4E4FC] shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-2.5">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold text-heading uppercase tracking-wider">
                              AI Diagnostic Synthesis
                            </span>
                          </div>
                          <p className="text-xs text-body leading-relaxed italic">
                            &ldquo;Candidate displays pronounced cognitive composure under time constraints, excelling in multi-dimensional problem solving with evidence-backed decision speed.&rdquo;
                          </p>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <span className="text-[10px] font-semibold bg-surface px-2 py-0.5 rounded-full border border-border text-heading">
                              #StrategicAgility
                            </span>
                            <span className="text-[10px] font-semibold bg-surface px-2 py-0.5 rounded-full border border-border text-heading">
                              #HighDecisiveness
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
                          <span>Engine: GPT-4o Psychometric</span>
                          <span className="text-success font-semibold flex items-center">
                            Verified <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-success" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4-Feature Strip */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start space-x-4">
              <IconBox icon={Sparkles} color="purple" size="md" />
              <div>
                <h4 className="text-base font-semibold text-heading">Personalized Reports</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">
                  Tailored insights highlighting strengths, blindspots, and career trajectories.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <IconBox icon={ShieldCheck} color="blue" size="md" />
              <div>
                <h4 className="text-base font-semibold text-heading">Secure &amp; Private</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">
                  Full DPDP 2023 compliance with zero score leakage and encrypted responses.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <IconBox icon={Globe2} color="green" size="md" />
              <div>
                <h4 className="text-base font-semibold text-heading">Multi-Language</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">
                  Seamlessly take assessments and receive generated PDFs in English or हिन्दी.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <IconBox icon={Zap} color="orange" size="md" />
              <div>
                <h4 className="text-base font-semibold text-heading">Instant Delivery</h4>
                <p className="text-xs text-body mt-1 leading-relaxed">
                  Automated background generation delivers publication-ready PDF in &lt; 90 seconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Featured Reports Catalog */}
      <section className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <SectionHeader
            badge="Our Assessments"
            title="Choose Your Report"
            subtitle="Curated evaluations benchmarked across psychological and analytical standards."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <>
                <ProductCard
                  product={{
                    id: '1',
                    slug: 'personality-dynamics',
                    priceInPaise: 49900,
                    name: 'Personality & Leadership Dynamics',
                    description: 'Understand your behavioral archetype, decision-making style, and leadership presence.',
                    currency: 'INR',
                    assessment: {
                      id: 'a1',
                      slug: 'personality-dynamics',
                      title: 'Personality & Leadership Dynamics',
                      description: 'Understand your behavioral archetype',
                      kind: 'OBJECTIVE',
                      timeLimitSeconds: 1200,
                      questionsCount: 30,
                    },
                  }}
                />
                <ProductCard
                  product={{
                    id: '2',
                    slug: 'career-aptitude',
                    priceInPaise: 79900,
                    name: 'Career & Cognitive Aptitude',
                    description: 'Identify highest-fit roles, industry trajectories, and critical thinking potential.',
                    currency: 'INR',
                    assessment: {
                      id: 'a2',
                      slug: 'career-aptitude',
                      title: 'Career & Cognitive Aptitude',
                      description: 'Identify highest-fit roles',
                      kind: 'MIXED',
                      timeLimitSeconds: 1500,
                      questionsCount: 35,
                    },
                  }}
                />
                <ProductCard
                  product={{
                    id: '3',
                    slug: 'emotional-resilience',
                    priceInPaise: 59900,
                    name: 'Emotional Resilience & EQ',
                    description: 'Measure stress handling, interpersonal adaptability, and cognitive composure.',
                    currency: 'INR',
                    assessment: {
                      id: 'a3',
                      slug: 'emotional-resilience',
                      title: 'Emotional Resilience & EQ',
                      description: 'Measure stress handling',
                      kind: 'OBJECTIVE',
                      timeLimitSeconds: 900,
                      questionsCount: 25,
                    },
                  }}
                />
              </>
            )}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button variant="outline" size="md" className="font-semibold bg-surface">
                <span>View All Assessments</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. How It Works: 3 Steps */}
      <section id="how-it-works" className="py-20 bg-surface border-y border-border">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <SectionHeader
            badge="Simple Process"
            title={t('howItWorksTitle') || 'How SelfGrow Works'}
            subtitle="A scientifically grounded testing procedure designed for candidate comfort and institutional precision."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center relative border-border hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-light-blue text-primary font-bold text-lg flex items-center justify-center mb-6">
                01
              </div>
              <h3 className="text-lg font-bold text-heading mb-2">
                {t('step1Title') || 'Choose & Register'}
              </h3>
              <p className="text-sm text-body leading-relaxed">
                {t('step1Desc') || 'Select the assessment tailored to your career or personal goals and set up your candidate profile.'}
              </p>
            </Card>

            <Card className="p-8 text-center relative border-border hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-light-blue text-primary font-bold text-lg flex items-center justify-center mb-6">
                02
              </div>
              <h3 className="text-lg font-bold text-heading mb-2">
                {t('step2Title') || 'Take Assessment'}
              </h3>
              <p className="text-sm text-body leading-relaxed">
                {t('step2Desc') || 'Answer adaptive questions in English or हिन्दी with our distraction-free, auto-saving interface.'}
              </p>
            </Card>

            <Card className="p-8 text-center relative border-border hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-full bg-light-blue text-primary font-bold text-lg flex items-center justify-center mb-6">
                03
              </div>
              <h3 className="text-lg font-bold text-heading mb-2">
                {t('step3Title') || 'Receive AI Report'}
              </h3>
              <p className="text-sm text-body leading-relaxed">
                {t('step3Desc') || 'Get a publication-grade, detailed psychometric diagnostic PDF delivered directly to your inbox.'}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Trust & Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <Card className="p-6">
              <div className="text-3xl font-bold text-primary">10,000+</div>
              <div className="text-xs sm:text-sm font-semibold text-heading mt-1">Reports Delivered</div>
              <div className="text-xs text-muted mt-0.5">Across India &amp; Global</div>
            </Card>
            <Card className="p-6">
              <div className="text-3xl font-bold text-primary">4.9 / 5</div>
              <div className="text-xs sm:text-sm font-semibold text-heading mt-1">Candidate Rating</div>
              <div className="text-xs text-muted mt-0.5">From 2,400+ reviews</div>
            </Card>
            <Card className="p-6">
              <div className="text-3xl font-bold text-primary">99.8%</div>
              <div className="text-xs sm:text-sm font-semibold text-heading mt-1">Client Satisfaction</div>
              <div className="text-xs text-muted mt-0.5">High accuracy rating</div>
            </Card>
            <Card className="p-6">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-xs sm:text-sm font-semibold text-heading mt-1">Data Privacy</div>
              <div className="text-xs text-muted mt-0.5">DPDP 2023 Compliant</div>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. Final CTA Banner */}
      <section className="py-16 bg-background">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
          <div className="bg-dark-navy text-white rounded-xl p-8 sm:p-14 text-center relative overflow-hidden shadow-hover">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-light-blue bg-white/10 px-3.5 py-1 rounded-full mb-4">
                Ready to level up?
              </span>
              <h2 className="text-3xl sm:text-4xl !text-white font-bold tracking-tight">
                Start Your SelfGrow Assessment Today
              </h2>
              <p className="mt-4 text-sm sm:text-base text-border leading-relaxed">
                Join thousands of students, professionals, and leaders who have unlocked their cognitive superpowers with evidence-backed AI evaluations.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/products">
                  <Button variant="primary" size="lg" className="h-12 px-8 font-semibold shadow-card">
                    <span>Explore All Reports</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
