
import React, { useState } from 'react';
import {
  Star,
  Send,
  CheckCircle2,
  Sparkles,
  Heart,
  Lightbulb,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const feedbackCategories = [
  'Overall Experience',
  'Eligibility Checker',
  'AI Copilot',
  'Scheme Information',
  'Application Tracking',
  'Website Design',
  'Other'
];

const improvementOptions = [
  'More Government Schemes',
  'Better AI Answers',
  'More Regional Languages',
  'Simpler Application Process',
  'Better Mobile Experience',
  'More Notifications'
];

export const FeedbackPage: React.FC = () => {
  const { navigateTo, user } = useApp();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('Overall Experience');
  const [experience, setExperience] = useState('');
  const [feedback, setFeedback] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleImprovement = (option: string) => {
    setImprovements(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating) {
      alert('Please select a rating.');
      return;
    }

    if (!feedback.trim()) {
      alert('Please share your feedback.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user?.id || 'guest_user',
          name: user?.name || 'Anonymous Citizen',
          email: user?.email || '',
          rating,
          category,
          experience,
          feedback: feedback.trim(),
          improvements
        })
      });

      if (!response.ok) {
        throw new Error('Feedback submission failed');
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Unable to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full text-center">

          <div className="relative mx-auto mb-8 w-24 h-24">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-50" />
            <div className="relative w-24 h-24 bg-emerald-50 border-4 border-emerald-200 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10">

            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold">
                🇮🇳 Thank You, Citizen!
              </span>
            </div>

            <h1 className="text-3xl font-black text-slate-900">
              Your Voice Matters
            </h1>

            <p className="text-slate-500 mt-3 leading-relaxed">
              Thank you for helping us make Bharat Benefits Navigator
              simpler, smarter and more useful for every Indian citizen.
            </p>

            <div className="mt-6 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-7 h-7 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => navigateTo('home')}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Bharat Benefits Navigator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-8 sm:py-12 px-4">

      {/* Hero */}
      <div className="max-w-5xl mx-auto text-center mb-10">

        

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Your Voice
          <span className="text-blue-600"> Matters.</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-500 mt-4 leading-relaxed">
          Tell us how Bharat Benefits Navigator helped you.
          Your feedback helps us build a better digital gateway
          to government benefits.
        </p>

        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Citizen First
          </span>

          <span className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            Your Opinion Matters
          </span>

          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Help Us Improve
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto"
      >

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">

          {/* Rating Section */}
          <div className="p-6 sm:p-8 bg-linear-to-br from-blue-50 via-white to-indigo-50 border-b border-slate-100">

            <div className="text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-blue-100 shadow-sm flex items-center justify-center mb-4">
                <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
              </div>

              <h2 className="text-xl font-black text-slate-900">
                How was your experience?
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Rate your experience from 1 to 5
              </p>

              <div className="flex justify-center gap-2 sm:gap-3 mt-6">

                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="group p-2 rounded-xl hover:bg-white transition-all"
                  >
                    <Star
                      className={`w-9 h-9 sm:w-11 sm:h-11 transition-all duration-200 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400 scale-110'
                          : 'text-slate-300 group-hover:text-amber-300'
                      }`}
                    />
                  </button>
                ))}

              </div>

              <div className="h-5 mt-2">
                {rating > 0 && (
                  <p className="text-xs font-bold text-slate-600">
                    {rating === 1 && 'We can do much better 😔'}
                    {rating === 2 && 'Needs improvement 🙁'}
                    {rating === 3 && 'It was okay 🙂'}
                    {rating === 4 && 'Great experience! 😊'}
                    {rating === 5 && 'Amazing! Thank you! ❤️'}
                  </p>
                )}
              </div>

            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">

            {/* Category */}
            <div>
              <label className="text-sm font-black text-slate-900 block mb-3">
                What would you like to give feedback about?
              </label>

              <div className="flex flex-wrap gap-2">

                {feedbackCategories.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      category === item
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}

              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="text-sm font-black text-slate-900 block mb-3">
                How did Bharat Benefits Navigator make you feel?
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">

                {[
                  ['😍', 'Loved it'],
                  ['😊', 'Happy'],
                  ['🙂', 'Good'],
                  ['😐', 'Okay'],
                  ['😕', 'Confused']
                ].map(([emoji, label]) => (

                  <button
                    key={label}
                    type="button"
                    onClick={() => setExperience(label)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      experience === label
                        ? 'border-blue-500 bg-blue-50 shadow-sm scale-[1.02]'
                        : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-2xl">{emoji}</div>
                    <div className="text-[11px] font-bold text-slate-600 mt-1">
                      {label}
                    </div>
                  </button>

                ))}

              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="text-sm font-black text-slate-900 block mb-2">
                Tell us what you think
              </label>

              <div className="relative">

                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  rows={5}
                  maxLength={1000}
                  placeholder="What did you like? What can we improve? Was anything confusing?"
                  className="w-full resize-none px-4 py-3.5 pb-8 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none text-sm text-slate-700 placeholder:text-slate-400 transition-all"
                />

                <span className="absolute bottom-3 right-4 text-[10px] text-slate-400">
                  {feedback.length}/1000
                </span>

              </div>
            </div>

            {/* Improvement */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <label className="text-sm font-black text-slate-900">
                  What should we improve?
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                {improvementOptions.map(option => (

                  <label
                    key={option}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      improvements.includes(option)
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >

                    <input
                      type="checkbox"
                      checked={improvements.includes(option)}
                      onChange={() => toggleImprovement(option)}
                      className="w-4 h-4 accent-blue-600"
                    />

                    <span className="text-xs font-semibold text-slate-700">
                      {option}
                    </span>

                  </label>

                ))}

              </div>
            </div>

            {/* Submit */}
            <div className="pt-5 border-t border-slate-100">

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >

                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending your feedback...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send My Feedback
                  </>
                )}

              </button>

              <p className="text-[10px] text-center text-slate-400 mt-3">
                Your feedback helps us improve Bharat Benefits Navigator
                for citizens across India 🇮🇳
              </p>

            </div>

          </div>
        </div>

      </form>
    </div>
  );
};

