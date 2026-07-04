import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Circle,
  Clock,
  Trophy,
  Calendar,
  Users,
  Swords,
  TrendingUp,
} from 'lucide-react';
import { mockMatches } from '../mockData';
import { sportConfig } from '../sportConfig';

// ─── Dữ liệu giả đội hình ────────────────────────────────────────────────────

const mockLineups: Record<string, { team1: string[]; team2: string[] }> = {
  default_football: {
    team1: ['De Gea', 'Wan-Bissaka', 'Varane', 'Maguire', 'Shaw', 'McTominay', 'Fred', 'Fernandes', 'Rashford', 'Martial', 'Ronaldo'],
    team2: ['Alisson', 'Alexander-Arnold', 'Matip', 'Van Dijk', 'Robertson', 'Henderson', 'Fabinho', 'Thiago', 'Salah', 'Firmino', 'Mané'],
  },
  default_basketball: {
    team1: ['LeBron James', 'Anthony Davis', 'Russell Westbrook', 'Talen Horton-Tucker', 'Kendrick Nunn'],
    team2: ['Jayson Tatum', 'Jaylen Brown', 'Al Horford', 'Marcus Smart', 'Robert Williams'],
  },
  default_esports: {
    team1: ['TenZ', 'ShahZaM', 'SicK', 'dapr', 'zombs'],
    team2: ['aspas', 'Less', 'saadhak', 'cauanzin', 'tuyz'],
  },
  default_tennis: {
    team1: ['Novak Djokovic'],
    team2: ['Carlos Alcaraz'],
  },
};

function getLineup(_matchId: string, isEsports: boolean, sport: string) {
  if (isEsports) return mockLineups.default_esports;
  if (sport === 'basketball') return mockLineups.default_basketball;
  if (sport === 'tennis') return mockLineups.default_tennis;
  return mockLineups.default_football;
}

// ─── Dữ liệu giả lịch sử đối đầu ────────────────────────────────────────────

interface H2HRecord {
  date: string;
  team1Score: number;
  team2Score: number;
  tournament: string;
}

const mockH2H: H2HRecord[] = [
  { date: '15/01/2024', team1Score: 2, team2Score: 2, tournament: 'Vòng 20' },
  { date: '08/10/2023', team1Score: 0, team2Score: 3, tournament: 'Vòng 7' },
  { date: '05/03/2023', team1Score: 2, team2Score: 1, tournament: 'Vòng 26' },
  { date: '19/09/2022', team1Score: 1, team2Score: 1, tournament: 'Vòng 7' },
  { date: '13/03/2022', team1Score: 4, team2Score: 0, tournament: 'Vòng 28' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(date: Date) {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date) {
  return date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full shadow-lg shadow-green-500/30">
      <Circle className="w-2.5 h-2.5 fill-white animate-pulse" />
      <span className="text-sm font-bold tracking-wider text-white">LIVE</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'live') return <LiveBadge />;
  if (status === 'upcoming') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-100 text-cyan-700 text-sm font-semibold rounded-full">
      <Clock className="w-3.5 h-3.5" /> Sắp diễn ra
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-sm font-semibold rounded-full">
      Kết thúc
    </span>
  );
}

