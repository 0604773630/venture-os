import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LogIn,
  LayoutDashboard,
  Menu,
  X,
  CreditCard,
  Zap,
  DollarSign,
  Briefcase,
  Code,
  FileText,
  CheckCircle,
  AlertTriangle,
  LogOut,
  Settings,
  Shield
} from 'lucide-react';

// =================================================================
// 1. SUPABASE INITIALIZATION (Internal)
// =================================================================

// Define the type for the Supabase client to use in the file.
// We use 'any' as requested to avoid complex Supabase types and strict TypeScript errors.
type SupabaseClient = any;
type Session = any;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback/Mock Client definition
const mockSupabaseClient: SupabaseClient = {
  auth: {
    getSession: async () => ({
      data: { session: null },
      error: null
    }),
    signInWithOtp: async ({ email }: { email: string }) => {
      console.log(`[MOCK] Magic link sent to ${email}`);
      return { data: { user: null, session: null }, error: null };
    },
    signOut: async () => {
      console.log('[MOCK] User Signed Out');
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
      // Mock listener: does nothing, but prevents app crash
      console.log('[MOCK] Auth listener set up.');
      return { data: { subscription: { unsubscribe: () => console.log('[MOCK] Unsubscribed') } } };
    },
  },
};

// Initialize the actual or mock Supabase client
const supabase: SupabaseClient = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (() => {
      console.warn("WARNING: Supabase URL or ANON Key is missing. Using mock client.");
      return mockSupabaseClient;
    })();

// =================================================================
// 2. TYPES
// =================================================================

interface GenerationResult {
  websiteCode: string;
  documents: { name: string; content: string }[];
}

interface PricingTier {
  name: string;
  price: number;
  credits: number;
  features: string[];
  cta: string;
  style: string;
}

