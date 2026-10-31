'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Brain,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface FaqItem {
  question: string;
  answer: string;
  category: 'assessments' | 'reports' | 'billing' | 'privacy';
}

const FAQ_DATA: FaqItem[] = [
  // Assessments
  {
    category: 'assessments',
    question: 'How do the psychometric and cognitive assessments work?',
    answer:
      'Each assessment consists of scientifically curated single-choice, multiple-choice, or situational judgment questions. Once started, a server-synchronized timer tracks your session while answers are automatically saved to our encrypted backend in real time.',
  },
  {
    category: 'assessments',
    question: 'Can I pause an assessment and resume it later?',
    answer:
      'Timed assessments must be completed in a single session before the countdown timer expires. If your browser accidentally closes or your connection drops, you can instantly resume from the same question where you left off as long as the test time limit has not passed.',
  },
  {
    category: 'assessments',
    question: 'Can I take the assessment in Hindi (हिन्दी)?',
    answer:
      'Yes! SelfGrow is natively bilingual. You can switch the evaluation language between English and Hindi at any time before beginning. The questions, instructions, and generated AI diagnostic reports are rendered with full cultural and psychometric parity.',
  },
  {
    category: 'assessments',
    question: 'What happens if my timer runs out during the assessment?',
    answer:
      'When the allocated time limit runs out, your session is automatically locked and all saved answers are submitted for diagnostic scoring. You are not penalized for unfinished optional questions, but completed responses are weighted accordingly.',
  },

  // AI Reports & Scoring
  {
    category: 'reports',
    question: 'How long does it take to receive my AI diagnostic report?',
    answer:
      'Our background report pipeline generates publication-ready PDF reports in under 90 seconds. Once your answers are submitted, our GPT-4o psychometric engine calculates normative dimension percentiles, generates executive summaries, and compiles a comprehensive downloadable PDF.',
  },
  {
    category: 'reports',
    question: 'What is included in the evaluation report?',
    answer:
      'Every report includes: (1) Executive Cognitive Summary, (2) Multi-dimensional Percentile Scores benchmarked against normal bell-curves (μ=100, σ=15), (3) Behavioral Archetype Breakdown, (4) Leadership Blindspots & Strengths, and (5) A practical 90-Day Action & Career Trajectory Plan.',
  },
  {
    category: 'reports',
    question: 'Where can I find and download my completed reports?',
    answer:
      'All your past evaluation reports are permanently accessible in your Candidate Dashboard under the "Reports" tab (/account/reports). You can view the live status tracker or download the secure high-resolution PDF anytime.',
  },

  // Billing & Payments
  {
    category: 'billing',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major payment methods powered securely by Razorpay, including UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards (Visa, Mastercard, RuPay), NetBanking from 50+ banks, and popular digital wallets.',
  },
  {
    category: 'billing',
    question: 'Are there any free evaluations available?',
    answer:
      'Yes, we offer a Free Leadership Sampler evaluation that takes under 5 minutes and delivers an instant diagnostic preview of executive cognitive metrics with zero credit card required.',
  },
  {
    category: 'billing',
    question: 'Do you offer GST invoices for corporate reimbursements?',
    answer:
      'Yes! Every completed transaction generates an itemized tax invoice accessible directly from your candidate order receipt (/account/orders/[id]). You can download or print it for tax or employer reimbursement.',
  },

  // Privacy & DPDP
  {
    category: 'privacy',
    question: 'Is my assessment data protected under DPDP 2023?',
    answer:
      'Absolutely. SelfGrow is engineered in strict compliance with the Digital Personal Data Protection (DPDP) Act 2023. We enforce end-to-end encryption in transit (TLS 1.3) and at rest (AES-256), and we never leak individual question scores or dimensions to unauthorized third parties.',
  },
  {
    category: 'privacy',
    question: 'Are my answers used to train public AI models?',
    answer:
      'No. We operate under strict enterprise API agreements with zero-data retention for AI model training. Your responses, scores, and personal data are strictly isolated to your own profile and report generation.',
  },
  {
    category: 'privacy',
    question: 'Can I export or delete my personal data?',
    answer:
      'Yes. In accordance with DPDP data portability and right to erasure, you can request a machine-readable JSON export of your complete profile and test attempts or request irreversible account anonymization directly through our privacy portal.',
  },
];

export default function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'assessments', label: 'Taking Assessments' },
    { id: 'reports', label: 'AI Reports & Scoring' },
    { id: 'billing', label: 'Payments & Billing' },
    { id: 'privacy', label: 'Data Privacy & DPDP' },
  ];

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesQuery =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-border bg-gradient-to-b from-light-blue/40 via-background to-background">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-surface text-navy text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-border shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            <span className="tracking-wide uppercase text-[11px] font-bold">
              Help Center &amp; Common Queries
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-heading max-w-4xl mx-auto leading-[1.15]">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-body max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our psychological evaluations, automated AI report generation, payments, and data privacy.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search questions (e.g. Hindi, reports, payment, privacy)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3.5 text-sm bg-surface shadow-xs border-border"
            />
          </div>
        </div>
      </section>

      {/* 2. Category Filter & Accordion Content */}
      <section className="py-16">
        <div className="max-w-[900px] mx-auto px-4 lg:px-6">
          {/* Category Tabs */}
          <div className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border',
                  selectedCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface text-body border-border hover:border-primary/40'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <Card
                    key={idx}
                    className={cn(
                      'border-border bg-surface transition-all overflow-hidden',
                      isOpen ? 'border-primary/40 shadow-xs' : 'hover:border-border/80'
                    )}
                  >
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-heading text-base sm:text-lg"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          'w-5 h-5 text-muted shrink-0 transition-transform duration-200',
                          isOpen && 'transform rotate-180 text-primary'
                        )}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-body leading-relaxed border-t border-border/50">
                        {faq.answer}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center border-border bg-surface">
              <HelpCircle className="w-10 h-10 text-muted mx-auto mb-3" />
              <h3 className="text-lg font-bold text-heading">No matching questions found</h3>
              <p className="text-sm text-body mt-1">
                Try searching with different keywords or browse our categories.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4"
              >
                Reset Filters
              </Button>
            </Card>
          )}

          {/* Still Have Questions Box */}
          <div className="mt-16 p-8 rounded-2xl bg-surface border border-border shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-light-blue flex items-center justify-center text-primary mx-auto mb-4">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-heading">
              Still have questions or need assistance?
            </h3>
            <p className="mt-2 text-sm text-body max-w-md mx-auto">
              Our support team and psychometric advisors are here to help you get the most out of your evaluation.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link href="/contact">
                <Button variant="primary" size="md" className="font-semibold shadow-xs">
                  Contact Support Team <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

