import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Lock, Mail, Smartphone, ArrowRight, User, ShieldCheck } from 'lucide-react';

const apiBase = (() => {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  return origin.includes('localhost') ? 'http://localhost:3000' : origin;
})();

const OTP_RESEND_SECONDS = 30;

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin, navigateTo, hasExistingUser, register } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [showContinuePopup, setShowContinuePopup] = useState(false);

  const registeredUser = useMemo(() => {
    try {
      const raw = localStorage.getItem('bb_registered_user') || localStorage.getItem('bb_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const isReturningUser = Boolean(hasExistingUser && registeredUser);
    if (isReturningUser) {
      setAuthMode('login');
      setShowContinuePopup(true);
      if (registeredUser?.email) {
        setEmail(registeredUser.email);
      }
      return;
    }

    if (!hasExistingUser) {
      setAuthMode('signup');
      setShowContinuePopup(false);
    }
  }, [hasExistingUser, registeredUser]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!email || !password || !name || cleanMobile.length !== 10) {
      setErrorMessage('Please enter full name, valid email, password, and 10-digit mobile number.');
      return;
    }

    const result = register(name, email, password, cleanMobile);
    if (!result) {
      setErrorMessage('Unable to create account. Please try again.');
      return;
    }

    setSuccessMessage('Account created successfully. Please continue with your profile.');
    navigateTo('home');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Enter your Gmail address and password.');
      return;
    }

    const ok = login(email, password);
    if (!ok) {
      setErrorMessage('Incorrect Gmail address or password.');
      return;
    }
    navigateTo('home');
  };

  const selectedGoogleEmail = registeredUser?.email || '';

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {showContinuePopup && registeredUser?.email && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Continue account</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Welcome back</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowContinuePopup(false)}
                className="text-slate-400 hover:text-slate-700 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 mb-4">
              <p className="text-[11px] text-slate-500">Signed in before</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{registeredUser.email}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEmail(registeredUser.email);
                setShowContinuePopup(false);
                setSuccessMessage(`Continue with Google as ${registeredUser.email}`);
              }}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Continue with Google as {registeredUser.email}
            </button>

            <button
              type="button"
              onClick={() => {
                setShowContinuePopup(false);
                setAuthMode('signup');
                setEmail('');
                setPassword('');
              }}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 text-xs"
            >
              Use another account
            </button>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          Hackathon / Evaluator Mode
        </div>
        <p className="text-xs text-amber-800">
          Use the demo profile option if you want to preview the app instantly, but normal users should complete signup or OTP login.
        </p>
        <button
          onClick={quickDemoLogin}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs shadow-xs transition-colors"
        >
          1-Click Instant Demo Login →
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <span className="text-2xl">🇮🇳</span>
          <h1 className="text-2xl font-bold text-slate-900">Sign in to Bharat Benefits</h1>
          <p className="text-xs text-slate-500">
            {authMode === 'signup'
              ? 'First-time sign-up using email and password.'
              : 'Returning user login using Gmail and password.'}
          </p>
        </div>

        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${authMode === 'signup' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
          >
            Sign Up
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold transition ${authMode === 'login' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}
          >
            Login
          </button>
        </div>

        {selectedGoogleEmail && authMode === 'login' && (
          <button
            type="button"
            onClick={() => {
              setEmail(selectedGoogleEmail);
              setSuccessMessage(`Google-style continue option selected for ${selectedGoogleEmail}`);
            }}
            className="w-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl px-3 py-2.5 text-xs flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Continue with Google as {selectedGoogleEmail}
          </button>
        )}

        <form onSubmit={authMode === 'signup' ? handleSignup : handleLogin} className="space-y-4">
          {authMode === 'signup' ? (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sandeep Kumar"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9876543210"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Gmail Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@gmail.com"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
          {successMessage && <p className="text-xs text-emerald-600">{successMessage}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {authMode === 'signup' ? 'Create Account' : 'Login'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
          {authMode === 'signup' ? 'Already have an account?' : 'Need a new account?'}{' '}
          <button
            type="button"
            onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
            className="font-bold text-blue-600 hover:underline"
          >
            {authMode === 'signup' ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};
