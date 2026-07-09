'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X, Save, Plus, Trash2, Edit3, LogOut, Settings, ImageIcon, Layers, KeyRound, Loader2,
  Target, BarChart3, TrendingUp, Rocket, Users, Filter, Handshake, Lightbulb,
  ArrowRight, Zap, Globe, Search, Mail, Megaphone, PieChart, Database,
  Code, Cpu, Smartphone, Palette, PenTool, Monitor, Shield, Star, Heart,
  Award, Bookmark, Briefcase, Calendar, Camera, Cloud,
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

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  order: number;
  active: boolean;
}

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  active: boolean;
}

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
}

type Tab = 'settings' | 'slides' | 'services' | 'password';

export default function AdminPanel({ open, onClose }: AdminPanelProps) {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Settings state
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [aboutStats, setAboutStats] = useState<{ label: string; value: string }[]>([]);

  // Slides state
  const [slides, setSlides] = useState<Slide[]>([]);
  const [editingSlide, setEditingSlide] = useState<Partial<Slide> | null>(null);
  const [slideFormOpen, setSlideFormOpen] = useState(false);

  // Services state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);

  // Password state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
      try {
        const stats = JSON.parse(data.aboutStats || '[]');
        setAboutStats(stats);
      } catch {
        setAboutStats([]);
      }
    } catch {
      // silent
    }

    try {
      const res = await fetch('/api/hero-slides');
      const data = await res.json();
      if (Array.isArray(data)) setSlides(data);
    } catch {
      // silent
    }

    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch {
      // silent
    }
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        toast({ title: 'Logged in successfully', description: 'Welcome to the admin panel' });
        void fetchData();
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Network error. Please try again.');
    }
    setLoginLoading(false);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const payload = { ...settings, aboutStats: JSON.stringify(aboutStats) };
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast({ title: 'Settings saved', description: 'Website settings updated successfully' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleSaveSlide = async () => {
    if (!editingSlide?.title || !editingSlide?.subtitle || !editingSlide?.imageUrl) {
      toast({ title: 'Error', description: 'Title, subtitle, and image URL are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      if (editingSlide.id) {
        const res = await fetch('/api/hero-slides', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(editingSlide),
        });
        if (res.ok) toast({ title: 'Slide updated' });
      } else {
        const res = await fetch('/api/hero-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(editingSlide),
        });
        if (res.ok) toast({ title: 'Slide created' });
      }
      setEditingSlide(null);
      setSlideFormOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to save slide', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    try {
      await fetch(`/api/hero-slides?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: 'Slide deleted' });
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete slide', variant: 'destructive' });
    }
  };

  const handleSaveService = async () => {
    if (!editingService?.title || !editingService?.description) {
      toast({ title: 'Error', description: 'Title and description are required', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      if (editingService.id) {
        const res = await fetch('/api/services', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(editingService),
        });
        if (res.ok) toast({ title: 'Service updated' });
      } else {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(editingService),
        });
        if (res.ok) toast({ title: 'Service created' });
      }
      setEditingService(null);
      setServiceFormOpen(false);
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to save service', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    try {
      await fetch(`/api/services?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({ title: 'Service deleted' });
      fetchData();
    } catch {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    }
  };

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) {
      toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    if (newPwd.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Password changed', description: 'Your password has been updated' });
        setCurrentPwd('');
        setNewPwd('');
        setConfirmPwd('');
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to change password', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    setEmail('');
    setPassword('');
    setActiveTab('settings');
  };

  const handleClose = () => {
    onClose();
  };

  if (!open) return null;

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Admin Login</h2>
            <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="mt-1.5"
              />
            </div>
            <Button
              onClick={handleLogin}
              disabled={loginLoading || !email || !password}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-11"
            >
              {loginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'settings', label: 'Site Settings', icon: <Settings size={18} /> },
    { key: 'slides', label: 'Hero Slides', icon: <ImageIcon size={18} /> },
    { key: 'services', label: 'Services', icon: <Layers size={18} /> },
    { key: 'password', label: 'Password', icon: <KeyRound size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">Admin Panel</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-500">
              <LogOut size={16} className="mr-1.5" /> Logout
            </Button>
            <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-lg font-semibold text-slate-900">Site Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label>Site Name</Label>
                  <Input
                    value={settings.siteName || ''}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={settings.tagline || ''}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input
                    value={settings.whatsappNumber || ''}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="mt-1.5"
                    placeholder="+923237939393"
                  />
                </div>
                <div>
                  <Label>About Title</Label>
                  <Input
                    value={settings.aboutTitle || ''}
                    onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>About Description</Label>
                  <Textarea
                    value={settings.aboutDescription || ''}
                    onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
                    className="mt-1.5 min-h-[100px]"
                    rows={4}
                  />
                </div>

                {/* Stats */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label>Statistics</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAboutStats([...aboutStats, { label: '', value: '' }])}
                      className="text-xs"
                    >
                      <Plus size={14} className="mr-1" /> Add Stat
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {aboutStats.map((stat, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...aboutStats];
                            newStats[i] = { ...newStats[i], label: e.target.value };
                            setAboutStats(newStats);
                          }}
                          placeholder="Label"
                          className="flex-1"
                        />
                        <Input
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...aboutStats];
                            newStats[i] = { ...newStats[i], value: e.target.value };
                            setAboutStats(newStats);
                          }}
                          placeholder="Value"
                          className="w-32"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setAboutStats(aboutStats.filter((_, idx) => idx !== i))}
                          className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>CTA Title</Label>
                  <Input
                    value={settings.ctaTitle || ''}
                    onChange={(e) => setSettings({ ...settings, ctaTitle: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>CTA Description</Label>
                  <Textarea
                    value={settings.ctaDescription || ''}
                    onChange={(e) => setSettings({ ...settings, ctaDescription: e.target.value })}
                    className="mt-1.5"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>CTA Button Text</Label>
                  <Input
                    value={settings.ctaButtonText || ''}
                    onChange={(e) => setSettings({ ...settings, ctaButtonText: e.target.value })}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <Button
                onClick={handleSaveSettings}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save size={16} className="mr-2" /> Save Settings
              </Button>
            </div>
          )}

          {/* SLIDES TAB */}
          {activeTab === 'slides' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Hero Slides</h3>
                <Button
                  onClick={() => {
                    setEditingSlide({ title: '', subtitle: '', imageUrl: '', ctaText: 'Get Started', ctaLink: '#contact', order: slides.length, active: true });
                    setSlideFormOpen(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                  size="sm"
                >
                  <Plus size={16} className="mr-1.5" /> Add Slide
                </Button>
              </div>

              {slideFormOpen && editingSlide && (
                <div className="bg-slate-50 rounded-xl p-6 border">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    {editingSlide.id ? 'Edit Slide' : 'New Slide'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label>Title</Label>
                      <Input
                        value={editingSlide.title || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Subtitle</Label>
                      <Textarea
                        value={editingSlide.subtitle || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                        className="mt-1.5"
                        rows={2}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Image URL</Label>
                      <Input
                        value={editingSlide.imageUrl || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                        className="mt-1.5"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div>
                      <Label>CTA Text</Label>
                      <Input
                        value={editingSlide.ctaText || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>CTA Link</Label>
                      <Input
                        value={editingSlide.ctaLink || ''}
                        onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={editingSlide.order || 0}
                        onChange={(e) => setEditingSlide({ ...editingSlide, order: parseInt(e.target.value) || 0 })}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingSlide.active ?? true}
                          onCheckedChange={(checked) => setEditingSlide({ ...editingSlide, active: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleSaveSlide}
                      disabled={loading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                      size="sm"
                    >
                      {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setSlideFormOpen(false); setEditingSlide(null); }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {slides.map((slide) => (
                  <div key={slide.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border">
                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                      <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{slide.title}</p>
                      <p className="text-sm text-slate-500 truncate">{slide.subtitle}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${slide.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                      {slide.active ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setEditingSlide(slide); setSlideFormOpen(true); }}
                        className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                      >
                        <Edit3 size={15} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="h-8 w-8 text-slate-500 hover:text-red-500"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </div>
                ))}
                {slides.length === 0 && !slideFormOpen && (
                  <p className="text-center text-slate-400 py-8">No slides yet. Click &quot;Add Slide&quot; to create one.</p>
                )}
              </div>
            </div>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-900">Services</h3>
                <Button
                  onClick={() => {
                    setEditingService({ title: '', description: '', icon: 'TrendingUp', order: services.length, active: true });
                    setServiceFormOpen(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                  size="sm"
                >
                  <Plus size={16} className="mr-1.5" /> Add Service
                </Button>
              </div>

              {serviceFormOpen && editingService && (
                <div className="bg-slate-50 rounded-xl p-6 border">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    {editingService.id ? 'Edit Service' : 'New Service'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label>Title</Label>
                      <Input
                        value={editingService.title || ''}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="mt-1.5"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <select
                        value={editingService.icon || 'TrendingUp'}
                        onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                        className="mt-1.5 w-full h-10 rounded-lg border border-input bg-white px-3 text-sm"
                      >
                        {Object.keys(iconMap).map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={editingService.order || 0}
                        onChange={(e) => setEditingService({ ...editingService, order: parseInt(e.target.value) || 0 })}
                        className="mt-1.5"
                      />
                    </div>
                    <div className="flex items-end pb-1">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={editingService.active ?? true}
                          onCheckedChange={(checked) => setEditingService({ ...editingService, active: checked })}
                        />
                        <Label>Active</Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleSaveService}
                      disabled={loading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                      size="sm"
                    >
                      {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setServiceFormOpen(false); setEditingService(null); }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {services.map((service) => {
                  const IconComp = iconMap[service.icon] || TrendingUp;
                  return (
                    <div key={service.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <IconComp size={20} className="text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{service.title}</p>
                        <p className="text-sm text-slate-500 truncate">{service.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${service.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {service.active ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => { setEditingService(service); setServiceFormOpen(true); }}
                          className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                        >
                          <Edit3 size={15} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteService(service.id)}
                          className="h-8 w-8 text-slate-500 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {services.length === 0 && !serviceFormOpen && (
                  <p className="text-center text-slate-400 py-8">No services yet. Click &quot;Add Service&quot; to create one.</p>
                )}
              </div>
            </div>
          )}

          {/* PASSWORD TAB */}
          {activeTab === 'password' && (
            <div className="space-y-6 max-w-md">
              <h3 className="text-lg font-semibold text-slate-900">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="mt-1.5"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    className="mt-1.5"
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>
              <Button
                onClick={handleChangePassword}
                disabled={loading || !currentPwd || !newPwd || !confirmPwd}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <KeyRound size={16} className="mr-2" /> Change Password
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}