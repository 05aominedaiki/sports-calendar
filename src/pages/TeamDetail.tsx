import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Users,
  Trophy,
  Calendar,
  TrendingUp,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { getTeamInfo } from '../teamData';

function ResultBadge({ result }: { result: 'W' | 'D' | 'L' }) {
  const map = {
    W: 'bg-green-100 text-green-700 border border-green-300',
    D: 'bg-gray-100 text-gray-600 border border-gray-300',
    L: 'bg-red-100 text-red-600 border border-red-300',
  };
  const label = { W: 'Thắng', D: 'Hòa', L: 'Thua' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${map[result]}`}>
      {label[result]}
    </span>
  );
}

export default function TeamDetail() {
  const { teamName } = useParams<{ teamName: string }>();
  const navigate = useNavigate();

  const decoded = decodeURIComponent(teamName || '');
  const team = getTeamInfo(decoded);

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="p-4 rounded-2xl bg-gray-100">
          <Users className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">Không tìm thấy thông tin đội "{decoded}"</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>
    );
  }

  const wins  = team.recentResults.filter((r) => r.result === 'W').length;
  const draws = team.recentResults.filter((r) => r.result === 'D').length;
  const losses= team.recentResults.filter((r) => r.result === 'L').length;

  // nhóm cầu thủ theo vị trí
  const grouped = team.players.reduce<Record<string, typeof team.players>>((acc, p) => {
    if (!acc[p.position]) acc[p.position] = [];
    acc[p.position].push(p);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${team.color} shrink-0`}>
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700 truncate">{team.name}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* ── Hero banner ── */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className={`h-24 bg-gradient-to-br ${team.color} flex items-center justify-center`}>
            <span className="text-4xl font-black text-white/90 tracking-widest">{team.shortName}</span>
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-black text-gray-900 mb-1">{team.name}</h1>
            <p className="text-sm text-gray-400 mb-5">{team.country}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Sân nhà
                </div>
                <p className="text-sm font-semibold text-gray-800 leading-snug">{team.stadium}</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> HLV
                </div>
                <p className="text-sm font-semibold text-gray-800">{team.coach}</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Thành lập
                </div>
                <p className="text-sm font-semibold text-gray-800">{team.founded}</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <Users className="w-3.5 h-3.5 text-emerald-500" /> Thành viên
                </div>
                <p className="text-sm font-semibold text-gray-800">{team.players.length} người</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Thống kê nhanh ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Thắng', value: wins,  color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
            { label: 'Hòa',   value: draws, color: 'text-gray-600',  bg: 'bg-gray-50 border-gray-200' },
            { label: 'Thua',  value: losses,color: 'text-red-500',   bg: 'bg-red-50 border-red-200' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 text-center ${s.bg}`}>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-[10px] text-gray-400">5 trận gần nhất</p>
            </div>
          ))}
        </div>

        {/* ── Thành viên / Đội hình ── */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-md">
              <Users className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Đội hình</h2>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
              {team.players.length} người
            </span>
          </div>

          <div className="space-y-5">
            {Object.entries(grouped).map(([position, players]) => (
              <div key={position}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{position}</p>
                <div className="grid gap-2">
                  {players.map((player) => (
                    <div
                      key={player.number}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors"
                    >
                      <span
                        className={`w-8 h-8 rounded-full bg-gradient-to-br ${team.color} text-white text-sm font-black flex items-center justify-center shrink-0`}
                      >
                        {player.number}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{player.name}</p>
                        <p className="text-xs text-gray-400">{player.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Thành tích gần đây ── */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Thành tích gần đây</h2>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">5 trận</span>
          </div>

          {/* Win rate bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Tỉ lệ thắng</span>
              <span className="font-semibold text-gray-700">{Math.round((wins / 5) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${(wins / 5) * 100}%` }}
              />
            </div>
          </div>

          <ul className="space-y-2">
            {team.recentResults.map((r, i) => (
              <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <ResultBadge result={r.result} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">vs {r.opponent}</p>
                  <p className="text-xs text-gray-400">{r.tournament} · {r.date}</p>
                </div>
                <span className="text-sm font-bold text-gray-700 shrink-0">{r.score}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Nút quay lại ── */}
        <div className="flex items-center justify-center gap-3 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl shadow-md shadow-green-500/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Trang chủ
          </button>
        </div>
      </main>
    </div>
  );
}