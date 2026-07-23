"use client";

import React, { useState } from "react";
import { 
  Link as LinkIcon, 
  Target, 
  Bell, 
  TrendingDown, 
  Mail, 
  Sparkles, 
  Inbox, 
  ChevronDown, 
  Check, 
  ArrowRight,
  Globe,
  Share2,
  Users,
  LineChart
} from "lucide-react";
import AuthModal from "./AuthModal";
import DashboardChart from "./DashboardChart";

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      question: "How does DealDrop track product prices?",
      answer: "We use Firecrawl to scrape product URLs you provide. Our system regularly monitors the scraped page, extracts the current price, and logs it in your tracking dashboard."
    },
    {
      question: "Which e-commerce stores are supported?",
      answer: "We support major online retail stores including Amazon, Flipkart, Myntra, Ajio, Croma, Reliance Digital, and Walmart."
    },
    {
      question: "How will I be alerted about a price drop?",
      answer: "Whenever a price drop is detected, our cron system automatically sends an email notification directly to your registered inbox using Resend."
    }
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Background Gradients & Grid Texture */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid-mask opacity-80 pointer-events-none z-0" />
      <div className="absolute top-[-15%] left-[-10%] w-[750px] h-[750px] bg-violet-200/40 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[25%] right-[-5%] w-[650px] h-[650px] bg-fuchsia-100/50 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[60%] left-[-10%] w-[700px] h-[700px] bg-purple-200/40 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-[10%] w-[750px] h-[750px] bg-indigo-100/45 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main Page Layout Wrapper on top of background */}
      <div className="relative z-10">

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-background/75 backdrop-blur-md border-b border-border/40 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="/logo-2.png" alt="DealDrop Logo" className="h-12 w-full" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground hover:text-foreground">
            <a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#faqs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-gray-300 dark:hover:text-white transition-colors px-3 py-1.5"
            >
              Log in
            </button>
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-violet-600/15 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* API Support Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-violet-500/20 bg-violet-550/5 dark:bg-violet-950/20 text-violet-600 dark:text-violet-300 text-xs font-semibold mb-8 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time E-Commerce Tracker</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
          Never Miss a <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Price Drop</span> Again.
        </h1>

        {/* Description */}
        <p className="text-zinc-500 dark:text-gray-400 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10">
          Track products from your favorite online stores and receive instant email alerts when prices fall. The smartest way to save money while shopping.
        </p>

        {/* Hero CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20 z-10">
          <button 
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Start Tracking Free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mockup Card Preview */}
        <div className="w-full max-w-3xl rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/30 backdrop-blur-md p-1 shadow-2xl relative hover:border-violet-500/10 transition-all duration-500 group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000" />
          <div className="relative bg-card dark:bg-[#0e0d13] rounded-[15px] overflow-hidden">
            {/* Header of Mockup */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 dark:border-white/5 text-xs text-zinc-400 dark:text-gray-500 bg-zinc-50/50 dark:bg-black/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="font-mono">Dashboard Preview</div>
            </div>
            {/* Mockup Content */}
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-left">
              <div className="w-24 h-24 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-border dark:border-white/5 overflow-hidden flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1612858249937-1cc0852093dd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdpcmVsZXNzJTIwaGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D" 
                  alt="Headphones"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 dark:text-white font-bold text-lg sm:text-xl leading-snug mb-1">
                  Sony WH-1000XM5 Wireless Headphones
                </h3>
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-gray-400">
                  <span>Amazon</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-violet-600 dark:text-violet-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-650 dark:bg-violet-500 animate-pulse" />
                    Monitoring Live
                  </span>
                </div>
              </div>
              <div className="sm:text-right shrink-0 mt-4 sm:mt-0">
                <div className="text-zinc-900 dark:text-white font-extrabold text-2xl sm:text-3xl tracking-tight">₹26,990</div>
                <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                  <TrendingDown className="w-3.5 h-3.5" />
                  30% Drop detected
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Brands Marquee */}
      <section className="py-12 border-y border-border/50 dark:border-white/5 bg-zinc-50/20 dark:bg-zinc-950/20 backdrop-blur-sm overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <p className="text-center text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
            SUPPORTING THE BIGGEST PLATFORMS
          </p>
        </div>
        <div className="marquee-container">
          <div className="animate-marquee gap-16 text-zinc-400 dark:text-zinc-500 font-bold text-lg items-center">
            {/* Set 1 */}
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Amazon</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Flipkart</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Myntra</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Ajio</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Croma</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Reliance Digital</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Nykaa</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Tata CLIQ</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">eBay</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Walmart</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Target</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Best Buy</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Shoppers Stop</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">JioMart</span>

            {/* Set 2 */}
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Amazon</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Flipkart</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Myntra</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Ajio</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Croma</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Reliance Digital</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Nykaa</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Tata CLIQ</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">eBay</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Walmart</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Target</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Best Buy</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Shoppers Stop</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">JioMart</span>

            {/* Set 3 */}
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Amazon</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Flipkart</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Myntra</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Ajio</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Croma</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Reliance Digital</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Nykaa</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Tata CLIQ</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">eBay</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Walmart</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Target</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Best Buy</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">Shoppers Stop</span>
            <span className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">JioMart</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">Track in 3 Simple Steps</h2>
          <p className="text-zinc-500 dark:text-gray-400 max-w-xl mx-auto">Monitor price developments automatically</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="group rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 p-8 hover:border-violet-500/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <LinkIcon className="w-5 h-5 text-violet-500 dark:text-violet-400" />
            </div>
            <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-3">1. Add Product Link</h3>
            <p className="text-zinc-500 dark:text-gray-400 text-sm leading-relaxed">
              Copy the web address of your desired product and paste it in the dashboard.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 p-8 hover:border-violet-500/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-violet-500 dark:text-violet-400" />
            </div>
            <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-3">2. Automatic Tracking</h3>
            <p className="text-zinc-500 dark:text-gray-400 text-sm leading-relaxed">
              Our backend cron services scrape and evaluate page contents regularly to track fluctuations.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 p-8 hover:border-violet-500/20 hover:bg-zinc-50/50 dark:hover:bg-zinc-950/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bell className="w-5 h-5 text-violet-500 dark:text-violet-400" />
            </div>
            <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-3">3. Get Alerts</h3>
            <p className="text-zinc-500 dark:text-gray-400 text-sm leading-relaxed">
              You will get an email containing details of the price drop instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-border/50 dark:border-white/5 bg-zinc-50/10 dark:bg-zinc-950/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-4">Core Application Features</h2>
            <p className="text-zinc-500 dark:text-gray-400 max-w-xl mx-auto">Everything you need to monitor deal updates</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Price Chart Card (Span 2 columns on lg) */}
            <div className="lg:col-span-2 rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 p-8 flex flex-col justify-between hover:border-violet-500/10 transition-all shadow-md">
              <div>
                <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-6">
                  <LineChart className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                </div>
                <h3 className="text-zinc-900 dark:text-white font-bold text-xl mb-3">Price History Visualizations</h3>
                <p className="text-zinc-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
                  Get interactive history charts for each tracked item. Monitor changes dynamically to make sure you get the best deal.
                </p>
              </div>
              
              {/* Custom SVG Line Chart Mockup */}
              <div className="w-full border-t border-border/50 dark:border-white/5 pt-6 bg-white/20">
                <DashboardChart products={[{ id: "mock" }]} priceHistory={[]} />
              </div>
            </div>

            {/* Grid for Smaller Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:col-span-1">
              {/* Automated Checks */}
              <div className="rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 p-6 flex gap-4 hover:border-violet-500/10 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-violet-500 dark:text-violet-400" />
                </div>
                <div>
                  <h4 className="text-zinc-900 dark:text-white font-bold text-base mb-1">Periodic Price Checks</h4>
                  <p className="text-zinc-500 dark:text-gray-400 text-xs leading-relaxed">
                    Cron scripts process active items periodically to fetch live e-commerce updates.
                  </p>
                </div>
              </div>

              {/* Instant Email */}
              <div className="rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 p-6 flex gap-4 hover:border-violet-500/10 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5 text-violet-500 dark:text-violet-400" />
                </div>
                <div>
                  <h4 className="text-zinc-900 dark:text-white font-bold text-base mb-1">Email Alerts</h4>
                  <p className="text-zinc-500 dark:text-gray-400 text-xs leading-relaxed">
                    Alert notifications are dispatched straight to your inbox via Resend.
                  </p>
                </div>
              </div>

              {/* Free Forever */}
              <div className="rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 p-6 flex gap-4 hover:border-violet-500/10 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-4.5 h-4.5 text-violet-555 dark:text-violet-400" />
                </div>
                <div>
                  <h4 className="text-zinc-900 dark:text-white font-bold text-base mb-1">100% Free Service</h4>
                  <p className="text-zinc-500 dark:text-gray-400 text-xs leading-relaxed">
                    Fully free service with no payment requirements, limitations, or premium constraints.
                  </p>
                </div>
              </div>

              {/* Database logs */}
              <div className="rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 p-6 flex gap-4 hover:border-violet-500/10 transition-all shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <Inbox className="w-4.5 h-4.5 text-violet-500 dark:text-violet-400" />
                </div>
                <div>
                  <h4 className="text-zinc-900 dark:text-white font-bold text-base mb-1">Detailed Logs</h4>
                  <p className="text-zinc-500 dark:text-gray-400 text-xs leading-relaxed">
                    Price history datasets are kept safely in your Supabase backend.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Card spanning all 3 columns */}
            <div className="lg:col-span-3 rounded-2xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-violet-500/10 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-violet-500 dark:text-violet-400" />
              </div>
              <div>
                <h4 className="text-zinc-900 dark:text-white font-bold text-base mb-1">Shared E-Commerce Tracking</h4>
                <p className="text-zinc-500 dark:text-gray-400 text-sm leading-relaxed">
                  Easily view your tracked items, view chart history, and manage alerts from a unified dashboard.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-24 px-6 max-w-4xl mx-auto border-t border-border/50 dark:border-white/5">
        <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div 
              key={index}
              className="rounded-xl border border-border dark:border-white/5 bg-card dark:bg-zinc-950/20 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} 
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5 pt-1 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-border dark:border-white/5 bg-zinc-50/50 dark:bg-black/10">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 dark:border-white/5 bg-zinc-50/10 dark:bg-zinc-950/40 py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
            <div>
              <img src="/logo-2.png" alt="DealDrop Logo" className="h-12 w-auto mb-4" />
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm leading-relaxed">
                The definitive price tracker for the modern shopper. Save money with every purchase.
              </p>
            </div>
            
            <div className="flex gap-16">
              <div>
                <h4 className="text-zinc-900 dark:text-white font-semibold text-sm mb-4">Product</h4>
                <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <li><a href="#features" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-white transition-colors">How It Works</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-zinc-900 dark:text-white font-semibold text-sm mb-4">Support</h4>
                <ul className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
                  <li><a href="#faqs" className="hover:text-zinc-300 transition-colors">FAQs</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border dark:border-white/5 pt-8 text-xs text-zinc-500 dark:text-zinc-600 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
              <p>© {new Date().getFullYear()} DealDrop Tech. Persistent Price Tracking.</p>
              <span className="hidden sm:inline text-zinc-300">|</span>
              <p>Designed & Developed by <span className="font-semibold text-violet-600">Ashish Rathi</span></p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <span className="hover:text-zinc-700 dark:hover:text-zinc-400 cursor-pointer transition-colors flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                English
              </span>
              <span className="hover:text-zinc-700 dark:hover:text-zinc-400 cursor-pointer transition-colors">
                <Share2 className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </footer>

      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

    </div>
  );
}
