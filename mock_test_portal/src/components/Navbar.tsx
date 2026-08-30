import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  GraduationCap,
  BookOpen,
  Layers,
  Sparkles,
  Award,
  Bell,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Globe,
  Menu,
  X,
  FileText,
  Trophy,
  LayoutDashboard,
  Shield,
  Landmark,
  Train,
  Building2,
  FlaskConical,
  Calculator,
  Brain,
  Scroll,
  ChevronRight,
  ArrowRight,
  Search,
  CheckCircle2,
  Sparkle,
  Compass,
} from 'lucide-react';
import { Exam, Category, Subject } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string, extra?: any) => void;
  unreadNotifsCount: number;
  onOpenNotifs: () => void;
  exams?: Exam[];
  categories?: Category[];
  subjects?: Subject[];
}

interface ExamGroupItem {
  id: string;
  title: string;
  titleMr: string;
  badge?: string;
  badgeColor?: string;
  logoCode: string;
  logoBg: string;
  logoText: string;
  testCount: string;
  examId?: string;
  subjectId?: string;
  subcategory?: string;
}

interface CategoryMenuSection {
  id: string;
  name: string;
  nameMr: string;
  icon: any;
  items: ExamGroupItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  unreadNotifsCount,
  onOpenNotifs,
  exams = [],
  categories = [],
  subjects = [],
}) => {
  const { user, logout, openAuthModal } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Oliveboard-style Exams Dropdown State
  const [isExamsDropdownOpen, setIsExamsDropdownOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState('maha-exams');
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);

  // Search state in Navbar
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        setIsExamsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExamsMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsExamsDropdownOpen(true);
  };

  const handleExamsMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsExamsDropdownOpen(false);
    }, 250);
  };

  // Dynamically constructed Categories & Exam Cards from backend API props
  const examCategorySections: CategoryMenuSection[] = React.useMemo(() => {
    // 1. Maharashtra State Exams Section
    const mahaExamsList = exams.filter(
      (e) =>
        e.id === 'exam-mpsc' ||
        e.id === 'exam-police' ||
        e.id === 'exam-talathi' ||
        e.id === 'exam-maha-gov' ||
        e.category === 'state' ||
        e.name.toLowerCase().includes('mpsc') ||
        e.name.toLowerCase().includes('police') ||
        e.name.toLowerCase().includes('talathi') ||
        e.name.toLowerCase().includes('maharashtra')
    );

    const mahaItems: ExamGroupItem[] = (mahaExamsList.length > 0 ? mahaExamsList : []).map((e) => ({
      id: e.id,
      title: e.name,
      titleMr: e.nameMarathi || e.name,
      badge: (e as any).badge || (e.id.includes('police') ? 'HOT' : e.id.includes('mpsc') ? 'POPULAR' : undefined),
      badgeColor: (e as any).badgeColor || (e.id.includes('police') ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'),
      logoCode: e.logoCode || e.name.substring(0, 4).toUpperCase(),
      logoBg: e.logoBg || 'bg-indigo-700 text-white',
      logoText: e.logoCode || e.name.substring(0, 5).toUpperCase(),
      testCount: `${e.totalTests || 15} Tests`,
      examId: e.id,
    }));

    // If categories exist for maha exams, add any specific subcategories as cards
    const mahaCategories = categories.filter((c) =>
      c.examId === 'exam-mpsc' || c.examId === 'exam-police' || c.examId === 'exam-talathi'
    );
    mahaCategories.forEach((cat) => {
      if (!mahaItems.some((item) => item.id === cat.id)) {
        mahaItems.push({
          id: cat.id,
          title: cat.name,
          titleMr: cat.nameMarathi || cat.name,
          badge: cat.name.toLowerCase().includes('combine') ? 'POPULAR' : undefined,
          badgeColor: 'bg-amber-100 text-amber-800',
          logoCode: cat.name.substring(0, 4).toUpperCase(),
          logoBg: 'bg-blue-700 text-white',
          logoText: cat.name.substring(0, 4).toUpperCase(),
          testCount: `${cat.testCount || 12} Tests`,
          examId: cat.examId,
        });
      }
    });

    // 2. Banking & Insurance Section
    const bankingExams = exams.filter(
      (e) => e.category === 'banking' || e.id === 'exam-banking' || e.name.toLowerCase().includes('bank') || e.name.toLowerCase().includes('ibps') || e.name.toLowerCase().includes('sbi')
    );
    const bankingItems: ExamGroupItem[] = [
      {
        id: 'sbi-po',
        title: 'SBI PO Prelims & Mains',
        titleMr: 'स्टेट बँक ऑफ इंडिया प्रोबेशनरी ऑफिसर',
        badge: 'TRENDING',
        badgeColor: 'bg-blue-100 text-blue-800',
        logoCode: 'SBI',
        logoBg: 'bg-purple-900 text-white',
        logoText: 'SBI',
        testCount: '14 Tests',
        examId: bankingExams[0]?.id || 'exam-banking',
      },
      {
        id: 'sbi-clerk',
        title: 'SBI Clerk / Junior Associate',
        titleMr: 'स्टेट बँक ऑफ इंडिया लिपिक',
        logoCode: 'SBI',
        logoBg: 'bg-purple-900 text-white',
        logoText: 'SBI',
        testCount: '12 Tests',
        examId: bankingExams[0]?.id || 'exam-banking',
      },
      {
        id: 'ibps-po',
        title: 'IBPS PO CRP XIV',
        titleMr: 'आयबीपीएस राष्ट्रीयकृत बँका पीओ',
        logoCode: 'IBPS',
        logoBg: 'bg-sky-600 text-white',
        logoText: 'IBPS',
        testCount: '15 Tests',
        examId: bankingExams[0]?.id || 'exam-banking',
      },
      {
        id: 'ibps-rrb-po',
        title: 'IBPS RRB PO / Officer Scale I',
        titleMr: 'ग्रामीण बँक अधिकारी परीक्षा',
        logoCode: 'IBPS',
        logoBg: 'bg-sky-600 text-white',
        logoText: 'IBPS',
        testCount: '10 Tests',
        examId: bankingExams[0]?.id || 'exam-banking',
      },
      {
        id: 'ibps-clerk',
        title: 'IBPS Clerk 2026',
        titleMr: 'आयबीपीएस लिपिक संवर्ग',
        logoCode: 'IBPS',
        logoBg: 'bg-sky-600 text-white',
        logoText: 'IBPS',
        testCount: '11 Tests',
        examId: bankingExams[0]?.id || 'exam-banking',
      },
      {
        id: 'rbi-assistant',
        title: 'RBI Assistant & Grade B',
        titleMr: 'रिझर्व्ह बँक ऑफ इंडिया परीक्षा',
        logoCode: 'RBI',
        logoBg: 'bg-amber-800 text-white',
        logoText: 'RBI',
        testCount: '8 Tests',
        examId: bankingExams[0]?.id || 'exam-banking',
      },
      {
        id: 'lic-aao',
        title: 'LIC AAO / ADO Recruitment',
        titleMr: 'भारतीय आयुर्विमा महामंडळ अधिकारी',
        logoCode: 'LIC',
        logoBg: 'bg-amber-600 text-white',
        logoText: 'LIC',
        testCount: '6 Tests',
        examId: bankingExams[0]?.id || 'exam-banking',
      },
      {
        id: 'nicl-ao',
        title: 'NICL & NIACL Administrative Officer',
        titleMr: 'नॅशनल इन्शुरन्स कंपनी परीक्षा',
        logoCode: 'NICL',
        logoBg: 'bg-teal-800 text-white',
        logoText: 'NICL',
        testCount: '6 Tests',
        examId: bankingExams[0]?.id || 'exam-banking',
      },
    ];

    // 3. SSC Staff Selection Commission
    const sscExams = exams.filter(
      (e) => e.category === 'ssc' || e.id === 'exam-ssc' || e.name.toLowerCase().includes('ssc')
    );
    const sscItems: ExamGroupItem[] = [
      {
        id: 'ssc-cgl',
        title: 'SSC CGL Tier 1 & Tier 2',
        titleMr: 'संयुक्त पदवीधर स्तर परीक्षा',
        badge: 'POPULAR',
        badgeColor: 'bg-indigo-100 text-indigo-800',
        logoCode: 'SSC',
        logoBg: 'bg-red-700 text-white',
        logoText: 'SSC',
        testCount: '18 Tests',
        examId: sscExams[0]?.id || 'exam-ssc',
      },
      {
        id: 'ssc-chsl',
        title: 'SSC CHSL (10+2 Level)',
        titleMr: 'उच्च माध्यमिक स्तर परीक्षा',
        logoCode: 'SSC',
        logoBg: 'bg-red-700 text-white',
        logoText: 'SSC',
        testCount: '14 Tests',
        examId: sscExams[0]?.id || 'exam-ssc',
      },
      {
        id: 'ssc-gd',
        title: 'SSC GD Constable (CAPFs)',
        titleMr: 'निमलष्करी दल कॉन्स्टेबल भरती',
        badge: 'HOT',
        badgeColor: 'bg-rose-100 text-rose-700',
        logoCode: 'SSC',
        logoBg: 'bg-red-700 text-white',
        logoText: 'SSC',
        testCount: '15 Tests',
        examId: sscExams[0]?.id || 'exam-ssc',
      },
      {
        id: 'ssc-mts',
        title: 'SSC MTS & Havaldar',
        titleMr: 'मल्टी टास्किंग स्टाफ परीक्षा',
        logoCode: 'SSC',
        logoBg: 'bg-red-700 text-white',
        logoText: 'SSC',
        testCount: '12 Tests',
        examId: sscExams[0]?.id || 'exam-ssc',
      },
      {
        id: 'ssc-cpo',
        title: 'SSC CPO Sub-Inspector (Delhi Police)',
        titleMr: 'केंद्रीय पोलीस दल उपनिरीक्षक',
        logoCode: 'SSC',
        logoBg: 'bg-red-700 text-white',
        logoText: 'SSC',
        testCount: '9 Tests',
        examId: sscExams[0]?.id || 'exam-ssc',
      },
      {
        id: 'ssc-steno',
        title: 'SSC Stenographer Grp C & D',
        titleMr: 'स्टेनोग्राफर परीक्षा',
        logoCode: 'SSC',
        logoBg: 'bg-red-700 text-white',
        logoText: 'SSC',
        testCount: '7 Tests',
        examId: sscExams[0]?.id || 'exam-ssc',
      },
    ];

    // 4. Railways RRB
    const rrbExams = exams.filter(
      (e) => e.category === 'railway' || e.id === 'exam-railway' || e.name.toLowerCase().includes('rail') || e.name.toLowerCase().includes('rrb')
    );
    const rrbItems: ExamGroupItem[] = [
      {
        id: 'rrb-ntpc',
        title: 'RRB NTPC CBT 1 & 2',
        titleMr: 'रेल्वे नॉन-टेक्निकल पॉप्युलर कॅटेगरीज',
        logoCode: 'RRB',
        logoBg: 'bg-orange-700 text-white',
        logoText: 'RRB',
        testCount: '16 Tests',
        examId: rrbExams[0]?.id || 'exam-railway',
      },
      {
        id: 'rrb-group-d',
        title: 'RRB Group D (Level 1 Post)',
        titleMr: 'रेल्वे गट ड भरती परीक्षा',
        logoCode: 'RRB',
        logoBg: 'bg-orange-700 text-white',
        logoText: 'RRB',
        testCount: '14 Tests',
        examId: rrbExams[0]?.id || 'exam-railway',
      },
      {
        id: 'rrb-alp',
        title: 'RRB ALP & Technician',
        titleMr: 'सहाय्यक लोको पायलट परीक्षा',
        logoCode: 'RRB',
        logoBg: 'bg-orange-700 text-white',
        logoText: 'RRB',
        testCount: '10 Tests',
        examId: rrbExams[0]?.id || 'exam-railway',
      },
      {
        id: 'rrb-je',
        title: 'RRB JE Junior Engineer',
        titleMr: 'रेल्वे कनिष्ठ अभियंता परीक्षा',
        logoCode: 'RRB',
        logoBg: 'bg-orange-700 text-white',
        logoText: 'RRB',
        testCount: '8 Tests',
        examId: rrbExams[0]?.id || 'exam-railway',
      },
    ];

    // 5. Teaching & CTET/TET
    const teachingExams = exams.filter(
      (e) => e.category === 'teaching' || e.id === 'exam-teaching' || e.name.toLowerCase().includes('tet') || e.name.toLowerCase().includes('teach')
    );
    const teachingItems: ExamGroupItem[] = [
      {
        id: 'maha-tet',
        title: 'MahaTET Paper 1 & 2',
        titleMr: 'महाराष्ट्र शिक्षक पात्रता परीक्षा',
        badge: 'ACTIVE',
        badgeColor: 'bg-emerald-100 text-emerald-800',
        logoCode: 'TET',
        logoBg: 'bg-emerald-800 text-white',
        logoText: 'TET',
        testCount: '10 Tests',
        examId: teachingExams[0]?.id || 'exam-teaching',
      },
      {
        id: 'maha-tait',
        title: 'MahaTAIT Shikshak Abhiyogyata',
        titleMr: 'शिक्षक अभियोग्यता व बुद्धिमत्ता चाचणी',
        logoCode: 'TAIT',
        logoBg: 'bg-emerald-800 text-white',
        logoText: 'TAIT',
        testCount: '9 Tests',
        examId: teachingExams[0]?.id || 'exam-teaching',
      },
      {
        id: 'ctet-exam',
        title: 'CTET Central Teacher Eligibility',
        titleMr: 'केंद्रीय शिक्षक पात्रता परीक्षा',
        logoCode: 'CTET',
        logoBg: 'bg-blue-800 text-white',
        logoText: 'CTET',
        testCount: '8 Tests',
        examId: teachingExams[0]?.id || 'exam-teaching',
      },
    ];

    // 6. Subject-Wise Drills dynamically built from subjects list
    const subjectItems: ExamGroupItem[] = (subjects.length > 0 ? subjects : [
      { id: 'sub-science', name: 'General Science', nameMarathi: 'सामान्य विज्ञान', totalQuestions: 450 },
      { id: 'sub-maths', name: 'Mathematics & Quants', nameMarathi: 'अंकगणित व संख्याशास्त्र', totalQuestions: 520 },
      { id: 'sub-reasoning', name: 'Reasoning & CSAT', nameMarathi: 'बुद्धिमत्ता व तर्कक्षमता', totalQuestions: 480 },
      { id: 'sub-polity', name: 'Polity & Constitution', nameMarathi: 'राज्यघटना व पंचायतराज', totalQuestions: 410 },
      { id: 'sub-geography', name: 'Geography & Map Reading', nameMarathi: 'महाराष्ट्र व भारत भूगोल', totalQuestions: 380 },
      { id: 'sub-marathi', name: 'Marathi Grammar (व्याकरण)', nameMarathi: 'मराठी व्याकरण व शब्दसंग्रह', totalQuestions: 490 },
    ]).map((s) => ({
      id: s.id,
      title: s.name,
      titleMr: s.nameMarathi || s.name,
      logoCode: s.name.substring(0, 3).toUpperCase(),
      logoBg: 'bg-indigo-600 text-white',
      logoText: s.name.substring(0, 4).toUpperCase(),
      testCount: `${s.totalQuestions ? Math.round(s.totalQuestions / 25) : 15} Tests`,
      subjectId: s.id,
    }));

    return [
      {
        id: 'maha-exams',
        name: 'Maharashtra State Exams',
        nameMr: 'महाराष्ट्र राज्य परीक्षा',
        icon: GraduationCap,
        items: mahaItems.length > 0 ? mahaItems : [
          {
            id: 'mpsc-rajyaseva',
            title: 'MPSC State Services (राज्यसेवा)',
            titleMr: 'राज्यसेवा पूर्व व मुख्य परीक्षा',
            logoCode: 'MPSC',
            logoBg: 'bg-indigo-700 text-white',
            logoText: 'MPSC',
            testCount: '18 Tests',
            examId: 'exam-mpsc',
          },
          {
            id: 'mpsc-combine',
            title: 'MPSC Combine Grp B & C',
            titleMr: 'संयुक्त गट ब व क (PSI/STI/ASO)',
            badge: 'POPULAR',
            badgeColor: 'bg-amber-100 text-amber-800',
            logoCode: 'COMB',
            logoBg: 'bg-blue-700 text-white',
            logoText: 'MPSC',
            testCount: '16 Tests',
            examId: 'exam-mpsc',
          },
          {
            id: 'police-bharti',
            title: 'Maharashtra Police Bharti 2026',
            titleMr: 'पोलीस शिपाई, चालक व SRPF',
            badge: 'HOT',
            badgeColor: 'bg-rose-100 text-rose-700',
            logoCode: 'POL',
            logoBg: 'bg-rose-700 text-white',
            logoText: 'POLICE',
            testCount: '15 Tests',
            examId: 'exam-police',
          },
          {
            id: 'talathi-exam',
            title: 'Talathi TCS/IBPS Pattern',
            titleMr: 'तलाठी भरती (महसूल विभाग)',
            logoCode: 'TAL',
            logoBg: 'bg-emerald-700 text-white',
            logoText: 'TALATHI',
            testCount: '12 Tests',
            examId: 'exam-talathi',
          },
        ],
      },
      {
        id: 'banking-insurance',
        name: 'Bank & Insurance',
        nameMr: 'बँक आणि विमा परीक्षा',
        icon: Landmark,
        items: bankingItems,
      },
      {
        id: 'ssc-exams',
        name: 'SSC Exams',
        nameMr: 'कर्मचारी निवड आयोग (SSC)',
        icon: Building2,
        items: sscItems,
      },
      {
        id: 'railway-exams',
        name: 'Railways Exams',
        nameMr: 'रेल्वे भरती परीक्षा (RRB)',
        icon: Train,
        items: rrbItems,
      },
      {
        id: 'teaching-exams',
        name: 'Teaching Exams',
        nameMr: 'शिक्षक पात्रता व अभियोग्यता',
        icon: BookOpen,
        items: teachingItems,
      },
      {
        id: 'subject-drills',
        name: 'Subject-Wise & Special Tests',
        nameMr: 'विषयनिहाय विशेष सराव चाचण्या',
        icon: FlaskConical,
        items: subjectItems,
      },
    ];
  }, [exams, categories, subjects]);

  // Currently active category in dropdown
  const currentCategorySection =
    examCategorySections.find((c) => c.id === activeCategoryId) ||
    examCategorySections[0];

  // Global search autocomplete filter
  const allExamItems = examCategorySections.flatMap((cat) => cat.items);
  const searchResults = searchQuery.trim()
    ? allExamItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.titleMr.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectItem = (item: ExamGroupItem) => {
    setIsExamsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
    setSearchQuery('');
    if (item.examId) {
      onSelectTab('tests', { examId: item.examId });
    } else if (item.subjectId) {
      onSelectTab('tests', { subjectId: item.subjectId, subcategory: item.subcategory });
    } else {
      onSelectTab('tests');
    }
  };

  const navLinks = [
    { id: 'series', label: t('Test Series', 'टेस्ट सिरीज'), icon: Layers },
    { id: 'free-tests', label: t('Free Tests', 'मोफत टेस्ट'), icon: Sparkles, badge: 'FREE' },
    { id: 'pyqs', label: t('PYQ Papers', 'मागील प्रश्नपत्रिका'), icon: FileText },
    { id: 'notes', label: t('Study Notes', 'अभ्यास साहित्य'), icon: BookOpen },
    { id: 'leaderboard', label: t('Rankings', 'गुणवत्ता यादी'), icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top micro bar for Live Exam Alerts & Language Switch */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[11px] font-medium truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="font-bold text-white shrink-0">परीक्षा सेतू २०२६:</span>
            <span className="truncate text-slate-300 font-devanagari">
              {t(
                'MPSC Combine, Maharashtra Police Bharti & Talathi Live Mock Series Active',
                'एमपीएससी संयुक्त, पोलीस भरती व तलाठी लाइव्ह मॉक टेस्ट सिरीज सुरू'
              )}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('free-tests')}
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{t('Free Daily Tests', 'दैनिक मोफत चाचण्या')}</span>
            </button>

            <span className="hidden sm:inline text-slate-700">|</span>

            {/* Language Switch */}
            <button
              id="lang-toggle-btn-top"
              onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
              className="text-[11px] font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition px-1.5 py-0.5 rounded hover:bg-slate-800 cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3 h-3 text-indigo-400" />
              <span>{language === 'en' ? 'मराठी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Left Group: Brand Logo + Oliveboard-Style "Exams ▾" Dropdown Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* 1. Brand Logo */}
            <div
              id="nav-brand-logo"
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="hidden xs:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 leading-none">
                    Pariksha<span className="text-indigo-600">Setu</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[9px] font-extrabold uppercase">
                    TESTS
                  </span>
                </div>
                <span className="block text-[10px] font-medium text-slate-500 tracking-wide font-devanagari mt-0.5">
                  महाराष्ट्र व राष्ट्रीय परीक्षा
                </span>
              </div>
            </div>

            {/* 2. Oliveboard-Style "Exams ▾" Hover & Click Dropdown In Navbar */}
            <div
              ref={dropdownContainerRef}
              className="relative"
              onMouseEnter={handleExamsMouseEnter}
              onMouseLeave={handleExamsMouseLeave}
            >
              <button
                id="nav-exams-dropdown-btn"
                onClick={() => setIsExamsDropdownOpen(!isExamsDropdownOpen)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 border cursor-pointer select-none ${
                  isExamsDropdownOpen
                    ? 'bg-[#00a8e8] text-white border-[#00a8e8] shadow-md'
                    : 'bg-white text-slate-800 border-slate-300 hover:border-[#00a8e8] hover:text-[#00a8e8]'
                }`}
                aria-expanded={isExamsDropdownOpen}
              >
                <span>{t('Exams', 'परीक्षा')}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isExamsDropdownOpen ? 'rotate-180 text-white' : 'text-slate-500'
                  }`}
                />
              </button>

              {/* 3. Oliveboard-Style 2-Pane Dropdown Menu Panel */}
              {isExamsDropdownOpen && (
                <div
                  id="nav-oliveboard-exams-menu"
                  onMouseEnter={handleExamsMouseEnter}
                  onMouseLeave={handleExamsMouseLeave}
                  className="absolute top-full left-0 mt-2 w-[720px] max-w-[92vw] sm:w-[780px] md:w-[840px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
                >
                  {/* Top Bar Header */}
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00a8e8] animate-pulse"></span>
                      <span className="uppercase tracking-wider font-extrabold text-slate-800">
                        {t('Select Your Target Examination', 'तुमची लक्ष्य स्पर्धा परीक्षा निवडा')}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsExamsDropdownOpen(false);
                        onSelectTab('tests');
                      }}
                      className="text-xs font-bold text-[#00a8e8] hover:text-indigo-700 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>{t('View All Mock Tests', 'सर्व चाचण्या पहा')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 2-Pane Split Container (Exact Oliveboard Layout) */}
                  <div className="grid grid-cols-12 min-h-[380px] max-h-[460px]">
                    {/* Left Pane: Categories List with Arrows */}
                    <div className="col-span-4 border-r border-slate-200 bg-slate-50/70 p-2 space-y-1 overflow-y-auto">
                      {examCategorySections.map((category) => {
                        const isSelected = category.id === activeCategoryId;
                        return (
                          <button
                            key={category.id}
                            id={`exam-cat-${category.id}`}
                            onMouseEnter={() => setActiveCategoryId(category.id)}
                            onClick={() => setActiveCategoryId(category.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between group cursor-pointer ${
                              isSelected
                                ? 'bg-[#00a8e8] text-white shadow-sm font-extrabold'
                                : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
                            }`}
                          >
                            <span className="truncate">{category.name}</span>
                            <ChevronRight
                              className={`w-4 h-4 shrink-0 transition-transform ${
                                isSelected ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:text-slate-700'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Pane: 2-Column Grid of Exam Cards with Logos */}
                    <div className="col-span-8 p-3.5 overflow-y-auto bg-white">
                      <div className="mb-2.5 pb-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                          <span>{currentCategorySection.name}</span>
                          <span className="text-slate-400 font-normal font-devanagari">
                            ({currentCategorySection.nameMr})
                          </span>
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {currentCategorySection.items.length} Exams Active
                        </span>
                      </div>

                      {/* 2-Column Card Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {currentCategorySection.items.map((item) => (
                          <button
                            key={item.id}
                            id={`exam-card-${item.id}`}
                            onClick={() => handleSelectItem(item)}
                            className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#00a8e8] hover:shadow-md bg-white hover:bg-sky-50/40 transition group flex items-center justify-between gap-2 cursor-pointer"
                          >
                            {/* Left: Logo Badge + Title */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Logo Icon Badge */}
                              <div
                                className={`w-8 h-8 rounded-lg ${item.logoBg} flex items-center justify-center font-black text-[9px] tracking-tight shrink-0 shadow-2xs uppercase`}
                              >
                                {item.logoCode}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#00a8e8] transition truncate block">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span
                                      className={`px-1 py-0.2 rounded text-[8px] font-black uppercase ${
                                        item.badgeColor || 'bg-blue-100 text-blue-800'
                                      }`}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 font-devanagari truncate block">
                                  {item.titleMr}
                                </span>
                              </div>
                            </div>

                            {/* Right: Chevron Arrow */}
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#00a8e8] group-hover:translate-x-0.5 transition shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Strip: Quick Links (Free Tests, PYQ, Full Series) */}
                  <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {t('Quick Drills:', 'थेट सराव:')}
                      </span>
                      <button
                        onClick={() => {
                          setIsExamsDropdownOpen(false);
                          onSelectTab('free-tests');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{t('Free Tests', 'मोफत टेस्ट')}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsExamsDropdownOpen(false);
                          onSelectTab('pyqs');
                        }}
                        className="px-2 py-0.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3 text-indigo-600" />
                        <span>{t('PYQ Papers', 'मागील प्रश्नपत्रिका')}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        setIsExamsDropdownOpen(false);
                        onSelectTab('series');
                      }}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{t('Explore Test Series Packages', 'संपूर्ण टेस्ट सिरीज पॅकेजेस')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Search Bar (Exact Oliveboard layout) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <input
                id="navbar-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t(
                  'Search Exams, Subjects, PYQs, Test Series...',
                  'परीक्षा, विषय, मागील प्रश्नपत्रिका किंवा टेस्ट सिरीज शोधा...'
                )}
                className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#00a8e8] rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a8e8]/20 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Autocomplete Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 max-h-72 overflow-y-auto"
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Matching Examinations & Mock Tests
                </div>
                {searchResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelectItem(res)}
                    className="w-full text-left p-2 hover:bg-sky-50 rounded-lg flex items-center justify-between text-xs transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded ${res.logoBg} flex items-center justify-center font-bold text-[8px] text-white`}
                      >
                        {res.logoCode}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">{res.title}</span>
                        <span className="text-[10px] text-slate-500 font-devanagari block">
                          {res.titleMr}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#00a8e8] bg-sky-50 px-2 py-0.5 rounded">
                      {res.testCount}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Navigation Links (Test Series, Free Tests, PYQs, Leaderboard) */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                currentTab === link.id || (link.id === 'free-tests' && currentTab === 'tests');
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => onSelectTab(link.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 relative group cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive
                        ? 'text-indigo-600'
                        : 'text-slate-400 group-hover:text-indigo-600'
                    }`}
                  />
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] font-extrabold rounded-full animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Notification Bell + Auth / Profile Dropdown */}
          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              id="notifications-bell-btn"
              onClick={onOpenNotifs}
              className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown or Login / Register buttons */}
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition cursor-pointer"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-slate-400 capitalize">{user.role}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Popup Menu */}
                {isProfileMenuOpen && (
                  <div
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in duration-150"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            user.role === 'admin'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-indigo-100 text-indigo-800'
                          }`}
                        >
                          Role: {user.role}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onSelectTab('dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      {t('My Dashboard', 'माझे डॅशबोर्ड')}
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onSelectTab('dashboard', { subTab: 'profile' });
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      {t('My Profile', 'प्रोफाइल संपादन')}
                    </button>

                    {/* Discrete Admin Link if user has admin role */}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onSelectTab('admin');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-amber-900 bg-amber-50/80 hover:bg-amber-100 flex items-center gap-2 transition border-t border-b border-amber-100 cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>{t('Admin Management Portal (/admin)', 'अॅडमिन व्यवस्थापन दालन')}</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      {t('Sign Out', 'बाहेर पडा')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
                >
                  {t('Sign In', 'लॉगिन')}
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => openAuthModal('register')}
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
                >
                  {t('Register Free', 'नोंदणी')}
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search exams & test series...', 'परीक्षा किंवा टेस्ट शोधा...')}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#00a8e8]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onSelectTab('home');
            }}
            className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 transition ${
              currentTab === 'home'
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>{t('Home', 'मुख्यपृष्ठ')}</span>
          </button>

          {/* Mobile Exam Categories Accordion */}
          <div className="border border-slate-200 rounded-2xl bg-slate-50/50 p-2.5">
            <div className="text-[11px] font-black uppercase text-slate-500 mb-2 px-1">
              {t('Browse Exam Categories', 'सर्व परीक्षा कॅटेगरीज')}
            </div>
            <div className="space-y-1">
              {examCategorySections.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setIsMobileMenuOpen(false);
                    onSelectTab('tests');
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs font-bold text-slate-700 hover:bg-white rounded-lg flex items-center justify-between border border-transparent hover:border-slate-200 transition"
                >
                  <span className="truncate">{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              currentTab === link.id || (link.id === 'free-tests' && currentTab === 'tests');
            return (
              <button
                key={link.id}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onSelectTab(link.id);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-indigo-600" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.2 bg-emerald-500 text-white text-[9px] font-extrabold rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
