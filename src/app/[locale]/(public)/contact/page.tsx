'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { IconBox } from '@/components/ui/IconBox';
import { useToast } from '@/components/ui/Toast';
import { Mail, Clock, MapPin, Send, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('static');
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: 'Please fill in all fields',
        variant: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setName('');
      setEmail('');
      setMessage('');
      toast({
        title: 'Message sent successfully!',
        description: "Our support team will respond to your email within 24 hours.",
        variant: 'success',
      });
    }, 600);
  };

  return (
    <div className="py-12 lg:py-16 bg-background min-h-[75vh]">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-light-blue px-3 py-1 rounded-full mb-3">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-heading tracking-tight">
            {t('contactTitle') || 'Contact Our Team'}
          </h1>
          <p className="mt-3 text-base text-body">
            {t('contactIntro') ||
              'Have questions regarding our cognitive evaluations, enterprise licenses, or technical support? We are here to help.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-6 border-border shadow-card">
              <div className="flex items-start space-x-4">
                <IconBox icon={Mail} color="blue" size="md" />
                <div>
                  <h3 className="text-sm font-bold text-heading">Email Support</h3>
                  <p className="text-xs text-muted mt-1">Direct support for candidate &amp; report inquiries</p>
                  <a
                    href={`mailto:${t('supportEmail') || 'support@selfgrow.com'}`}
                    className="inline-block mt-2 text-sm font-bold text-primary hover:underline"
                  >
                    {t('supportEmail') || 'support@selfgrow.com'}
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border shadow-card">
              <div className="flex items-start space-x-4">
                <IconBox icon={Clock} color="purple" size="md" />
                <div>
                  <h3 className="text-sm font-bold text-heading">Operating Hours</h3>
                  <p className="text-xs text-muted mt-1">Monday – Saturday, IST</p>
                  <span className="inline-block mt-1 text-xs font-semibold text-heading">
                    9:00 AM – 7:00 PM IST
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border shadow-card">
              <div className="flex items-start space-x-4">
                <IconBox icon={MapPin} color="green" size="md" />
                <div>
                  <h3 className="text-sm font-bold text-heading">Headquarters</h3>
                  <p className="text-xs text-muted mt-1">Bangalore &amp; New Delhi, India</p>
                  <span className="inline-block mt-1 text-xs font-semibold text-heading">
                    Data servers hosted securely in Mumbai, IN
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <Card className="p-8 sm:p-10 border-border shadow-card">
              <h2 className="text-xl font-bold text-heading mb-6 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <span>Send Us a Message</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField label="Full Name" required>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormField>

                <FormField label="Email Address" required>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormField>

                <FormField label="Message" required>
                  <Textarea
                    rows={4}
                    placeholder="How can we assist you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isFullWidth
                  className="h-12 font-semibold shadow-card"
                  isLoading={isSubmitting}
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>Send Message</span>
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
