'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2, MessageSquare, Mail, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ContactFormProps {
  whatsappNumber: string;
  contactEmail: string;
  services?: { id: string; title: string }[];
}

const DEFAULT_SUBJECTS = [
  'Digital Marketing Strategy',
  'Performance Marketing',
  'Business Development',
  'Brand Growth Strategy',
  'Lead Generation',
  'Social Media Marketing',
  'SEO & Content',
  'E-commerce Growth',
];

export default function ContactForm({ whatsappNumber, contactEmail, services }: ContactFormProps) {
  const subjectOptions = services && services.length > 0
    ? services.map((s) => s.title)
    : DEFAULT_SUBJECTS;

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', customSubject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const effectiveSubject = form.subject === 'Other' ? form.customSubject : form.subject;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    if (form.subject === 'Other' && !form.customSubject.trim()) return;

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: effectiveSubject }),
      });
      const data = await res.json();

      if (res.ok && data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
        setTimeout(() => {
          window.location.href = data.mailtoUrl;
        }, 1000);
        setSent(true);
        setForm({ name: '', email: '', phone: '', subject: '', customSubject: '', message: '' });
      }
    } catch {
      const msg = encodeURIComponent(
        `*New Contact*\n\nName: ${form.name}\nEmail: ${form.email}\n${form.phone ? `Phone: ${form.phone}\n` : ''}${effectiveSubject ? `Subject: ${effectiveSubject}\n` : ''}Message: ${form.message}`
      );
      window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', customSubject: '', message: '' });
    }
    setSending(false);
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left side info */}
          <div className="flex flex-col justify-center">
            <span className="inline-block mb-4 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full self-start">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Let&apos;s Start a Conversation
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8">
              Have a project in mind? We&apos;d love to hear from you. Fill out the form and your message will be sent directly to us via WhatsApp and Email.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">WhatsApp</h4>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                  >
                    {whatsappNumber}
                  </a>
                  <p className="text-xs text-slate-400 mt-0.5">Quick response, always available</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Email</h4>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
                  >
                    {contactEmail}
                  </a>
                  <p className="text-xs text-slate-400 mt-0.5">For detailed inquiries & proposals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side form */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 mb-6 max-w-sm">
                  Your message has been sent via WhatsApp and Email. We&apos;ll get back to you shortly.
                </p>
                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="rounded-full"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="John Doe"
                      className="mt-1.5"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="john@example.com"
                      className="mt-1.5"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="+92 323 7939393"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <div className="relative mt-1.5">
                      <select
                        id="subject"
                        value={form.subject}
                        onChange={(e) => update('subject', e.target.value)}
                        className="w-full h-10 rounded-lg border border-input bg-white px-3 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                      >
                        <option value="" disabled>Select a subject</option>
                        {subjectOptions.map((subj) => (
                          <option key={subj} value={subj}>{subj}</option>
                        ))}
                        <option value="Other">Other</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Custom subject input when "Other" is selected */}
                {form.subject === 'Other' && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="customSubject">Your Subject *</Label>
                    <Input
                      id="customSubject"
                      value={form.customSubject}
                      onChange={(e) => update('customSubject', e.target.value)}
                      placeholder="Enter your subject here..."
                      className="mt-1.5"
                      required
                      autoFocus
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    placeholder="Tell us about your project, goals, and how we can help..."
                    className="mt-1.5 min-h-[120px]"
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={sending || !form.name || !form.email || !form.message || (form.subject === 'Other' && !form.customSubject.trim())}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 text-base font-semibold"
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </>
                  )}
                </Button>
                <p className="text-xs text-slate-400 text-center">
                  Your message will be sent via WhatsApp & Email directly
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}