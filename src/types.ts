export type Sport =
  | 'all'
  | 'football'
  | 'basketball'
  | 'tennis'
  | 'csgo'
  | 'valorant'
  | 'lol'
  | 'volleyball'
  | 'f1'
  | 'badminton';

export type MatchStatus = 'live' | 'upcoming' | 'finished';

export interface Match {
  id: string;
  sport: Sport;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  status: MatchStatus;
  startTime: Date;
  endTime?: Date;
  tournament: string;
  isEsports: boolean;
  currentMinute?: number;
  totalMinutes?: number;
  hasVip?: boolean;
}