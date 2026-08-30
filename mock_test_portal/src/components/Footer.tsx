import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { GraduationCap, ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC<{
  onSelectCategory: (examId: string) => void;
  onNavigateAdmin?: () => void;
}> = ({ onSelectCategory, onNavigateAdmin }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Pariksha<span className="text-indigo-400">Setu</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-devanagari">
              {t(
                'India’s leading mock examination platform tailored for Maharashtra Competitive Exams (MPSC, Police Bharti, Talathi, ZP, MahaIT) and Central Exams (SSC, Banking, Railway, UPSC) with Marathi & English bilingual solutions.',
                'महाराष्ट्र लोकसेवा आयोग (MPSC), पोलीस भरती, तलाठी, सरळसेवा, बँकिंग व SSC परीक्षांसाठी उच्च दर्जाची मॉक टेस्ट सिरीज आणि परिपूर्ण स्पष्टीकरणे.'
              )}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> {t('Verified TCS / IBPS Exam Pattern', 'TCS / IBPS पॅटर्ननुसार आधारित')}
              </span>
            </div>
          </div>

          {/* Column 2: Maharashtra Exams */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3.5">
              {t('Maharashtra Exams', 'महाराष्ट्र परीक्षा')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectCategory('exam-mpsc')} className="hover:text-indigo-400 transition text-left">
                  MPSC Rajyaseva (राज्यसेवा)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('exam-mpsc')} className="hover:text-indigo-400 transition text-left">
                  MPSC Combine Group B & C
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('exam-police')} className="hover:text-indigo-400 transition text-left">
                  Maharashtra Police Bharti (पोलीस भरती)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('exam-talathi')} className="hover:text-indigo-400 transition text-left">
                  Talathi Bharti TCS Pattern (तलाठी)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('exam-maha-gov')} className="hover:text-indigo-400 transition text-left">
                  Zilla Parishad & Arogya Vibhag
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Central Exams */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3.5">
              {t('National Exams', 'राष्ट्रीय परीक्षा')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onSelectCategory('exam-ssc')} className="hover:text-indigo-400 transition text-left">
                  SSC CGL / CHSL / MTS
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('exam-banking')} className="hover:text-indigo-400 transition text-left">
                  IBPS PO & Clerk Mocks
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('exam-railway')} className="hover:text-indigo-400 transition text-left">
                  RRB NTPC & Group D
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('exam-upsc')} className="hover:text-indigo-400 transition text-left">
                  UPSC Civil Services Prelims
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('exam-teaching')} className="hover:text-indigo-400 transition text-left">
                  MahaTET & TAIT Teacher Exam
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Help & Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3.5">
              {t('Support & Contact', 'मदत व संपर्क')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>support@parikshasetu.in</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>+91 98230 00000 (Mon-Sat)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>FC Road, Shivajinagar, Pune 411005</span>
              </li>
              <li className="pt-2">
                <span className="inline-block px-2.5 py-1 text-[11px] font-bold bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                  Razorpay Secured • 100% Guaranteed Solutions
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <p>© {new Date().getFullYear()} ParikshaSetu EdTech Pvt Ltd. All rights reserved.</p>
            {onNavigateAdmin && (
              <button
                id="footer-admin-link"
                onClick={onNavigateAdmin}
                className="text-slate-500 hover:text-slate-300 transition text-[11px] font-medium underline underline-offset-2 cursor-pointer"
              >
                Faculty / Admin Portal (/admin)
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Maharashtra & Indian Civil Aspirants</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
