import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Circle,
  Clock,
  Calendar,
  Users,
  MapPin,
  Trophy,
  Search,
  LayoutList,
  Loader2,
  WifiOff,
} from 'lucide-react';

import { Match, Sport } from './types';
import { mockMatches } from './mockData';
import { fetchFootballMatches } from './services/api';
import { SearchBar } from './Components/SearchBar';
import { SportFilter } from './Components/SportFilter';
import { MatchCard } from './Components/MatchCard';
import { SectionHeader } from './Components/SectionHeader';

// ─── Loading spinner ──────────────────────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-green-100" />
        <Loader2 className="w-14 h-14 text-green-500 animate-spin absolute inset-0" />
      </div>
      <p className="text-gray-500 text-sm font-medium">Đang tải dữ liệu trận đấu...</p>
    </div>
  );
}

// ─── Banner thông báo dữ liệu ─────────────────────────────────────────────────

function DataSourceBanner({ isLive, onRefresh }: { isLive: boolean; onRefresh: () => void }) {
  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-medium ${
      isLive
        ? 'bg-green-50 border border-green-200 text-green-700'
        : 'bg-amber-50 border border-amber-200 text-amber-700'
    }`}>
      <div className="flex items-center gap-2">
        {isLive ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            Dữ liệu bóng đá thật từ TheSportsDB
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            Đang dùng dữ liệu mẫu (không kết nối được API)
          </>
        )}
      </div>
      <button
        onClick={onRefresh}
        className="underline underline-offset-2 hover:opacity-70 transition-opacity shrink-0"
      >
        Tải lại
      </button>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const navigate = useNavigate();

  const [selectedSport, setSelectedSport] = useState<Sport>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByTime, setSortByTime] = useState(false);
  const [now, setNow] = useState(Date.now());

  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);

  // Đồng hồ cập nhật mỗi giây
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch dữ liệu
  async function loadMatches() {
    setLoading(true);
    try {
      const liveData = await fetchFootballMatches();
      // Ghép dữ liệu API (bóng đá thật) với mock (các môn khác)
      const nonFootballMock = mockMatches.filter((m) => m.sport !== 'football');
      setAllMatches([...liveData, ...nonFootballMock]);
      setIsLiveData(true);
    } catch {
      // Fallback về mock nếu API lỗi hoặc không có dữ liệu
      setAllMatches(mockMatches);
      setIsLiveData(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMatches();
  }, []);

  // Filter + sort
  const filteredMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const results = allMatches.filter((match) => {
      const sportMatch = selectedSport === 'all' || match.sport === selectedSport;
      const searchMatch =
        !query ||
        match.team1.toLowerCase().includes(query) ||
        match.team2.toLowerCase().includes(query);
      return sportMatch && searchMatch;
    });
    if (sortByTime) {
      return [...results].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    }
    return results;
  }, [allMatches, selectedSport, searchQuery, sortByTime]);

  const liveMatches     = filteredMatches.filter((m) => m.status === 'live');
  const upcomingMatches = filteredMatches.filter((m) => m.status === 'upcoming');
  const finishedMatches = filteredMatches.filter((m) => m.status === 'finished');
  const totalCount      = filteredMatches.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md shadow-green-500/25">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-600 tracking-tight">Lịch thi đấu</h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Lịch thi đấu Sports & Esports
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortByTime((v) => !v)}
                title="Sắp xếp theo giờ"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  sortByTime
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Theo giờ</span>
              </button>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}
              </div>
            </div>
          </div>
          <SportFilter selected={selectedSport} onSelect={setSelectedSport} />
          <div className="mt-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Nội dung sau khi load xong */}
        {!loading && (
          <>
            {/* Banner nguồn dữ liệu */}
            <DataSourceBanner isLive={isLiveData} onRefresh={loadMatches} />

            {/* Tổng số trận */}
            {totalCount > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <LayoutList className="w-4 h-4 text-emerald-500" />
                <span>
                  Hiển thị <span className="font-semibold text-gray-700">{totalCount}</span> trận đấu
                  {searchQuery && <> cho "<span className="font-semibold text-green-600">{searchQuery}</span>"</>}
                  {selectedSport !== 'all' && <> • đã lọc theo môn thể thao</>}
                  {sortByTime && <> • sắp xếp theo giờ</>}
                </span>
              </div>
            )}

            {/* Live */}
            {liveMatches.length > 0 && (
              <section>
                <SectionHeader title="Đang diễn ra" icon={Circle} count={liveMatches.length} accentColor="from-green-500 to-emerald-500" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {liveMatches.map((match) => (
                    <div key={match.id} onClick={() => navigate(`/match/${match.id}`)} className="cursor-pointer">
                      <MatchCard match={match} now={now} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming */}
            {upcomingMatches.length > 0 && (
              <section>
                <SectionHeader title="Sắp diễn ra" icon={Clock} count={upcomingMatches.length} accentColor="from-cyan-500 to-blue-500" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingMatches.map((match) => (
                    <div key={match.id} onClick={() => navigate(`/match/${match.id}`)} className="cursor-pointer">
                      <MatchCard match={match} now={now} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Finished */}
            {finishedMatches.length > 0 && (
              <section>
                <SectionHeader title="Kết quả hôm nay" icon={Trophy} count={finishedMatches.length} accentColor="from-emerald-500 to-teal-500" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {finishedMatches.map((match) => (
                    <div key={match.id} onClick={() => navigate(`/match/${match.id}`)} className="cursor-pointer">
                      <MatchCard match={match} now={now} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {filteredMatches.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-2xl bg-gray-100 mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium">
                  {searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}"` : 'Không có trận đấu nào'}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchQuery ? 'Thử tìm kiếm tên đội khác hoặc xóa bộ lọc' : 'Hãy chọn môn thể thao khác hoặc quay lại sau'}
                </p>
                {(searchQuery || selectedSport !== 'all') && (
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedSport('all'); }}
                    className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-gray-200 mt-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>Cập nhật theo thời gian thực</span>
            </div>
            <p className="text-xs text-gray-400">Sports Calendar © {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}