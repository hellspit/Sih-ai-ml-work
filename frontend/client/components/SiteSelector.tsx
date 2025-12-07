// import { MapPin, ChevronDown } from 'lucide-react';
// import { useState } from 'react';
// import { useTheme } from '@/contexts/ThemeContext';

// const SITE_NAMES: { [key: number]: string } = {
//   1: 'Satyawati College',
//   2: 'RK Puram',
//   3: 'East Delhi',
//   4: 'North Delhi',
//   5: 'South Delhi',
//   6: 'West Delhi',
//   7: 'Central Delhi',
// };

// interface SiteSelectorProps {
//   selectedSite: number;
//   onSiteChange: (siteId: number) => void;
//   disabled?: boolean;
// }

// export default function SiteSelector({
//   selectedSite,
//   onSiteChange,
//   disabled = false,
// }: SiteSelectorProps) {
//   const { theme } = useTheme();
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className={`rounded-xl shadow-lg border p-6 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
//       <div className="flex items-center gap-2 mb-4">
//         <MapPin className="w-5 h-5 text-cyan-500" />
//         <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>SIte Select </h2>
//       </div>

//       <div className="relative">
//         <button
//           onClick={() => setIsOpen(!isOpen)}
//           disabled={disabled}
//           className={`w-full px-4 py-3 border rounded-lg flex items-center justify-between transition-colors disabled:opacity-50 ${
//             theme === 'dark'
//               ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
//               : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'
//           }`}
//         >
//           <span className="font-medium">
//             Site {selectedSite} - {SITE_NAMES[selectedSite]}
//           </span>
//           <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//         </button>

//         {isOpen && (
//           <div className={`absolute top-full left-0 right-0 mt-2 border rounded-lg shadow-lg z-10 ${
//             theme === 'dark'
//               ? 'bg-slate-700 border-slate-600'
//               : 'bg-white border-slate-300'
//           }`}>
//             {Array.from({ length: 7 }, (_, i) => i + 1).map((siteId) => (
//               <button
//                 key={siteId}
//                 onClick={() => {
//                   onSiteChange(siteId);
//                   setIsOpen(false);
//                 }}
//                 className={`w-full px-4 py-3 text-left font-medium transition-colors ${
//                   selectedSite === siteId
//                     ? 'bg-cyan-600 text-white'
//                     : theme === 'dark'
//                     ? 'text-slate-100 hover:bg-slate-600'
//                     : 'text-slate-900 hover:bg-slate-100'
//                 } ${siteId === 1 ? 'rounded-t-lg' : ''} ${siteId === 7 ? 'rounded-b-lg' : ''} border-b ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'} last:border-b-0`}
//               >
//                 Site {siteId} - {SITE_NAMES[siteId]}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import { MapPin, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const SITE_NAMES: { [key: number]: string } = {
  1: 'Satyawati College',
  2: 'RK Puram',
  3: 'East Delhi',
  4: 'North Delhi',
  5: 'South Delhi',
  6: 'West Delhi',
  7: 'Central Delhi',
};

interface SiteSelectorProps {
  selectedSite: number;
  onSiteChange: (siteId: number) => void;
  disabled?: boolean;
}

export default function SiteSelector({
  selectedSite,
  onSiteChange,
  disabled = false,
}: SiteSelectorProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div >
      
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-100 px-4 py-3 border rounded-lg flex items-center justify-between transition-colors disabled:opacity-50 ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
              : 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100'
          }`}
        ><MapPin className="w-5 h-5 text-cyan-500" />
          <span className="font-medium">
            
            &nbsp;&nbsp;Site {selectedSite} - {SITE_NAMES[selectedSite]}
          
          &nbsp;&nbsp;</span> 
          {/* &nbsp is for inserting white space for some margin between names and icons */}
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className={`absolute top-full left-0 right-0 mt-2 border rounded-lg shadow-lg z-10 ${
            theme === 'dark'
              ? 'bg-slate-700 border-slate-600'
              : 'bg-white border-slate-300'
          }`}>
            {Array.from({ length: 7 }, (_, i) => i + 1).map((siteId) => (
              <button
                key={siteId}
                onClick={() => {
                  onSiteChange(siteId);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left font-medium transition-colors ${
                  selectedSite === siteId
                    ? 'bg-cyan-600 text-white'
                    : theme === 'dark'
                    ? 'text-slate-100 hover:bg-slate-600'
                    : 'text-slate-900 hover:bg-slate-100'
                } ${siteId === 1 ? 'rounded-t-lg' : ''} ${siteId === 7 ? 'rounded-b-lg' : ''} border-b ${theme === 'dark' ? 'border-slate-600' : 'border-slate-200'} last:border-b-0`}
              >
                Site {siteId} - {SITE_NAMES[siteId]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
