import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { LeaderboardItem } from '../types';
import {
  Trophy,
  Medal,
  Award,
  MapPin,
  Flame,
  Star,
  TrendingUp,
  User as UserIcon,
  Crown,
  Search,
  Sparkles,
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [userRank, setUserRank] = useState<any>(null);
  const [selectedScope, setSelectedScope] = useState<'global' | 'district'>('global');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Pune');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const districts = [
    'Pune',
    'Mumbai City',
    'Mumbai Suburban',
    'Thane',
    'Nashik',
    'Chhatrapati Sambhajinagar',
    'Nagpur',
    'Kolhapur',
    'Satara',
    'Solapur',
    'Sangli',
    'Ahilyanagar',
    'Nanded',
    'Amravati',
    'Jalgaon',
    'Latur',
    'Ratnagiri',
    'Sindhudurg',
  ];

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      let res;
      if (selectedScope === 'global') {
        res = await api.getGlobalLeaderboard(25, user?.id);
      } else {
        res = await api.getDistrictLeaderboard(selectedDistrict, 25, user?.id);
      }

      if (res && res.data) {
        setLeaderboard(res.data);
        if (res.user_rank) {
          setUserRank(res.user_rank);
        }
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedScope, selectedDistrict, user?.id]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-black flex items-center justify-center shadow-md text-sm border-2 border-white">
          <Crown className="w-4 h-4 fill-current" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-800 font-black flex items-center justify-center shadow-md text-sm border-2 border-white">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black flex items-center justify-center shadow-md text-sm border-2 border-white">
          3
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
        {rank}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span>महाराष्ट्र राज्य व जिल्हा गुणवत्ता यादी (Merit List)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            स्पर्धक गुणवत्ता क्रमवारी व लीडरबोर्ड
          </h1>
          <p className="text-amber-100 text-base sm:text-lg leading-relaxed font-devanagari">
            राज्यभरातील आणि तुमच्या जिल्ह्यातील मॉक टेस्ट गुण, अचूकता आणि रँक पहा.
          </p>

          {/* Scope Selector */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setSelectedScope('global')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                selectedScope === 'global'
                  ? 'bg-white text-amber-900 shadow-md'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>महाराष्ट्र राज्य रँक (Statewide)</span>
            </button>
            <button
              onClick={() => setSelectedScope('district')}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
                selectedScope === 'district'
                  ? 'bg-white text-amber-900 shadow-md'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>जिल्हानिहाय रँक (District-wise)</span>
            </button>
          </div>
        </div>
      </div>

      {/* District Dropdown Selector (if district mode selected) */}
      {selectedScope === 'district' && (
        <div className="mb-6 flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <MapPin className="w-5 h-5 text-amber-600" />
          <label className="text-xs font-bold text-slate-700">जिल्हा निवडा:</label>
          <select
            id="district-picker"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 bg-white focus:ring-2 focus:ring-amber-500"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d} (महाराष्ट्र)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* User Current Rank Banner */}
      {userRank && (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-black text-xl">
              #{userRank.rank || userRank.global_rank || 14}
            </div>
            <div>
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                तुमचा सध्याचा रँक (Your Standing)
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{userRank.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-800 text-indigo-200 font-medium">
                  {userRank.district || 'Pune'}
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-6 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">एकूण गुण (Points)</span>
              <span className="text-xl font-extrabold text-amber-400">{userRank.points || 3650}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">राज्य रँक</span>
              <span className="text-xl font-extrabold text-white">#{userRank.global_rank || 14}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">जिल्हा रँक</span>
              <span className="text-xl font-extrabold text-emerald-400">#{userRank.district_rank || 4}</span>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium (Visual highlights) */}
      {!isLoading && leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Rank 2 */}
          <div className="order-2 md:order-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center relative">
            <div className="absolute -top-3 px-3 py-1 rounded-full bg-slate-200 text-slate-800 font-black text-xs">
              रँक २
            </div>
            <img
              src={leaderboard[1]?.avatar_url || 'https://images.unsplash.com/photo-1534528741775?w=150'}
              alt={leaderboard[1]?.name}
              className="w-16 h-16 rounded-2xl object-cover mb-3 border-2 border-slate-300 shadow-sm"
            />
            <h4 className="font-bold text-sm text-slate-900">{leaderboard[1]?.name}</h4>
            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {leaderboard[1]?.district}
            </span>
            <div className="mt-3 font-extrabold text-indigo-700 text-base">{leaderboard[1]?.points} गुण</div>
          </div>

          {/* Rank 1 (Tall & Highlighted) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white rounded-3xl p-7 border-2 border-amber-400 shadow-md text-center flex flex-col items-center justify-center relative transform md:-translate-y-2">
            <div className="absolute -top-4 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-xs shadow-md flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>विजेता (Rank 1)</span>
            </div>
            <img
              src={leaderboard[0]?.avatar_url || 'https://images.unsplash.com/photo-1534528741775?w=150'}
              alt={leaderboard[0]?.name}
              className="w-20 h-20 rounded-2xl object-cover mb-3 border-4 border-amber-300 shadow-md"
            />
            <h4 className="font-extrabold text-base text-slate-900">{leaderboard[0]?.name}</h4>
            <span className="text-xs text-amber-800 font-semibold flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-amber-600" /> {leaderboard[0]?.district}
            </span>
            <div className="mt-3 font-black text-amber-600 text-xl">{leaderboard[0]?.points} गुण</div>
            <span className="text-[11px] text-slate-500 font-medium mt-1">
              अचूकता: {leaderboard[0]?.accuracy}% ({leaderboard[0]?.quizzes} टेस्ट्स)
            </span>
          </div>

          {/* Rank 3 */}
          <div className="order-3 md:order-3 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center relative">
            <div className="absolute -top-3 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
              रँक ३
            </div>
            <img
              src={leaderboard[2]?.avatar_url || 'https://images.unsplash.com/photo-1534528741775?w=150'}
              alt={leaderboard[2]?.name}
              className="w-16 h-16 rounded-2xl object-cover mb-3 border-2 border-amber-300 shadow-sm"
            />
            <h4 className="font-bold text-sm text-slate-900">{leaderboard[2]?.name}</h4>
            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {leaderboard[2]?.district}
            </span>
            <div className="mt-3 font-extrabold text-indigo-700 text-base">{leaderboard[2]?.points} गुण</div>
          </div>
        </div>
      )}

      {/* Leaderboard Full Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>
            {selectedScope === 'global' ? 'महाराष्ट्र राज्य संपूर्ण गुणवत्ता यादी' : `${selectedDistrict} जिल्हा गुणवत्ता यादी`}
          </span>
        </h3>

        {isLoading ? (
          <div className="py-12 text-center text-slate-400">रँकिंग लोड होत आहे...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4 font-bold">क्रमांक (Rank)</th>
                  <th className="py-3 px-4 font-bold">उमेदवाराचे नाव (Aspirant)</th>
                  <th className="py-3 px-4 font-bold">जिल्हा (District)</th>
                  <th className="py-3 px-4 font-bold text-center">सोडवलेल्या टेस्ट्स</th>
                  <th className="py-3 px-4 font-bold text-center">अचूकता (Accuracy)</th>
                  <th className="py-3 px-4 font-bold text-right">एकूण गुण (Score)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaderboard.map((item) => (
                  <tr key={item.user_id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">{getRankBadge(item.rank)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar_url || 'https://images.unsplash.com/photo-1534528741775?w=150'}
                          alt={item.name}
                          className="w-8 h-8 rounded-xl object-cover"
                        />
                        <span className="font-bold text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.district}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">{item.quizzes || 30}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{item.accuracy || 85}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-extrabold text-indigo-700 text-sm">{item.points}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
