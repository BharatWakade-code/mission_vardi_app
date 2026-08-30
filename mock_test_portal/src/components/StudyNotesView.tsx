import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { StudyNoteItem, CurrentAffairsItem } from '../types';
import {
  BookOpen,
  Download,
  Clock,
  Sparkles,
  Search,
  CheckCircle,
  FileText,
  Bookmark,
  Share2,
  Calendar,
  Layers,
} from 'lucide-react';

export const StudyNotesView: React.FC = () => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState<StudyNoteItem[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<CurrentAffairsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'notes' | 'current_affairs'>('notes');

  const subjects = [
    { id: 'all', label: 'सर्व विषय (All Subjects)' },
    { id: 'marathi', label: 'मराठी व्याकरण (Marathi Grammar)' },
    { id: 'maths_reasoning', label: 'अंकगणित व बुद्धिमत्ता' },
    { id: 'polity', label: 'भारतीय राज्यघटना व पंचायतराज' },
    { id: 'geography', label: 'महाराष्ट्र व भारताचा भूगोल' },
    { id: 'history', label: 'आधुनिक भारताचा व महाराष्ट्राचा इतिहास' },
    { id: 'science', label: 'सामान्य विज्ञान (General Science)' },
    { id: 'current_affairs', label: 'चालू घडामोडी (Current Affairs)' },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [notesRes, affairsRes] = await Promise.all([
        api.getNotes({
          subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        }),
        api.getCurrentAffairs(),
      ]);

      if (notesRes && notesRes.data) {
        setNotes(notesRes.data);
      }
      if (affairsRes && affairsRes.data) {
        setCurrentAffairs(affairsRes.data);
      }
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSubject]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-400/30">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>ई-अभ्यास साहित्य व चालू घडामोडी कॅप्सूल</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            MPSC व पोलीस भरती घटकनिहाय नोट्स आणि कॅप्सूल
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg leading-relaxed font-devanagari">
            परीक्षेभिमुख महत्त्वाचे मुद्दे, संक्षिप्त नोट्स आणि दैनिक चालू घडामोडींचे जलद रिव्हिजन करा.
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                activeTab === 'notes'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>घटकनिहाय नोट्स ({notes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('current_affairs')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                activeTab === 'current_affairs'
                  ? 'bg-white text-emerald-900 shadow-md'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>दैनिक चालू घडामोडी ({currentAffairs.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'notes' ? (
        <>
          {/* Subject Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedSubject === sub.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Notes Grid */}
          {isLoading ? (
            <div className="py-16 text-center text-slate-400">अभ्यास साहित्य लोड होत आहे...</div>
          ) : notes.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">या घटकासाठी अद्याप नोट्स उपलब्ध नाहीत</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">लवकरच नवीन पीडीएफ नोट्स जोडल्या जातील.</p>
              <button
                onClick={() => setSelectedSubject('all')}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                सर्व विषय पहा
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-[11px] border border-emerald-100">
                        {note.subject}
                      </span>
                      {(note as any).readTimeMinutes && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {(note as any).readTimeMinutes} min read
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-2">
                      {note.titleMarathi || note.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed font-devanagari">
                      {(note as any).summary || note.description || 'परीक्षेसाठी अतिमहत्त्वाचे रिव्हिजन मुद्दे व सूत्रे.'}
                    </p>
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Download className="w-3 h-3 text-slate-400" />
                      {note.downloadCount || 340} डाऊनलोड्स
                    </span>
                    <a
                      href={note.pdfUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF वाचा</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Current Affairs Tab */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentAffairs.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-extrabold text-[11px] border border-teal-100 uppercase">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.titleMarathi || item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-devanagari mb-4">
                  {item.summaryMarathi || item.summary}
                </p>

                {item.keyPoints && item.keyPoints.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <h4 className="text-[11px] font-bold text-slate-700 mb-1.5">अतिमहत्त्वाचे मुद्दे:</h4>
                    <ul className="space-y-1 text-xs text-slate-600 font-devanagari">
                      {item.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
