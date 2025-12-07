'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { 
  ChartNoAxesCombined, 
  Bot, 
  Lightbulb, 
  ArrowLeftRight, 
  ShieldCheck, 
  Check,
  Moon,
  Sun
} from 'lucide-react';

export default function About() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`p-8 min-h-full ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Right: Theme Toggle */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className={`rounded-full ${
            theme === 'dark' 
              ? 'bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700' 
              : 'bg-white border-slate-200 text-slate-900 hover:bg-slate-100'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col gap-12 sm:gap-16 max-w-[960px] mx-auto pb-12">
        
        {/* Hero Section */}
        <div className="@container">
          <div 
            className="flex min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-2xl items-center justify-center p-8 text-center shadow-sm"
            style={{
              // Using a dark overlay to ensure text readability regardless of the image
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.4)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuC65572SJiCu9zfzrsVVm_Jnl5Tb0UmsTqjIc00yfQcpfgOnxJCmyVpWE4ToNrCnTjg89L31O4XKh6nOQ0xwnnjQ5eVwbQW9D03rmv4IG4d_EuPYjbXND-ba9y3vMpb5mSxXmkzgjU2Q-QifO5NvFsinWi29gdzdRDEPdgoOg2knsw6LqSYbSsgm17hmzR9dnfQQhLTdb75OWoKVMvhG8fYixLK1nN7lclBLzZ7UvIafP44IJEcQoGF85VixQ7piVhTHcfkchnFqtg")`
            }}
          >
            <div className="flex flex-col gap-4 max-w-2xl">
              <h1 className="text-white text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                SKYSENSE 
              </h1>
              <h2 className="text-slate-200 text-base sm:text-lg font-medium leading-relaxed">
                We provide simple, trustworthy air-quality information for Delhi by showing current pollution levels and short-term forecasts so anyone can plan their day with confidence.
              </h2>
            </div>
          </div>
        </div>
        
        {/* What This Platform Does */}
        <div>
          <h2 className={`text-2xl font-bold tracking-tight px-1 pb-6 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            What This Platform Does
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                icon: <ChartNoAxesCombined className="w-6 h-6 text-cyan-500" />, 
                title: 'Real-time Data', 
                desc: 'View live O₃, NO₂, CO, HCHO, PM₂.₅ and PM₁₀ levels across all 7 regions of Delhi.' 
              },
              { 
                icon: <Bot className="w-6 h-6 text-cyan-500" />, 
                title: 'Predictive Forecast', 
                desc: 'See hourly predictions for the next 24 to 48 hours, based on scientific modeling.' 
              },
              { 
                icon: <Lightbulb className="w-6 h-6 text-cyan-500" />, 
                title: 'Actionable Insights', 
                desc: 'Understand whether the current air is safe, moderate, or unhealthy.' 
              },
              { 
                icon: <ArrowLeftRight className="w-6 h-6 text-cyan-500" />, 
                title: 'Location Comparison', 
                desc: 'Compare pollution between two regions to understand how levels vary.' 
              }
            ].map((item, idx) => (
              <div key={idx} className={`flex flex-1 gap-4 rounded-xl border p-5 flex-col transition-all hover:shadow-md ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'}`}>
                <div className={`p-2 w-fit rounded-lg ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  {item.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className={`text-base font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm font-normal leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How Forecasting Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="flex flex-col gap-4">
            <h2 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              How Forecasting Works
            </h2>
            <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              <p className="mb-4">
                Our system combines meteorological data, satellite observations, and reanalysis datasets to forecast ground-level O₃ and NO₂.
              </p>
              <p className="font-semibold mb-2">The forecasting pipeline includes:</p>
              <ul className="space-y-2 ml-1">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  Collecting atmospheric and weather variables
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  Processing and aligning data from multiple sources
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  Running trained ML-based models
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  Generating hourly predictions for each region
                </li>
              </ul>
              <p className="mt-4">
                The goal is to help the public anticipate pollution changes before they happen.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div>
              <h2 className={`text-2xl font-bold tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Data Reliability
              </h2>
              <div className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                We use multiple trusted sources to ensure accuracy, including satellite-derived trace gas concentrations, meteorological reanalysis fields, and calibrated model outputs.
              </div>
            </div>
            
            <div className={`flex flex-col gap-3 rounded-xl border p-5 ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-500 flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    Transparent Data Sources
                  </h4>
                  <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    We aggregate data from the EPA, OpenAQ, and local environmental agencies to provide the most accurate picture possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="flex flex-col gap-6">
          <div className="max-w-3xl">
            <h2 className={`text-2xl font-bold tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Why It Matters
            </h2>
            <p className={`text-base leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Air quality has a direct impact on our health, daily activities, and the environment. Understanding the Air Quality Index (AQI) can help you take steps to reduce exposure to pollutants.
            </p>
          </div>

          <div className={`flex flex-col gap-6 p-6 rounded-xl border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/30' : 'border-slate-200 bg-white'}`}>
            <ul className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <li className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="font-medium">Affects respiratory health, especially for sensitive groups.</span>
              </li>
              <li className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="font-medium">Influences decisions about outdoor activities and exercise.</span>
              </li>
              <li className="flex flex-col gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <Check className="w-5 h-5" />
                </div>
                <span className="font-medium">Provides insight into local pollution sources and trends.</span>
              </li>
            </ul>
            
            {/* AQI Color Scale Visual */}
            <div className="mt-2">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>AQI Scale</p>
              <div className="flex h-4 w-full rounded-full overflow-hidden">
                <div className="flex-1 h-full bg-[#00e400]" title="Good"></div>
                <div className="flex-1 h-full bg-[#ffff00]" title="Moderate"></div>
                <div className="flex-1 h-full bg-[#ff7e00]" title="Unhealthy for Sensitive Groups"></div>
                <div className="flex-1 h-full bg-[#ff0000]" title="Unhealthy"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Behind the Project */}
        <div className="text-center py-12 border-t border-dashed border-slate-200 dark:border-slate-800">
          <h2 className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Behind the Project
          </h2>
          <p className={`text-base mt-4 max-w-2xl mx-auto leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            This platform is a project by <a className="font-bold text-cyan-500 hover:text-cyan-400 underline decoration-2 decoration-cyan-500/30 hover:decoration-cyan-500 transition-all" href="#">Take Flowers</a>, in partnership with meteorological and environmental data sources.
            The aim is to translate complex scientific datasets into clear, reliable information for the public.
          </p>
        </div>
      </div>
    </div>
  );
}