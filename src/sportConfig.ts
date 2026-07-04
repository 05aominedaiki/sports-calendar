import { Trophy, Zap, Users, Swords, Target } from 'lucide-react';
import { Sport } from './types';
import { SoccerIcon, BasketballIcon, GamepadIcon, CrosshairIcon } from './Components/Icons';

export const sportConfig: Record<
  Sport,
  { icon: React.ElementType; label: string; color: string }
> = {
  all:        { icon: Trophy,         label: 'Tất cả',      color: 'from-gray-500 to-gray-600' },
  football:   { icon: SoccerIcon,     label: 'Bóng đá',     color: 'from-green-500 to-emerald-600' },
  basketball: { icon: BasketballIcon, label: 'Bóng rổ',     color: 'from-orange-500 to-amber-600' },
  tennis:     { icon: Target,         label: 'Quần vợt',    color: 'from-yellow-500 to-lime-500' },
  csgo:       { icon: CrosshairIcon,  label: 'CS2',         color: 'from-amber-600 to-orange-700' },
  valorant:   { icon: Swords,         label: 'Valorant',    color: 'from-emerald-500 to-green-600' },
  lol:        { icon: GamepadIcon,    label: 'LoL',         color: 'from-blue-500 to-cyan-500' },
  volleyball: { icon: Users,          label: 'Bóng chuyền', color: 'from-blue-500 to-indigo-600' },
  f1:         { icon: Zap,            label: 'Formula 1',   color: 'from-green-600 to-emerald-700' },
  badminton:  { icon: Target,         label: 'Cầu lông',    color: 'from-green-500 to-teal-600' },
};