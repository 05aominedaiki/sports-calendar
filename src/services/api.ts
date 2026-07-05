import { Match, MatchStatus, Sport } from '../types';

// ─── Kiểu dữ liệu thô từ TheSportsDB ─────────────────────────────────────────

interface RawEvent {
  idEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string;        // 'NS' | 'FT' | 'HT' | '1H' | '2H' | 'ET' | ...
  strTime: string | null;   // "01:00:00" hoặc "20:00"
  dateEvent: string;        // "2026-07-05"
  strLeague: string;
  intRound?: string | null;
  strProgress?: string | null; // phút hiện tại, ví dụ "67'"
}

interface ApiResponse {
  events: RawEvent[] | null;
}

// ─── Helper: chuyển strStatus → MatchStatus ───────────────────────────────────

function mapStatus(strStatus: string): MatchStatus {
  const s = strStatus.toUpperCase();
  if (s === 'NS') return 'upcoming';
  if (s === 'FT' || s === 'AET' || s === 'PEN') return 'finished';
  return 'live'; // HT, 1H, 2H, ET, LIVE, ...
}

// ─── Helper: parse phút hiện tại từ strProgress "67'" hoặc số ────────────────

function parseMinute(progress?: string | null): number | undefined {
  if (!progress) return undefined;
  const n = parseInt(progress.replace(/\D/g, ''), 10);
  return isNaN(n) ? undefined : n;
}

// ─── Helper: build Date từ dateEvent + strTime ────────────────────────────────
// API trả về strTime dạng "HH:MM:SS" hoặc "HH:MM"
// Dùng Date constructor với từng thành phần để tránh lỗi timezone

function buildStartTime(dateEvent: string, strTime: string | null): Date {
  // Parse date: "2026-07-05"
  const [year, month, day] = dateEvent.split('-').map(Number);

  if (!strTime) {
    return new Date(year, month - 1, day, 0, 0, 0);
  }

  // Chuẩn hoá strTime: cắt chỉ lấy "HH:MM:SS" hoặc "HH:MM"
  const timeParts = strTime.trim().split(':').map(Number);
  const hours   = timeParts[0] ?? 0;
  const minutes = timeParts[1] ?? 0;
  const seconds = timeParts[2] ?? 0;

  // Trả về theo giờ local (không UTC) để hiển thị đúng cho người dùng
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

// ─── Hàm chính: fetch + map ──────────────────────────────────────────────────

export async function fetchFootballMatches(dateStr?: string): Promise<Match[]> {
  // Lấy ngày hôm nay theo múi giờ local (không dùng toISOString vì ra UTC)
  const today = dateStr ?? (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  })();

  const url = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${today}&s=Soccer`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);

  const json: ApiResponse = await res.json();
  if (!json.events || json.events.length === 0) {
    throw new Error('No events returned');
  }

  return json.events.map((e): Match => {
    const status       = mapStatus(e.strStatus);
    const startTime    = buildStartTime(e.dateEvent, e.strTime);
    const currentMinute = parseMinute(e.strProgress);

    return {
      id: e.idEvent,
      sport: 'football' as Sport,
      team1: e.strHomeTeam,
      team2: e.strAwayTeam,
      score1:
        e.intHomeScore !== null && e.intHomeScore !== ''
          ? parseInt(e.intHomeScore, 10)
          : undefined,
      score2:
        e.intAwayScore !== null && e.intAwayScore !== ''
          ? parseInt(e.intAwayScore, 10)
          : undefined,
      status,
      startTime,
      endTime: status === 'finished' ? new Date() : undefined,
      tournament: e.strLeague,
      isEsports: false,
      currentMinute,
      totalMinutes: 90,
    };
  });
}