// =================================================================
// 3. PRICING MODAL COMPONENT
// =================================================================

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (credits: number) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onPurchase }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState('');

  const tiers: PricingTier[] = [
    {
      name: 'Solo Builder',
      price: 29,
      credits: 5,
      features: ['5 Generation Credits', 'Standard AI Model', 'Community Support', 'Basic Templates'],
      cta: 'Purchase 5 Credits',
      style: 'border-slate-700 hover:border-violet-500'
    },
    {
      name: 'Startup Pro',
      price: 99,
      credits: 20,
      features: ['20 Generation Credits', 'Advanced AI Model (GPT-4)', 'Priority Support', 'Premium Templates', 'Code Export'],
      cta: 'Best Value - Get 20 Credits',
      style: 'border-violet-500 ring-2 ring-violet-500 shadow-lg shadow-violet-500/30'
    },
    {
      name: 'Agency OS',
      price: 399,
      credits: 100,
      features: ['100 Generation Credits', 'Max-Tier AI Access', 'Dedicated Account Manager', 'API Access', 'White-Label Options'],
      cta: 'Purchase 100 Credits',
      style: 'border-slate-700 hover:border-violet-500'
    },
  ];

  const handlePurchase = (tier: PricingTier) => {
    setIsProcessing(true);
    setPurchaseMessage(`Processing payment for ${tier.name}...`);

    // Simulate payment API call
    setTimeout(() => {
      setIsProcessing(false);
      onPurchase(tier.credits);
      setPurchaseMessage(`Successfully added ${tier.credits} credits!`);
      // Auto-close after a short delay
      setTimeout(onClose, 1000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl max-w-6xl w-full p-8 shadow-2xl shadow-violet-500/20 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-white flex items-center">
            <CreditCard className="w-6 h-6 mr-3 text-violet-400" />
            Top Up Credits
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isProcessing && (
          <div className="mb-6">
            <p className="text-violet-400 font-mono mb-2">{purchaseMessage}</p>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-violet-500 h-2.5 rounded-full animate-pulse"
                style={{ width: '100%' }}
              ></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`p-6 rounded-lg bg-slate-800 transition-all duration-300 border ${tier.style} flex flex-col`}
            >
              <Zap className="w-8 h-8 text-violet-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-4xl font-extrabold text-violet-400 mb-4">
                ${tier.price}
                <span className="text-sm font-normal text-slate-400"> / one-time</span>
              </p>
              <div className="text-slate-300 mb-6 flex-grow">
                <p className="font-semibold text-lg mb-2">{tier.credits} Credits</p>
                <ul className="space-y-2 text-sm">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0 mt-1" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handlePurchase(tier)}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
                  isProcessing
                    ? 'bg-slate-700 cursor-not-allowed'
                    : 'bg-violet-600 hover:bg-violet-500 focus:ring-4 focus:ring-violet-500/50'
                }`}
              >
                {isProcessing ? 'Processing...' : tier.cta}
              </button>
            </div>
          ))}
        </div>
        {supabase === mockSupabaseClient && (
          <p className="mt-6 text-center text-yellow-500 text-sm flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Note: Payment is simulated because environment keys are missing.
          </p>
        )}
      </div>
    </div>
  );
};


// =================================================================
// 4. LOGIN SCREEN COMPONENT
// =================================================================

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (supabase === mockSupabaseClient) {
        // Mock client behavior
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMessage(`[ACCESS GRANTED]: Magic link simulated and sent to: ${email}. Check your console!`);
        console.log(`[MOCK AUTH]: Pretending to send magic link to ${email}. Check your email to sign in!`);
        setLoading(false);
        return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) throw error;
      setMessage('SUCCESS: Check your email for the magic link to log in.');
    } catch (error: any) {
      setMessage(`ERROR: Failed to send magic link. ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-violet-700 shadow-2xl shadow-violet-500/30 p-8 rounded-lg">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-violet-400 font-mono mb-2 flex items-center">
            <Shield className="w-7 h-7 mr-2" />
            Venture OS <span className="text-slate-500">_</span>
          </h1>
          <p className="text-slate-400 text-sm font-mono">// Secure Access Terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-green-400 font-mono mb-1">
              $ USER_EMAIL
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email to receive a magic link..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800 text-green-400 border border-slate-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 rounded-md shadow-inner transition duration-150 font-mono"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md text-white font-bold transition duration-200 flex items-center justify-center ${
              loading
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-500 focus:ring-4 focus:ring-violet-500/50'
            }`}
          >
            {loading ? (
              <>
                <Zap className="w-5 h-5 mr-2 animate-pulse" />
                Sending Magic Link...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Initiate Secure Login
              </>
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-md ${message.startsWith('ERROR') ? 'bg-red-900/50 border border-red-700 text-red-300' : 'bg-green-900/50 border border-green-700 text-green-300'} font-mono text-sm`}>
            {message}
          </div>
        )}
      </div>
      {supabase === mockSupabaseClient && (
        <div className="absolute bottom-4 text-center text-yellow-500 text-xs p-2 rounded bg-black/50 border border-yellow-700">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Mock Client Active. No actual API call will be made.
        </div>
      )}
    </div>
  );
};

