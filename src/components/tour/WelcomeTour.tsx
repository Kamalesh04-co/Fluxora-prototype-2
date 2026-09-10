import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle,
  Sparkles,
  MapPin,
  TrendingUp,
  FileCheck2,
  BookUser,
} from 'lucide-react';

export const WelcomeTour: React.FC = () => {
  const { isTourOpen, setIsTourOpen } = useCommand();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isTourOpen) return null;

  const steps = [
    {
      title: 'Welcome to Fluxora Command Center',
      description:
        'Fluxora is an enterprise autonomous ship routing intelligence platform engineered to safeguard cargo, maximize net margins through multi-factor arbitrage, and ensure SOLAS compliance.',
      icon: Compass,
      targetHighlight: 'Global Command Matrix',
    },
    {
      title: 'Top Operational Metric Cards',
      description:
        'Monitor Net Profit Margin Delta (+14.2% / +$284,500), Vessel & Cargo Safety Score (98.4% Nominal), and Customer SLA Comfort Percentile (96.8%), alongside 6 autonomous micro-agents.',
      icon: TrendingUp,
      targetHighlight: 'tour-top-metric-cards',
    },
    {
      title: '6 Core Navigation Modules',
      description:
        'Seamlessly toggle between Threats & Geopolitical Risks, Taxes & Financial Tariffs, Life Sources & Telemetry, Live GIS Navigation, Preference Routes (Plans A, B, C), and AI Situation Prediction.',
      icon: MapPin,
      targetHighlight: 'tour-navigation-sidebar',
    },
    {
      title: 'Human-in-the-Loop Blockchain Execution',
      description:
        'Before any autonomous course alteration is dispatched to the autopilot, authorized officers review quantitative cost-benefit models and cryptographically sign the reroute manifest.',
      icon: FileCheck2,
      targetHighlight: 'btn-sign-reroute-sidebar',
    },
    {
      title: 'Port Authorities & Maritime Agents Directory',
      description:
        'Access 24/7 Harbour Masters, VTS desks, VHF emergency channels, and certified husbandry shipping agents across your Current Voyage, Plan A, B, C, and 10 strategic reroute safe harbors.',
      icon: BookUser,
      targetHighlight: 'btn-port-directory-header',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTourOpen(false);
      setCurrentStep(0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const StepIcon = step.icon;

  return (
    <div
      id="modal-welcome-tour"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/50 rounded-2xl shadow-2xl p-6 relative text-slate-100 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={() => {
            setIsTourOpen(false);
            setCurrentStep(0);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Indicator */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase font-bold">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-xs text-slate-400 font-mono">System Walkthrough</span>
        </div>

        {/* Step Content */}
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
            <StepIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">{step.title}</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{step.description}</p>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
