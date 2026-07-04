import { useNavigate } from 'react-router-dom';
import { Circle, Clock, Zap } from 'lucide-react';
import { Match } from '../types';
import { sportConfig } from '../sportConfig';
import { GamepadIcon } from './Icons';

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return 'Sắp bắt đầu';
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}g ${mins}p`;
  if (mins > 0) return `${mins}p ${secs}s`;
  return `${secs}s`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function LiveBadge() {
  return (
    <div className="relative flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full shadow-lg shadow-green-500/30">
      <Circle className="w-2 h-2 fill-white animate-pulse" />
      <span className="text-xs font-bold tracking-wider text-white">LIVE</span>
    </div>
  );
}

interface MatchCardProps {
  match: Match;
  now: number;
}

export function MatchCard({ match, now }: MatchCardProps) {
  const navigate = useNavigate();
  const Icon = sportConfig[match.sport].icon;
  const gradientColor = sportConfig[match.sport].color;
  const countdownSeconds = Math.max(
    0,
    Math.floor((match.startTime.getTime() - now) / 1000)
  );

  function goToTeam(e: React.MouseEvent, teamName: string) {
    e.stopPropagation();
    navigate(`/team/${encodeURIComponent(teamName)}`);
  }

  const baseClasses =
    'group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-md hover:shadow-green-100';

  const teamNameClass = (base: string) =>
    `${base} cursor-pointer hover:text-green-600 transition-colors`;

  if (match.status === 'live') {
    return (
      <div className={`${baseClasses} ring-2 ring-green-400/40`}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/60 to-emerald-50/60" />
        <div className="relative p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradientColor}`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs text-gray-500">{match.tournament}</span>
            </div>
            <LiveBadge />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center min-w-0">
              <p
                title={match.team1}
                onClick={(e) => goToTeam(e, match.team1)}
                className={teamNameClass('text-sm font-semibold text-gray-900 mb-1 whitespace-nowrap overflow-hidden text-ellipsis')}
              >
                {match.team1}
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-xl shrink-0">
              <span className="text-3xl font-bold text-gray-900">{match.score1}</span>
              <span className="text-gray-400">-</span>
              <span className="text-3xl font-bold text-gray-900">{match.score2}</span>
            </div>
            <div className="flex-1 text-center min-w-0">
              <p
                title={match.team2}
                onClick={(e) => goToTeam(e, match.team2)}
                className={teamNameClass('text-sm font-semibold text-gray-900 mb-1 whitespace-nowrap overflow-hidden text-ellipsis')}
              >
                {match.team2}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                style={{
                  width: `${((match.currentMinute || 0) / (match.totalMinutes || 90)) * 100}%`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500 min-w-[60px] text-right">
              {match.currentMinute}' / {match.totalMinutes}'
            </span>
          </div>

          {match.hasVip && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-full">
                VIP
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (match.status === 'upcoming') {
    return (
      <div className={baseClasses}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradientColor}`}>
                <Icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs text-gray-500">{match.tournament}</span>
            </div>
            {match.isEsports && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <GamepadIcon className="w-3 h-3" />
                Esports
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex-1 text-center min-w-0">
              <p
                title={match.team1}
                onClick={(e) => goToTeam(e, match.team1)}
                className={teamNameClass('text-sm font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis')}
              >
                {match.team1}
              </p>
            </div>
            <div className="text-gray-400 font-bold shrink-0">VS</div>
            <div className="flex-1 text-center min-w-0">
              <p
                title={match.team2}
                onClick={(e) => goToTeam(e, match.team2)}
                className={teamNameClass('text-sm font-semibold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis')}
              >
                {match.team2}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">{formatTime(match.startTime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-600">
                {formatCountdown(countdownSeconds)}
              </span>
            </div>
          </div>

          {match.hasVip && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-full">
                VIP
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Finished
  return (
    <div className={baseClasses}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-gradient-to-br ${gradientColor} opacity-60`}>
              <Icon className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs text-gray-400">{match.tournament}</span>
          </div>
          <span className="text-xs text-gray-400 font-medium">FT</span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center min-w-0">
            <p
              title={match.team1}
              onClick={(e) => goToTeam(e, match.team1)}
              className={teamNameClass('text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis')}
            >
              {match.team1}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg shrink-0">
            <span className={`text-xl font-bold ${match.score1! > match.score2! ? 'text-gray-900' : 'text-gray-400'}`}>
              {match.score1}
            </span>
            <span className="text-gray-300">-</span>
            <span className={`text-xl font-bold ${match.score2! > match.score1! ? 'text-gray-900' : 'text-gray-400'}`}>
              {match.score2}
            </span>
          </div>
          <div className="flex-1 text-center min-w-0">
            <p
              title={match.team2}
              onClick={(e) => goToTeam(e, match.team2)}
              className={teamNameClass('text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis')}
            >
              {match.team2}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}