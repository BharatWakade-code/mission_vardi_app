import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { PYQItem } from '../types';
import {
  FileText,
  Download,
  Calendar,
  Layers,
  Search,
  BookOpen,
  Award,
  Filter,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Play,
} from 'lucide-react';

interface PYQViewProps {
  onStartTestByExam?: (examCategory: string) => void;
}

export const PYQView: React.FC<PYQViewProps> = ({ onStartTestByExam }) => {
  const { t } = useLanguage();
  const [pyqs, setPyqs] = useState<PYQItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'सर्व परीक्षा (All)' },
    { id: 'police_bharti', label: 'महाराष्ट्र पोलीस शिपाई (Police Bharti)' },
    { id: 'srpf', label: 'राज्य राखीव पोलीस (SRPF)' },
    { id: 'driver', label: 'पोलीस चालक (Driver)' },
    { id: 'mpsc_combine', label: 'MPSC कम्बाइन गट-ब व क' },
    { id: 'talathi', label: 'तलाठी भरती (Talathi)' },
  ];

  const years = ['all', '2024', '2023', '2022', '2021', '2019', '2018'];

  const fetchPYQs = async () => {
    try {
      setIsLoading(true);
      const res = await api.getPYQs({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        year: selectedYear !== 'all' ? Number(selectedYear) : undefined,
        search: searchQuery || undefined,
      });
      if (res && res.data) {
        setPyqs(res.data);
      }
    } catch (err) {
      console.error('Error fetching PYQs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPYQs();
  }, [selectedCategory, selectedYear]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPYQs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4 border border-blue-400/30">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>मागील वर्षांच्या प्रश्नपत्रिका (PYQ Library)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            महाराष्ट्र पोलीस भरती व MPSC मूळ प्रश्नपत्रिका संग्रह
          </h1>
          <p className="text-blue-200 text-base sm:text-lg leading-relaxed font-devanagari">
            २०१८ ते २०२४ पर्यंतच्या सर्व जिल्ह्यांच्या अधिकृत प्रश्नपत्रिका व उत्तरतालिका (Answer Keys) विनामूल्य डाउनलोड करा व सराव करा.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                id="search-pyq-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="जिल्हा किंवा परीक्षेचे नाव शोधा (उदा. पुणे पोलीस, ठाणे, मुंबई, SRPF)..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-blue-200/60 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium"
              />
            </div>
            <button
              type="submit"
              id="search-pyq-btn"
              className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 font-bold text-sm text-white transition shadow-md"
            >
              शोधा
            </button>
          </form>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === c.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Year Filter */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            id="pyq-year-filter"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">सर्व वर्षे (All Years)</option>
            {years.filter(y => y !== 'all').map((y) => (
              <option key={y} value={y}>
                वर्ष {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PYQ Papers Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400">प्रश्नपत्रिका लोड होत आहेत...</div>
      ) : pyqs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">कोणतीही प्रश्नपत्रिका आढळली नाही</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">वेगळा फिल्टर निवडून किंवा शोध संज्ञा बदलून पहा.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedYear('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
          >
            सर्व फिल्टर्स रीसेट करा
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pyqs.map((paper) => (
            <div
              key={paper.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-extrabold text-[11px] border border-blue-100">
                    {paper.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                    वर्ष {paper.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                  {paper.titleMarathi || paper.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 font-devanagari">
                  {paper.description || 'अधिकृत घटकनिहाय प्रश्नपत्रिका व विश्लेषण'}
                </p>

                {/* Meta details */}
                <div className="flex items-center gap-4 mt-4 text-[11px] text-slate-500 font-medium">
                  {paper.totalQuestions && <span>{paper.totalQuestions} प्रश्न (Marks: 100)</span>}
                  {paper.durationMinutes && <span>{paper.durationMinutes} मिनिटे</span>}
                  {paper.downloadCount !== undefined && (
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-slate-400" />
                      {paper.downloadCount + 120} डाऊनलोड्स
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={paper.pdfUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF डाऊनलोड</span>
                </a>
                <button
                  onClick={() => {
                    if (onStartTestByExam) {
                      onStartTestByExam(paper.category);
                    }
                  }}
                  className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>टेस्ट सोडवा</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
