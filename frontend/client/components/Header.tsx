// import { Button } from "@/components/ui/button";
// import { Wind } from "lucide-react";

// export default function Header() {
//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between">
//           <div className="flex items-center gap-2 sm:gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
//               <Wind className="h-6 w-6 text-white" />
//             </div>
//             <span className="hidden text-lg font-bold text-gray-900 sm:inline">
//               AirFore
//             </span>
//           </div>

//           <nav className="hidden items-center gap-8 md:flex">
//             <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
//               Features
//             </a>
//             <a href="#pipeline" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
//               Pipeline
//             </a>
//             <a href="#case-study" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
//               Case Study
//             </a>
//           </nav>

//           <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0">
//             Get Started
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// }


'use client';

import React from 'react';
import { RefreshCw, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onRefresh?: () => void;
  loading?: boolean;
  showRefresh?: boolean;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
}

export default function Header({ 
  title = 'Air Quality Overview',
  subtitle = 'Site Tracking Dashboard',
  onRefresh,
  loading = false,
  showRefresh = true,
  theme = 'dark',
  onThemeToggle
}: HeaderProps) {
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
          {onThemeToggle && (
            <button
              onClick={onThemeToggle}
              disabled={loading}
              className={`gap-2 border-0 px-4 py-2 rounded-md flex items-center ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          )}
          {showRefresh && onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white border-0 px-4 py-2 rounded-md flex items-center"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>
      </div>
    </div>
  );
}