// ─── Component chính ──────────────────────────────────────────────────────────

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const match = mockMatches.find((m) => m.id === id);

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg font-medium">Không tìm thấy trận đấu.</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>
    );
  }

  const config = sportConfig[match.sport];
  const Icon = config.icon;
  const lineup = getLineup(match.id, match.isEsports, match.sport);
  const isTennis = match.sport === 'tennis';
  const lineupLabel = match.isEsports ? 'Đội hình thi đấu' : isTennis ? 'Vận động viên' : 'Đội hình ra sân';

  function goToTeam(teamName: string) {
    navigate(`/team/${encodeURIComponent(teamName)}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${config.color} shrink-0`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 truncate">{match.tournament}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* ── Hero Card ── */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${config.color}`} />
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Trophy className="w-4 h-4 text-emerald-500" />
                <span>{match.tournament}</span>
              </div>
              <StatusBadge status={match.status} />
            </div>

            {/* Tỉ số */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-center">
                <button
                  onClick={() => goToTeam(match.team1)}
                  className="text-lg font-bold text-gray-900 leading-tight hover:text-green-600 transition-colors cursor-pointer"
                >
                  {match.team1}
                </button>
                {match.hasVip && (
                  <span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-full">VIP</span>
                )}
              </div>

              <div className="flex flex-col items-center gap-1 shrink-0">
                {match.status !== 'upcoming' ? (
                  <div className="flex items-center gap-4 px-6 py-3 bg-gray-100 rounded-2xl">
                    <span className="text-4xl font-black text-gray-900">{match.score1}</span>
                    <span className="text-2xl text-gray-400 font-light">–</span>
                    <span className="text-4xl font-black text-gray-900">{match.score2}</span>
                  </div>
                ) : (
                  <div className="px-6 py-3 bg-gray-100 rounded-2xl">
                    <span className="text-2xl font-black text-gray-400">VS</span>
                  </div>
                )}
                {match.status === 'live' && (
                  <span className="text-xs text-gray-500">{match.currentMinute}' / {match.totalMinutes}'</span>
                )}
              </div>

              <div className="flex-1 text-center">
                <button
                  onClick={() => goToTeam(match.team2)}
                  className="text-lg font-bold text-gray-900 leading-tight hover:text-green-600 transition-colors cursor-pointer"
                >
                  {match.team2}
                </button>
              </div>
            </div>

            {/* Progress bar (live) */}
            {match.status === 'live' && (
              <div className="mt-5 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${config.color} transition-all duration-1000`}
                  style={{ width: `${((match.currentMinute || 0) / (match.totalMinutes || 90)) * 100}%` }}
                />
              </div>
            )}

            {/* Thông tin thêm */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                {formatDate(match.startTime)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" />
                {formatTime(match.startTime)}
              </span>
              {match.isEsports && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <Swords className="w-4 h-4" />
                  Esports
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Đội hình ── */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-md">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900">{lineupLabel}</h2>
          </div>

          {isTennis ? (
            <div className="grid grid-cols-2 gap-4">
              {[{ name: lineup.team1[0], team: match.team1 }, { name: lineup.team2[0], team: match.team2 }].map((p, i) => (
                <button
                  key={i}
                  onClick={() => goToTeam(p.team)}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {p.name.charAt(0)}
                  </div>
                  <p className="font-semibold text-gray-900 text-center text-sm hover:text-green-600 transition-colors">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.team}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* Team 1 */}
              <div>
                <button
                  onClick={() => goToTeam(match.team1)}
                  className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 hover:text-green-600 transition-colors cursor-pointer block"
                >
                  {match.team1}
                </button>
                <ul className="space-y-2">
                  {lineup.team1.map((player, i) => (
                    <li key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 font-medium">{player}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Team 2 */}
              <div>
                <button
                  onClick={() => goToTeam(match.team2)}
                  className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 hover:text-green-600 transition-colors cursor-pointer block"
                >
                  {match.team2}
                </button>
                <ul className="space-y-2">
                  {lineup.team2.map((player, i) => (
                    <li key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 font-medium">{player}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ── Lịch sử đối đầu ── */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Lịch sử đối đầu</h2>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">5 trận gần nhất</span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-2 px-2">
            <button
              onClick={() => goToTeam(match.team1)}
              className="text-xs font-bold text-gray-400 truncate text-left hover:text-green-600 transition-colors"
            >
              {match.team1}
            </button>
            <div className="w-24" />
            <button
              onClick={() => goToTeam(match.team2)}
              className="text-xs font-bold text-gray-400 truncate text-right hover:text-green-600 transition-colors"
            >
              {match.team2}
            </button>
          </div>

          <ul className="space-y-2">
            {mockH2H.map((h, i) => {
              const t1Win = h.team1Score > h.team2Score;
              const t2Win = h.team2Score > h.team1Score;
              const draw = h.team1Score === h.team2Score;
              return (
                <li key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${t1Win ? 'bg-green-500' : draw ? 'bg-gray-400' : 'bg-gray-200'}`} />
                    <span className={`text-sm font-bold ${t1Win ? 'text-gray-900' : 'text-gray-400'}`}>{h.team1Score}</span>
                  </div>
                  <div className="flex flex-col items-center w-24 shrink-0">
                    <span className="text-[10px] text-gray-400">{h.date}</span>
                    <span className="text-[10px] text-gray-400">{h.tournament}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className={`text-sm font-bold ${t2Win ? 'text-gray-900' : 'text-gray-400'}`}>{h.team2Score}</span>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${t2Win ? 'bg-cyan-500' : draw ? 'bg-gray-400' : 'bg-gray-200'}`} />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
            {(() => {
              const t1Wins = mockH2H.filter(h => h.team1Score > h.team2Score).length;
              const t2Wins = mockH2H.filter(h => h.team2Score > h.team1Score).length;
              const draws  = mockH2H.filter(h => h.team1Score === h.team2Score).length;
              return (
                <>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                    <span className="font-semibold text-gray-700">{t1Wins}</span> thắng
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" />
                    <span className="font-semibold text-gray-700">{draws}</span> hòa
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
                    <span className="font-semibold text-gray-700">{t2Wins}</span> thắng
                  </span>
                </>
              );
            })()}
          </div>
        </div>

        {/* Nút quay lại */}
        <div className="flex justify-center pb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl shadow-md shadow-green-500/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang chủ
          </button>
        </div>
      </main>
    </div>
  );
}