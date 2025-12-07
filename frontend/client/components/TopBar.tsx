'use client';

import React from 'react';
import { RefreshCw, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

export default function Topbar({ 
  title = "Air Quality Overview", 
  subtitle = "Site Tracking Dashboard",
  onRefresh,
  loading = false 
}: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`sticky top-0 z-40 ${theme === 'dark' ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} border-b`}>
      <div className="px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            {subtitle}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={toggleTheme}
            disabled={loading}
            className={`gap-2 border-0 ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={loading}
              className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white border-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}