import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TestSeries, MockTest } from '../types';
import {
  Layers,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Calendar,
  Award,
} from 'lucide-react';

interface TestSeriesViewProps {
  seriesList: TestSeries[];
  allTests: MockTest[];
  onOpenSeriesDetails: (series: TestSeries) => void;
  onBuySeries: (series: TestSeries) => void;
}

export const TestSeriesView: React.FC<TestSeriesViewProps> = ({
  seriesList,
  allTests,
  onOpenSeriesDetails,
  onBuySeries,
}) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          {t('Complete Prep Packages 2026', 'संपूर्ण परीक्षा पॅकेजेस २०२६')}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('Maharashtra Competitive Exam Test Series', 'महाराष्ट्र स्पर्धा परीक्षा टेस्ट सिरीज पॅकेजेस')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-devanagari">
          {t(
            'Enroll in comprehensive test series designed by expert educators. Includes Sectional Tests, Full Length Mock Tests, State Ranking, and Detailed Marathi Solutions.',
            'विषयनिहाय सराव, संपूर्ण मॉक टेस्ट्स, ऑल महाराष्ट्र रँकिंग आणि सविस्तर मराठी स्पष्टीकरणांसह परिपूर्ण पॅकेजेस.'
          )}
        </p>
      </div>

      {/* Series Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {seriesList.map((series) => {
          const discountPercent = series.discountPrice
            ? Math.round(((series.discountPrice - series.price) / series.discountPrice) * 100)
            : 0;

          return (
            <div
              key={series.id}
              id={`test-series-card-${series.id}`}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Header Banner */}
                <div className="p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white relative">
                  {discountPercent > 0 && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 text-[10px] font-extrabold bg-amber-400 text-slate-950 rounded-full shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                    {series.examName}
                  </span>
                  <h3 className="text-xl font-black text-white mt-3 leading-snug">
                    {series.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 font-devanagari line-clamp-2">
                    {series.description}
                  </p>
                </div>

                {/* Price block */}
                <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">₹{series.price}</span>
                    {series.discountPrice && (
                      <span className="text-sm text-slate-400 line-through">₹{series.discountPrice}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {series.validityMonths} Months Validity
                  </span>
                </div>

                {/* Features list */}
                <div className="p-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    {t('What You Will Get:', 'पॅकेजमधील वैशिष्ट्ये:')}
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <Award className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span className="font-semibold">{series.testIds.length} Full & Subject Mock Tests included</span>
                    </li>
                    {series.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-devanagari">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  id={`btn-enroll-series-${series.id}`}
                  onClick={() => onBuySeries(series)}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-indigo-600/25 transition flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                >
                  <Lock className="w-4 h-4" />
                  <span>{t(`Enroll Now at ₹${series.price}`, `₹${series.price} मध्ये प्रवेश घ्या`)}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