// =================================================================
// 5. DASHBOARD COMPONENTS
// =================================================================

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  credits: number;
  openPricingModal: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen, credits, openPricingModal, onLogout }) => {
  const navItems = [
    { name: 'Business Builder', icon: Briefcase, current: true },
    { name: 'Settings', icon: Settings, current: false },
    { name: 'Documentation', icon: FileText, current: false },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-700 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex justify-between items-center mb-6 lg:justify-start">
            <h2 className="text-xl font-bold text-violet-400 font-mono">Venture OS</h2>
            <button
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-grow space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href="#"
                className={`flex items-center p-3 rounded-lg transition duration-150 ${
                  item.current
                    ? 'bg-violet-900/50 text-violet-400 font-semibold border-l-4 border-violet-500'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            ))}
          </nav>

          {/* Credit Display & Top Up */}
          <div className="mt-auto pt-4 border-t border-slate-800">
            <div className="p-3 bg-slate-800 rounded-lg mb-3">
              <div className="flex items-center justify-between text-white">
                <span className="text-sm text-slate-400 font-mono flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                  Credits Available
                </span>
                <span className="text-xl font-bold text-yellow-300">{credits}</span>
              </div>
            </div>
            <button
              onClick={openPricingModal}
              className="w-full flex items-center justify-center py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition duration-150 focus:ring-4 focus:ring-green-500/50"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Top Up
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center py-2 mt-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition duration-150"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// =================================================================
// 6. MAIN DASHBOARD COMPONENT
// =================================================================

interface DashboardProps {
  credits: number;
  setCredits: (credits: number) => void;
  openPricingModal: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ credits, setCredits, openPricingModal, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [businessIdea, setBusinessIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationResult, setGenerationResult] = useState<GenerationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'website' | 'documents'>('website');

  const canGenerate = credits > 0 && businessIdea.trim().length > 10;
  const MIN_CREDITS_REQUIRED = 1;

  const handleGenerate = async () => {
    if (!canGenerate) {
      alert(credits === 0 ? "Insufficient credits. Please top up." : "Please enter a detailed business idea.");
      return;
    }

    setIsLoading(true);
    setGenerationResult(null);

    // Simulate API POST request to /api/generate
    console.log(`[API CALL] Sending POST request with idea: "${businessIdea}"`);

    // In a real app, this would be a fetch call:
    // const response = await fetch('/api/generate', { method: 'POST', body: JSON.stringify({ prompt: businessIdea }) });
    // const data = await response.json();

    // Simulation logic
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3-second network/AI latency

    // Mock API Response Data
    const mockResult: GenerationResult = {
      websiteCode: `// Generated HTML/React Code
<header class="bg-violet-900 text-white p-4">
  <div class="container mx-auto flex justify-between items-center">
    <h1 class="text-2xl font-bold">${businessIdea.substring(0, 20)}...</h1>
    <nav>
      <a href="#features" class="mx-2 hover:text-violet-300">Features</a>
      <a href="#pricing" class="mx-2 hover:text-violet-300">Pricing</a>
    </nav>
  </div>
</header>
<main class="py-20 bg-slate-900 text-slate-200">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-extrabold text-center text-violet-400 mb-10">Launch Your Venture Today</h2>
    <p class="text-center max-w-2xl mx-auto">${businessIdea}</p>
  </div>
</main>
// ... (rest of the code)
`,
      documents: [
        { name: 'Business_Plan_v1.0.pdf', content: `Executive Summary: A comprehensive plan for ${businessIdea}. Market analysis indicates a strong growth potential in the next 3 years...` },
        { name: 'Marketing_Strategy.pdf', content: 'Strategy: Focus on digital channels, primarily paid social (LinkedIn, X) and targeted content marketing (SEO)...' },
        { name: 'Financial_Projections.xlsx', content: 'Q1 Revenue: $50k. Q2 Revenue: $120k. YoY Growth: 300%... (Simulated Data)' },
      ],
    };

    setGenerationResult(mockResult);
    setCredits(credits - MIN_CREDITS_REQUIRED);
    setIsLoading(false);
  };

  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const generatorSection = useMemo(() => (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
      <h3 className="text-2xl font-bold text-violet-400 mb-4 flex items-center">
        <Briefcase className="w-5 h-5 mr-2" />
        Business Plan Generator
      </h3>
      <div className="space-y-4">
        <textarea
          value={businessIdea}
          onChange={(e) => setBusinessIdea(e.target.value)}
          rows={5}
          placeholder="Enter your detailed business idea here (e.g., 'A generative AI tool for creating personalized learning paths for developers new to TypeScript and React...')"
          className="w-full p-4 bg-slate-800 text-slate-200 border border-slate-700 rounded-lg focus:ring-violet-500 focus:border-violet-500 resize-none placeholder:text-slate-500"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !canGenerate}
          className={`w-full py-3 rounded-lg text-white font-bold transition duration-200 flex items-center justify-center ${
            !canGenerate || isLoading
              ? 'bg-slate-700 cursor-not-allowed'
              : 'bg-violet-600 hover:bg-violet-500 focus:ring-4 focus:ring-violet-500/50'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center">
              <Zap className="w-5 h-5 mr-2 animate-spin" />
              Generating Venture...
            </div>
          ) : (
            <>
              <Zap className="w-5 h-5 mr-2" />
              Generate Business & Website (Costs {MIN_CREDITS_REQUIRED} Credit)
            </>
          )}
        </button>
      </div>
      {!isLoading && credits === 0 && (
        <p className="mt-4 text-center text-red-400 flex items-center justify-center text-sm">
          <AlertTriangle class
