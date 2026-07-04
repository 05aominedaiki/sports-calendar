import { Sport } from '../types';
import { sportConfig } from '../sportConfig';

interface SportFilterProps {
  selected: Sport;
  onSelect: (sport: Sport) => void;
}

const sports: Sport[] = [
  'all', 'football', 'basketball', 'tennis',
  'csgo', 'valorant', 'lol', 'volleyball', 'f1', 'badminton',
];

export function SportFilter({ selected, onSelect }: SportFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {sports.map((sport) => {
        const config = sportConfig[sport];
        const Icon = config.icon;
        const isActive = selected === sport;

        return (
          <button
            key={sport}
            onClick={() => onSelect(sport)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 ${
              isActive
                ? `bg-gradient-to-r ${config.color} text-white shadow-lg`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}