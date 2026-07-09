'use client';

import { useState } from 'react';
import {
  X, Save, Plus, Trash2, Edit3, LogOut, Settings, ImageIcon, Layers, KeyRound, Loader2,
  Target, BarChart3, TrendingUp, Rocket, Users, Filter, Handshake, Lightbulb,
  ArrowRight, Zap, Globe, Search, Mail, Megaphone, PieChart, Database,
  Code, Cpu, Smartphone, Palette, PenTool, Monitor, Shield, Star, Heart,
  Award, Bookmark, Briefcase, Calendar, Camera, Cloud, MessageSquare, Eye, EyeOff, Film, Play, Lock, Unlock, QrCode, SmartphoneNfc,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const iconMap: Record<string, LucideIcon> = {
  Target, BarChart3, TrendingUp, Rocket, Users, Filter, Handshake, Lightbulb,
  ArrowRight, Zap, Globe, Search, Mail, Megaphone, PieChart, Database,
  Code, Cpu, Smartphone, Palette, PenTool, Monitor, Settings, Shield,
  Star, Heart, Award, Bookmark, Briefcase, Calendar, Camera, Cloud,
};

interface Slide { id: string; title: string; subtitle: string; imageUrl: string; ctaText: string; ctaLink: string; order: number; active: boolean; }
interface ServiceItem { id: string; title: string; description: string; icon: string; order: number; active: boolean; }
interface TestimonialItem { id: string; name: string; role: string; company: string; content: string; rating: number; imageUrl: string; order: number; active: boolean; }
interface PartnerItem { id: string; name: string; imageUrl: string; website: string; order: number; active: boolean; }
interface ContactMsg { id: string; name: string; email: string; phone: string; subject: string; message: string; read: boolean; createdAt: string; }
interface ReelItem { id: string; platform: string; reelUrl: string; order: number; active: boolean; }

interface AdminPanelProps { open: boolean; onClose: () => void; }

type Tab = 'settings' | 'slides' | 'services' | 'reviews' | 'partners' | 'reels' | 'messages' | 'password' | 'seo';

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [aboutStats, setAboutStats] = useState<{ label: string; value: string }[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingSlide, setEditingSlide] = useState<Partial<Slide> | null>(null);
  const [slideFormOpen, setSlideFormOpen] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<TestimonialItem> | null>(null);
  const [testimonialFormOpen, setTestimonialFormOpen] = useState(false);
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [editingPartner, setEditingPartner] = useState<Partial<PartnerItem> | null>(null);
  const [partnerFormOpen, setPartnerFormOpen] = useState(false);
  const [messages, setMessages] = useState<ContactMsg[]>([]);
  const [reels, setReels] = useState<ReelItem[]>([]);
  const [editingReel, setEditingReel] = useState<Partial<ReelItem> | null>(null);
  const [reelFormOpen, setReelFormOpen] = useState(false);
  const [aboutImages, setAboutImages] = useState<string[]>([]);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  // 2FA states
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorUri, setTwoFactorUri] = useState('');
  const [twoFactorSetupCode, setTwoFactorSetupCode] = useState('');
  const [twoFactorVerifyCode, setTwoFactorVerifyCode] = useState('');
  const [twoFactorDisableCode, setTwoFactorDisableCode] = useState('');
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);

  const h = () => ({ 'Content-Type': 'application/json' as const, Authorization: `Bearer ${token}` as const });

  const fetchData = async () => {
    const hdrs = h();
    try { const r = await fetch('/api/settings', { headers: hdrs }); const d = await r.json(); setSettings(d); try { setAboutStats(JSON.parse(d.aboutStats || '[]')); } catch { setAboutStats([]); } } catch { /* */ }
    try { const r = await fetch('/api/hero-slides', { headers: hdrs }); if (r.ok) setSlides(await r.json()); } catch { /* */ }
    try { const r = await fetch('/api/services', { headers: hdrs }); if (r.ok) setServices(await r.json()); } catch { /* */ }
    try { const r = await fetch('/api/testimonials', { headers: hdrs }); if (r.ok) setTestimonials(await r.json()); } catch { /* */ }
    try { const r = await fetch('/api/partners', { headers: hdrs }); if (r.ok) setPartners(await r.json()); } catch { /* */ }
    try { const r = await fetch('/api/contact', { headers: hdrs }); if (r.ok) setMessages(await r.json()); } catch { /* */ }
    try { const r = await fetch('/api/reels', { headers: hdrs }); if (r.ok) setReels(await r.json()); } catch { /* */ }
    try { setAboutImages(JSON.parse(settings.aboutImages || '[]')); } catch { setAboutImages([]); }
  };

  const handleLogin = async () => {
    setLoginLoading(true); setLoginError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, twoFactorCode: twoFactorRequired ? twoFactorCode : undefined, pendingToken: twoFactorRequired ? pendingToken : undefined }) });
      const data = await res.json();
      if (res.ok) {
        if (data.twoFactorRequired) {
          setTwoFactorRequired(true);
          setPendingToken(data.pendingToken);
          setLoginError('');
        } else {
          setToken(data.token);
          setTwoFactorRequired(false);
          setPendingToken(null);
          setTwoFactorCode('');
          toast({ title: 'Logged in successfully' });
          void fetchTwoFactorStatus();
          void fetchData();
        }
      }
      else { setLoginError(data.error || 'Login failed'); }
    } catch { setLoginError('Network error'); }
    setLoginLoading(false);
  };

  const fetchTwoFactorStatus = async () => {
    if (!token) return;
    try {
      const r = await fetch('/api/auth/2fa', { headers: h() });
      if (r.ok) { const d = await r.json(); setTwoFactorEnabled(d.enabled); }
    } catch { /* */ }
  };

  const handleSetup2FA = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/auth/2fa', { method: 'POST', headers: h() });
      const d = await r.json();
      if (r.ok) {
        setTwoFactorSecret(d.secret);
        setTwoFactorUri(d.uri);
        setTwoFactorSetupCode(d.testCode);
        setShowTwoFactorSetup(true);
      } else { toast({ title: 'Error', description: d.error, variant: 'destructive' }); }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    setLoading(false);
  };

  const handleVerify2FA = async (action: 'enable' | 'disable') => {
    const code = action === 'enable' ? twoFactorVerifyCode : twoFactorDisableCode;
    if (!code) { toast({ title: 'Enter the 6-digit code', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const r = await fetch('/api/auth/2fa', { method: 'PUT', headers: h(), body: JSON.stringify({ code, action }) });
      const d = await r.json();
      if (r.ok) {
        toast({ title: d.message });
        setTwoFactorEnabled(action === 'enable');
        setShowTwoFactorSetup(false);
        setTwoFactorSecret('');
        setTwoFactorUri('');
        setTwoFactorSetupCode('');
        setTwoFactorVerifyCode('');
        setTwoFactorDisableCode('');
        if (d.token) setToken(d.token);
      } else { toast({ title: 'Error', description: d.error, variant: 'destructive' }); }
    } catch { toast({ title: 'Error', variant: 'destructive' }); }
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    const res = await fetch('/api/settings', { method: 'PUT', headers: h(), body: JSON.stringify({ ...settings, aboutStats: JSON.stringify(aboutStats), aboutImages: JSON.stringify(aboutImages) }) });
    if (res.ok) toast({ title: 'Settings saved' }); else toast({ title: 'Error', variant: 'destructive' });
    setLoading(false);
  };

  const handleSaveReel = async () => {
    if (!editingReel?.reelUrl) { toast({ title: 'Reel URL is required', variant: 'destructive' }); return; }
    setLoading(true);
    if (editingReel.id) await fetch('/api/reels', { method: 'PUT', headers: h(), body: JSON.stringify(editingReel) });
    else await fetch('/api/reels', { method: 'POST', headers: h(), body: JSON.stringify(editingReel) });
    toast({ title: editingReel.id ? 'Reel updated' : 'Reel added' });
    setEditingReel(null); setReelFormOpen(false); void fetchData(); setLoading(false);
  };

  const handleDeleteReel = async (id: string) => { if (!confirm('Delete?')) return; await fetch(`/api/reels?id=${id}`, { method: 'DELETE', headers: h() }); toast({ title: 'Deleted' }); void fetchData(); };

  const handleSaveSlide = async () => {
    if (!editingSlide?.title || !editingSlide?.subtitle || !editingSlide?.imageUrl) { toast({ title: 'Missing fields', variant: 'destructive' }); return; }
    setLoading(true);
    if (editingSlide.id) await fetch('/api/hero-slides', { method: 'PUT', headers: h(), body: JSON.stringify(editingSlide) });
    else await fetch('/api/hero-slides', { method: 'POST', headers: h(), body: JSON.stringify(editingSlide) });
    toast({ title: editingSlide.id ? 'Slide updated' : 'Slide created' });
    setEditingSlide(null); setSlideFormOpen(false); void fetchData(); setLoading(false);
  };

  const handleDeleteSlide = async (id: string) => { if (!confirm('Delete this slide?')) return; await fetch(`/api/hero-slides?id=${id}`, { method: 'DELETE', headers: h() }); toast({ title: 'Deleted' }); void fetchData(); };

  const handleSaveService = async () => {
    if (!editingService?.title || !editingService?.description) { toast({ title: 'Missing fields', variant: 'destructive' }); return; }
    setLoading(true);
    if (editingService.id) await fetch('/api/services', { method: 'PUT', headers: h(), body: JSON.stringify(editingService) });
    else await fetch('/api/services', { method: 'POST', headers: h(), body: JSON.stringify(editingService) });
    toast({ title: editingService.id ? 'Service updated' : 'Service created' });
    setEditingService(null); setServiceFormOpen(false); void fetchData(); setLoading(false);
  };

  const handleDeleteService = async (id: string) => { if (!confirm('Delete this service?')) return; await fetch(`/api/services?id=${id}`, { method: 'DELETE', headers: h() }); toast({ title: 'Deleted' }); void fetchData(); };

  const handleSaveTestimonial = async () => {
    if (!editingTestimonial?.name || !editingTestimonial?.content) { toast({ title: 'Missing fields', variant: 'destructive' }); return; }
    setLoading(true);
    const headers = h();
    if (editingTestimonial.id) await fetch('/api/testimonials', { method: 'PUT', headers, body: JSON.stringify(editingTestimonial) });
    else await fetch('/api/testimonials', { method: 'POST', headers, body: JSON.stringify(editingTestimonial) });
    toast({ title: editingTestimonial.id ? 'Review updated' : 'Review created' });
    setEditingTestimonial(null); setTestimonialFormOpen(false); void fetchData(); setLoading(false);
  };

  const handleDeleteTestimonial = async (id: string) => { if (!confirm('Delete this review?')) return; await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE', headers: h() }); toast({ title: 'Deleted' }); void fetchData(); };

  const handleSavePartner = async () => {
    if (!editingPartner?.name || !editingPartner?.imageUrl) { toast({ title: 'Missing fields', variant: 'destructive' }); return; }
    setLoading(true);
    const headers = h();
    if (editingPartner.id) await fetch('/api/partners', { method: 'PUT', headers, body: JSON.stringify(editingPartner) });
    else await fetch('/api/partners', { method: 'POST', headers, body: JSON.stringify(editingPartner) });
    toast({ title: editingPartner.id ? 'Partner updated' : 'Partner created' });
    setEditingPartner(null); setPartnerFormOpen(false); void fetchData(); setLoading(false);
  };

  const handleDeletePartner = async (id: string) => { if (!confirm('Delete this partner?')) return; await fetch(`/api/partners?id=${id}`, { method: 'DELETE', headers: h() }); toast({ title: 'Deleted' }); void fetchData(); };

  const handleMarkRead = async (id: string) => {
    await fetch(`/api/contact?markRead=${id}`, { method: 'GET', headers: h() });
    void fetchData();
  };

  const handleDeleteMessage = async (id: string) => { if (!confirm('Delete this message?')) return; await fetch(`/api/contact?id=${id}`, { method: 'DELETE', headers: h() }); toast({ title: 'Deleted' }); void fetchData(); };

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) { toast({ title: 'Passwords do not match', variant: 'destructive' }); return; }
    if (newPwd.length < 8) { toast({ title: 'Min 8 characters, with uppercase, lowercase, number & special char', variant: 'destructive' }); return; }
    setLoading(true);
    const res = await fetch('/api/auth/change-password', { method: 'POST', headers: h(), body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }) });
    const d = await res.json();
    if (res.ok) { toast({ title: 'Password changed' }); setCurrentPwd(''); setNewPwd(''); setConfirmPwd(''); }
    else toast({ title: 'Error', description: d.error, variant: 'destructive' });
    setLoading(false);
  };

  if (!open) return null;

  // LOGIN
  if (!token) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} className="text-slate-500" /></button>
          </div>
          {loginError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{loginError}</div>}
          {twoFactorRequired && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 flex items-center gap-2">
              <SmartphoneNfc size={16} className="flex-shrink-0" />
              Two-factor authentication required. Enter the code from your authenticator app.
            </div>
          )}
          <div className="space-y-4">
            {!twoFactorRequired && (
              <>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" /></div>
                <div><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="mt-1.5" /></div>
              </>
            )}
            {twoFactorRequired && (
              <div>
                <Label htmlFor="twofa">Authentication Code</Label>
                <Input id="twofa" type="text" placeholder="6-digit code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} className="mt-1.5 text-center text-2xl tracking-[0.5em] font-mono" maxLength={6} autoFocus />
                <button onClick={() => { setTwoFactorRequired(false); setPendingToken(null); setTwoFactorCode(''); setLoginError(''); }} className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline">Back to password login</button>
              </div>
            )}
            <Button onClick={handleLogin} disabled={loginLoading || (!twoFactorRequired && (!email || !password)) || (twoFactorRequired && twoFactorCode.length !== 6)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11">
              {loginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{twoFactorRequired ? 'Verify Code' : 'Sign In'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // DASHBOARD
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    { key: 'slides', label: 'Slides', icon: <ImageIcon size={18} /> },
    { key: 'services', label: 'Services', icon: <Layers size={18} /> },
    { key: 'reviews', label: 'Reviews', icon: <Star size={18} /> },
    { key: 'partners', label: 'Partners', icon: <Shield size={18} /> },
    { key: 'reels', label: 'Reels', icon: <Film size={18} /> },
    { key: 'messages', label: 'Messages', icon: <MessageSquare size={18} /> },
    { key: 'password', label: 'Password', icon: <KeyRound size={18} /> },
    { key: 'seo', label: 'SEO & Logo', icon: <Search size={18} /> },
  ];

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900"><span className="text-sm font-bold text-white">A</span></div>
            <h2 className="text-lg font-bold text-slate-900">Admin Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setToken(null); setEmail(''); setPassword(''); setActiveTab('settings'); }} className="text-slate-500 hover:text-red-500"><LogOut size={16} className="mr-1.5" />Logout</Button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} className="text-slate-500" /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); if (tab.key === 'messages') void fetchData(); }}
              className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.key ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab.icon} {tab.label}
              {tab.key === 'messages' && unreadCount > 0 && <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">{unreadCount}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-slate-900">Site Settings</h3>
              <div className="space-y-4">
                <div><Label>Site Name</Label><Input value={settings.siteName || ''} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Tagline</Label><Input value={settings.tagline || ''} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} className="mt-1.5" /></div>
                <div><Label>WhatsApp Number</Label><Input value={settings.whatsappNumber || ''} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} className="mt-1.5" /></div>
                <div><Label>Contact Email</Label><Input value={settings.contactEmail || ''} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} className="mt-1.5" /></div>
                <div><Label>About Title</Label><Input value={settings.aboutTitle || ''} onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })} className="mt-1.5" /></div>
                <div><Label>About Description</Label><Textarea value={settings.aboutDescription || ''} onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })} className="mt-1.5" rows={4} /></div>
                <div>
                  <div className="flex justify-between items-center mb-3"><Label>Statistics</Label><Button size="sm" variant="outline" onClick={() => setAboutStats([...aboutStats, { label: '', value: '' }])} className="text-xs"><Plus size={14} className="mr-1" />Add</Button></div>
                  {aboutStats.map((stat, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input value={stat.label} onChange={(e) => { const n = [...aboutStats]; n[i] = { ...n[i], label: e.target.value }; setAboutStats(n); }} placeholder="Label" className="flex-1" />
                      <Input value={stat.value} onChange={(e) => { const n = [...aboutStats]; n[i] = { ...n[i], value: e.target.value }; setAboutStats(n); }} placeholder="Value" className="w-32" />
                      <Button size="icon" variant="ghost" onClick={() => setAboutStats(aboutStats.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"><Trash2 size={16} /></Button>
                    </div>
                  ))}
                </div>
                <div><Label>Instagram URL</Label><Input value={settings.instagramUrl || ''} onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })} className="mt-1.5" placeholder="https://www.instagram.com/..." /></div>
                <div><Label>TikTok URL</Label><Input value={settings.tiktokUrl || ''} onChange={(e) => setSettings({ ...settings, tiktokUrl: e.target.value })} className="mt-1.5" placeholder="https://www.tiktok.com/@..." /></div>
                <div><Label>YouTube URL</Label><Input value={settings.youtubeUrl || ''} onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })} className="mt-1.5" placeholder="https://www.youtube.com/..." /></div>
                <div><Label>CTA Title</Label><Input value={settings.ctaTitle || ''} onChange={(e) => setSettings({ ...settings, ctaTitle: e.target.value })} className="mt-1.5" /></div>
                <div><Label>CTA Description</Label><Textarea value={settings.ctaDescription || ''} onChange={(e) => setSettings({ ...settings, ctaDescription: e.target.value })} className="mt-1.5" rows={3} /></div>
                <div><Label>CTA Button Text</Label><Input value={settings.ctaButtonText || ''} onChange={(e) => setSettings({ ...settings, ctaButtonText: e.target.value })} className="mt-1.5" /></div>
                <div>
                  <div className="flex justify-between items-center mb-3"><Label>About Images</Label><Button size="sm" variant="outline" onClick={() => setAboutImages([...aboutImages, ''])} className="text-xs"><Plus size={14} className="mr-1" />Add</Button></div>
                  <div className="space-y-2">
                    {aboutImages.map((url, i) => (
                      <div key={i} className="flex gap-2"><Input value={url} onChange={(e) => { const n = [...aboutImages]; n[i] = e.target.value; setAboutImages(n); }} placeholder={`Image ${i + 1} URL`} className="flex-1" /><Button size="icon" variant="ghost" onClick={() => setAboutImages(aboutImages.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"><Trash2 size={16} /></Button></div>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveSettings} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save size={16} className="mr-2" />Save Settings</Button>
            </div>
          )}

          {/* SLIDES */}
          {activeTab === 'slides' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Hero Slides</h3>
                <Button onClick={() => { setEditingSlide({ title: '', subtitle: '', imageUrl: '', ctaText: 'Get Started', ctaLink: '#contact', order: slides.length, active: true }); setSlideFormOpen(true); }} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm"><Plus size={16} className="mr-1.5" />Add Slide</Button>
              </div>
              {slideFormOpen && editingSlide && (
                <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
                  <h4 className="font-semibold text-slate-900">{editingSlide.id ? 'Edit' : 'New'} Slide</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2"><Label>Title</Label><Input value={editingSlide.title || ''} onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })} className="mt-1.5" /></div>
                    <div className="sm:col-span-2"><Label>Subtitle</Label><Textarea value={editingSlide.subtitle || ''} onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })} className="mt-1.5" rows={2} /></div>
                    <div className="sm:col-span-2"><Label>Image URL</Label><Input value={editingSlide.imageUrl || ''} onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })} className="mt-1.5" /></div>
                    <div><Label>CTA Text</Label><Input value={editingSlide.ctaText || ''} onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })} className="mt-1.5" /></div>
                    <div><Label>CTA Link</Label><Input value={editingSlide.ctaLink || ''} onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })} className="mt-1.5" /></div>
                    <div><Label>Order</Label><Input type="number" value={editingSlide.order || 0} onChange={(e) => setEditingSlide({ ...editingSlide, order: parseInt(e.target.value) || 0 })} className="mt-1.5" /></div>
                    <div className="flex items-end pb-1"><div className="flex items-center gap-2"><Switch checked={editingSlide.active ?? true} onCheckedChange={(c) => setEditingSlide({ ...editingSlide, active: c })} /><Label>Active</Label></div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveSlide} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm">{loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Save</Button>
                    <Button variant="outline" onClick={() => { setSlideFormOpen(false); setEditingSlide(null); }} size="sm">Cancel</Button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {slides.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0"><img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0"><p className="font-medium text-slate-900 truncate">{s.title}</p><p className="text-sm text-slate-500 truncate">{s.subtitle}</p></div>
                    <span className={`text-xs px-2 py-1 rounded-full ${s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{s.active ? 'Active' : 'Inactive'}</span>
                    <Button size="icon" variant="ghost" onClick={() => { setEditingSlide(s); setSlideFormOpen(true); }} className="h-8 w-8 text-slate-500 hover:text-emerald-600"><Edit3 size={15} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteSlide(s.id)} className="h-8 w-8 text-slate-500 hover:text-red-500"><Trash2 size={15} /></Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Services</h3>
                <Button onClick={() => { setEditingService({ title: '', description: '', icon: 'TrendingUp', order: services.length, active: true }); setServiceFormOpen(true); }} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm"><Plus size={16} className="mr-1.5" />Add Service</Button>
              </div>
              {serviceFormOpen && editingService && (
                <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
                  <h4 className="font-semibold text-slate-900">{editingService.id ? 'Edit' : 'New'} Service</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2"><Label>Title</Label><Input value={editingService.title || ''} onChange={(e) => setEditingService({ ...editingService, title: e.target.value })} className="mt-1.5" /></div>
                    <div className="sm:col-span-2"><Label>Description</Label><Textarea value={editingService.description || ''} onChange={(e) => setEditingService({ ...editingService, description: e.target.value })} className="mt-1.5" rows={3} /></div>
                    <div><Label>Icon</Label><select value={editingService.icon || 'TrendingUp'} onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })} className="mt-1.5 w-full h-10 rounded-lg border border-input bg-white px-3 text-sm">{Object.keys(iconMap).map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
                    <div><Label>Order</Label><Input type="number" value={editingService.order || 0} onChange={(e) => setEditingService({ ...editingService, order: parseInt(e.target.value) || 0 })} className="mt-1.5" /></div>
                    <div className="flex items-end pb-1"><div className="flex items-center gap-2"><Switch checked={editingService.active ?? true} onCheckedChange={(c) => setEditingService({ ...editingService, active: c })} /><Label>Active</Label></div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveService} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm">{loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Save</Button>
                    <Button variant="outline" onClick={() => { setServiceFormOpen(false); setEditingService(null); }} size="sm">Cancel</Button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {services.map((s) => { const Icon = iconMap[s.icon] || TrendingUp; return (
                  <div key={s.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"><Icon size={20} className="text-emerald-600" /></div>
                    <div className="flex-1 min-w-0"><p className="font-medium text-slate-900">{s.title}</p><p className="text-sm text-slate-500 truncate">{s.description}</p></div>
                    <span className={`text-xs px-2 py-1 rounded-full ${s.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{s.active ? 'Active' : 'Inactive'}</span>
                    <Button size="icon" variant="ghost" onClick={() => { setEditingService(s); setServiceFormOpen(true); }} className="h-8 w-8 text-slate-500 hover:text-emerald-600"><Edit3 size={15} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteService(s.id)} className="h-8 w-8 text-slate-500 hover:text-red-500"><Trash2 size={15} /></Button>
                  </div>
                ); })}
              </div>
            </div>
          )}

          {/* REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Client Reviews</h3>
                <Button onClick={() => { setEditingTestimonial({ name: '', role: '', company: '', content: '', rating: 5, imageUrl: '', order: testimonials.length, active: true }); setTestimonialFormOpen(true); }} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm"><Plus size={16} className="mr-1.5" />Add Review</Button>
              </div>
              {testimonialFormOpen && editingTestimonial && (
                <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
                  <h4 className="font-semibold text-slate-900">{editingTestimonial.id ? 'Edit' : 'New'} Review</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Name *</Label><Input value={editingTestimonial.name || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} className="mt-1.5" /></div>
                    <div><Label>Role</Label><Input value={editingTestimonial.role || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })} className="mt-1.5" /></div>
                    <div><Label>Company</Label><Input value={editingTestimonial.company || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })} className="mt-1.5" /></div>
                    <div><Label>Rating (1-5)</Label><Input type="number" min="1" max="5" value={editingTestimonial.rating || 5} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 5)) })} className="mt-1.5" /></div>
                    <div className="sm:col-span-2"><Label>Review Content *</Label><Textarea value={editingTestimonial.content || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })} className="mt-1.5" rows={3} /></div>
                    <div className="sm:col-span-2"><Label>Image URL (optional)</Label><Input value={editingTestimonial.imageUrl || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, imageUrl: e.target.value })} className="mt-1.5" /></div>
                    <div><Label>Order</Label><Input type="number" value={editingTestimonial.order || 0} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, order: parseInt(e.target.value) || 0 })} className="mt-1.5" /></div>
                    <div className="flex items-end pb-1"><div className="flex items-center gap-2"><Switch checked={editingTestimonial.active ?? true} onCheckedChange={(c) => setEditingTestimonial({ ...editingTestimonial, active: c })} /><Label>Active</Label></div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveTestimonial} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm">{loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Save</Button>
                    <Button variant="outline" onClick={() => { setTestimonialFormOpen(false); setEditingTestimonial(null); }} size="sm">Cancel</Button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-4 bg-slate-50 rounded-xl border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-slate-900">{t.name}</p>
                          <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} />)}</div>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{t.role}{t.company ? `, ${t.company}` : ''}</p>
                        <p className="text-sm text-slate-600 line-clamp-2">{t.content}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-1 rounded-full ${t.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{t.active ? 'Active' : 'Inactive'}</span>
                        <Button size="icon" variant="ghost" onClick={() => { setEditingTestimonial(t); setTestimonialFormOpen(true); }} className="h-8 w-8 text-slate-500 hover:text-emerald-600"><Edit3 size={15} /></Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteTestimonial(t.id)} className="h-8 w-8 text-slate-500 hover:text-red-500"><Trash2 size={15} /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PARTNERS */}
          {activeTab === 'partners' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Trusted Partners</h3>
                <Button onClick={() => { setEditingPartner({ name: '', imageUrl: '', website: '', order: partners.length, active: true }); setPartnerFormOpen(true); }} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm"><Plus size={16} className="mr-1.5" />Add Partner</Button>
              </div>
              {partnerFormOpen && editingPartner && (
                <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
                  <h4 className="font-semibold text-slate-900">{editingPartner.id ? 'Edit' : 'New'} Partner</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Name *</Label><Input value={editingPartner.name || ''} onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })} className="mt-1.5" /></div>
                    <div><Label>Website</Label><Input value={editingPartner.website || ''} onChange={(e) => setEditingPartner({ ...editingPartner, website: e.target.value })} className="mt-1.5" /></div>
                    <div className="sm:col-span-2"><Label>Logo Image URL *</Label><Input value={editingPartner.imageUrl || ''} onChange={(e) => setEditingPartner({ ...editingPartner, imageUrl: e.target.value })} className="mt-1.5" /></div>
                    <div><Label>Order</Label><Input type="number" value={editingPartner.order || 0} onChange={(e) => setEditingPartner({ ...editingPartner, order: parseInt(e.target.value) || 0 })} className="mt-1.5" /></div>
                    <div className="flex items-end pb-1"><div className="flex items-center gap-2"><Switch checked={editingPartner.active ?? true} onCheckedChange={(c) => setEditingPartner({ ...editingPartner, active: c })} /><Label>Active</Label></div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSavePartner} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm">{loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Save</Button>
                    <Button variant="outline" onClick={() => { setPartnerFormOpen(false); setEditingPartner(null); }} size="sm">Cancel</Button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {partners.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-white border flex items-center justify-center p-2 flex-shrink-0"><img src={p.imageUrl} alt={p.name} className="max-h-full max-w-full object-contain" /></div>
                    <div className="flex-1 min-w-0"><p className="font-medium text-slate-900">{p.name}</p>{p.website && <p className="text-xs text-slate-500 truncate">{p.website}</p>}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${p.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{p.active ? 'Active' : 'Inactive'}</span>
                    <Button size="icon" variant="ghost" onClick={() => { setEditingPartner(p); setPartnerFormOpen(true); }} className="h-8 w-8 text-slate-500 hover:text-emerald-600"><Edit3 size={15} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeletePartner(p.id)} className="h-8 w-8 text-slate-500 hover:text-red-500"><Trash2 size={15} /></Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Contact Messages</h3>
                <Button onClick={() => void fetchData()} variant="outline" size="sm"><Loader2 size={14} className="mr-1" />Refresh</Button>
              </div>
              {messages.length === 0 && <p className="text-center text-slate-400 py-12">No messages yet. When visitors submit the contact form, their messages will appear here.</p>}
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`p-4 rounded-xl border ${m.read ? 'bg-white border-slate-100' : 'bg-emerald-50 border-emerald-200'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {!m.read && <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />}
                          <p className={`font-semibold text-sm ${m.read ? 'text-slate-700' : 'text-slate-900'}`}>{m.name}</p>
                          <span className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{m.email}{m.phone ? ` | ${m.phone}` : ''}{m.subject ? ` | ${m.subject}` : ''}</p>
                        <p className="text-sm text-slate-600">{m.message}</p>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        {!m.read && <Button size="icon" variant="ghost" onClick={() => handleMarkRead(m.id)} className="h-7 w-7 text-slate-400 hover:text-emerald-600" title="Mark read"><Eye size={14} /></Button>}
                        {m.read && <Button size="icon" variant="ghost" onClick={() => handleMarkRead(m.id)} className="h-7 w-7 text-slate-400 hover:text-slate-600" title="Mark unread"><EyeOff size={14} /></Button>}
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteMessage(m.id)} className="h-7 w-7 text-slate-400 hover:text-red-500"><Trash2 size={14} /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REELS */}
          {activeTab === 'reels' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Social Reels</h3>
                <Button onClick={() => { setEditingReel({ platform: 'instagram', reelUrl: '', order: reels.length, active: true }); setReelFormOpen(true); }} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm"><Plus size={16} className="mr-1.5" />Add Reel</Button>
              </div>
              {reelFormOpen && editingReel && (
                <div className="bg-slate-50 rounded-xl p-6 border space-y-4">
                  <h4 className="font-semibold text-slate-900">{editingReel.id ? 'Edit' : 'New'} Reel</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Platform</Label><select value={editingReel.platform || 'instagram'} onChange={(e) => setEditingReel({ ...editingReel, platform: e.target.value })} className="mt-1.5 w-full h-10 rounded-lg border border-input bg-white px-3 text-sm"><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="youtube">YouTube</option></select></div>
                    <div className="sm:col-span-2"><Label>Reel URL *</Label><Input value={editingReel.reelUrl || ''} onChange={(e) => setEditingReel({ ...editingReel, reelUrl: e.target.value })} className="mt-1.5" placeholder="https://www.instagram.com/reel/..." /></div>
                    <div><Label>Order</Label><Input type="number" value={editingReel.order || 0} onChange={(e) => setEditingReel({ ...editingReel, order: parseInt(e.target.value) || 0 })} className="mt-1.5" /></div>
                    <div className="flex items-end pb-1"><div className="flex items-center gap-2"><Switch checked={editingReel.active ?? true} onCheckedChange={(c) => setEditingReel({ ...editingReel, active: c })} /><Label>Active</Label></div></div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveReel} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm">{loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Save</Button>
                    <Button variant="outline" onClick={() => { setReelFormOpen(false); setEditingReel(null); }} size="sm">Cancel</Button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {reels.map((r) => (
                  <div key={r.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border">
                    <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0">
                      {r.platform === 'tiktok' ? <Play size={18} className="text-slate-600" /> : <Camera size={18} className="text-slate-600" />}
                    </div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-900 truncate">{r.reelUrl}</p><p className="text-xs text-slate-400">{r.platform}</p></div>
                    <span className={`text-xs px-2 py-1 rounded-full ${r.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{r.active ? 'Active' : 'Inactive'}</span>
                    <Button size="icon" variant="ghost" onClick={() => { setEditingReel(r); setReelFormOpen(true); }} className="h-8 w-8 text-slate-500 hover:text-emerald-600"><Edit3 size={15} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteReel(r.id)} className="h-8 w-8 text-slate-500 hover:text-red-500"><Trash2 size={15} /></Button>
                  </div>
                ))}
                {reels.length === 0 && !reelFormOpen && <p className="text-center text-slate-400 py-8">No reels yet. Add Instagram or TikTok reel URLs to display them on the website.</p>}
              </div>
            </div>
          )}

          {/* PASSWORD */}
          {activeTab === 'password' && (
            <div className="space-y-6 max-w-md">
              <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
              <div className="space-y-4">
                <div><Label>Current Password</Label><Input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} className="mt-1.5" /></div>
                <div><Label>New Password</Label><Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="mt-1.5" placeholder="Min 8 chars: Aa1@..." /></div>
                <div><Label>Confirm New Password</Label><Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="mt-1.5" /></div>
              </div>
              <Button onClick={handleChangePassword} disabled={loading || !currentPwd || !newPwd || !confirmPwd} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<KeyRound size={16} className="mr-2" />Change Password</Button>
            </div>
          )}

          {/* SEO & LOGO */}
          {activeTab === 'seo' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-slate-900">SEO & Branding</h3>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                These settings improve your website visibility on Google and social media platforms.
              </div>
              <div className="space-y-4">
                <div><Label>Meta Title (for search engines)</Label><Input value={settings.metaTitle || ''} onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })} className="mt-1.5" placeholder="Aurex Studio - Digital Marketing Agency" /></div>
                <div><Label>Meta Description</Label><Textarea value={settings.metaDescription || ''} onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })} className="mt-1.5" rows={3} placeholder="A brief description of your business for search results..." /></div>
                <div><Label>Meta Keywords (comma separated)</Label><Input value={settings.metaKeywords || ''} onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })} className="mt-1.5" placeholder="digital marketing, SEO, branding, Pakistan" /></div>
                <div><Label>OG Image URL (for social sharing)</Label><Input value={settings.ogImageUrl || ''} onChange={(e) => setSettings({ ...settings, ogImageUrl: e.target.value })} className="mt-1.5" placeholder="/uploads/og-image.webp" /></div>
                <div><Label>Business Address</Label><Input value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="mt-1.5" placeholder="I-8 Markaz, Islamabad, Pakistan" /></div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-slate-900 mb-3">Logo Upload</h4>
                <p className="text-sm text-slate-500 mb-4">Upload your logo in any format (PNG, JPG, SVG, WebP). The system will auto-resize it for all placements.</p>

                {settings.logoUrl && (
                  <div className="mb-4 flex items-center gap-4 p-4 bg-slate-50 rounded-xl border">
                    <img src={settings.logoUrl} alt="Current logo" className="h-16 w-16 rounded-lg object-contain border" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Current Logo</p>
                      <p className="text-xs text-slate-400">{settings.logoUrl}</p>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="logo-upload">Upload New Logo</Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const fd = new FormData();
                      fd.append('logo', file);
                      try {
                        const r = await fetch('/api/upload/logo', { method: 'POST', headers: h(), body: fd });
                        const d = await r.json();
                        if (r.ok) {
                          setSettings({ ...settings, logoUrl: d.urls?.logo || '', ogImageUrl: d.urls?.['og-image'] || settings.ogImageUrl || '' });
                          toast({ title: 'Logo uploaded successfully!' });
                        } else {
                          toast({ title: 'Error', description: d.error, variant: 'destructive' });
                        }
                      } catch {
                        toast({ title: 'Upload failed', variant: 'destructive' });
                      }
                    }}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-slate-400 mt-1">Accepts: PNG, JPG, WebP, SVG, GIF, BMP. Max 10MB. Auto-resized to all required sizes.</p>
                </div>
              </div>

              <Button onClick={handleSaveSettings} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl">{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Save size={16} className="mr-2" />Save SEO Settings</Button>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-slate-900">Security & 2FA</h3>

                {/* 2FA Status */}
                <div className={`p-4 rounded-xl border mt-4 ${twoFactorEnabled ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    {twoFactorEnabled ? <Lock size={20} className="text-emerald-600" /> : <Unlock size={20} className="text-slate-400" />}
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-500">{twoFactorEnabled ? 'Enabled - Your account has extra protection' : 'Disabled - Add an extra layer of security'}</p>
                    </div>
                    <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{twoFactorEnabled ? 'ON' : 'OFF'}</span>
                  </div>

                  {!twoFactorEnabled && !showTwoFactorSetup && (
                    <Button onClick={handleSetup2FA} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm">
                      {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Enable 2FA
                    </Button>
                  )}
                </div>

                {/* 2FA Setup Flow */}
                {showTwoFactorSetup && !twoFactorEnabled && twoFactorUri && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4 mt-4">
                    <h4 className="font-semibold text-slate-900">Step 1: Scan QR Code</h4>
                    <p className="text-sm text-slate-600">Open Google Authenticator, Authy, or any TOTP app and scan this QR code:</p>
                    <div className="bg-white p-4 rounded-lg border inline-block">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(twoFactorUri)}`} alt="2FA QR Code" className="w-48 h-48" draggable="false" />
                    </div>
                    <div className="bg-slate-100 rounded-lg p-3">
                      <p className="text-xs text-slate-500 mb-1">Manual entry key:</p>
                      <p className="font-mono text-sm text-slate-800 select-all break-all">{twoFactorSecret}</p>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-slate-900 mb-2">Step 2: Verify Code</h4>
                      <p className="text-sm text-slate-600 mb-3">Enter the 6-digit code from your authenticator app to confirm setup. Test code: <span className="font-mono font-bold text-emerald-600">{twoFactorSetupCode}</span></p>
                      <div className="flex gap-2">
                        <Input type="text" placeholder="000000" value={twoFactorVerifyCode} onChange={(e) => setTwoFactorVerifyCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} className="w-40 text-center text-xl tracking-[0.3em] font-mono" maxLength={6} />
                        <Button onClick={() => handleVerify2FA('enable')} disabled={loading || twoFactorVerifyCode.length !== 6} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl" size="sm">
                          {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Verify &amp; Enable
                        </Button>
                      </div>
                    </div>
                    <button onClick={() => { setShowTwoFactorSetup(false); setTwoFactorSecret(''); setTwoFactorUri(''); setTwoFactorSetupCode(''); setTwoFactorVerifyCode(''); }} className="text-xs text-slate-500 hover:text-slate-700 underline">Cancel setup</button>
                  </div>
                )}

                {/* Disable 2FA */}
                {twoFactorEnabled && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 space-y-4 mt-4">
                    <h4 className="font-semibold text-red-800">Disable Two-Factor Authentication</h4>
                    <p className="text-sm text-slate-600">Enter a valid 2FA code from your authenticator app to disable 2FA. This will make your account less secure.</p>
                    <div className="flex gap-2">
                      <Input type="text" placeholder="000000" value={twoFactorDisableCode} onChange={(e) => setTwoFactorDisableCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} className="w-40 text-center text-xl tracking-[0.3em] font-mono" maxLength={6} />
                      <Button onClick={() => handleVerify2FA('disable')} disabled={loading || twoFactorDisableCode.length !== 6} variant="destructive" size="sm">
                        {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}Disable 2FA
                      </Button>
                    </div>
                  </div>
                )}

                {/* Security Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 mt-4">
                  <h4 className="font-semibold text-slate-900">Security Features Active</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />HMAC-signed auth tokens</div>
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />24-hour session expiry</div>
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />PBKDF2 hashing (600K iterations)</div>
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />Rate limiting on all endpoints</div>
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />Input sanitization (XSS prevention)</div>
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />Account lockout (5 failed attempts)</div>
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />Content Security Policy (CSP)</div>
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />Secure HTTP headers (HSTS)</div>
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />Timing-safe comparisons</div>
                    <div className="flex items-center gap-2 text-emerald-700"><div className="w-2 h-2 rounded-full bg-emerald-500" />Content copy protection</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}