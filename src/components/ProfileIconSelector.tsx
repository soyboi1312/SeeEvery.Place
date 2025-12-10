// src/components/ProfileIconSelector.tsx
import { PROFILE_ICONS } from '@/components/ProfileIcons';

interface ProfileIconSelectorProps {
  selectedIcon: string | null;
  onSelect: (iconName: string) => void;
}

export default function ProfileIconSelector({ selectedIcon, onSelect }: ProfileIconSelectorProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
      {Object.entries(PROFILE_ICONS).map(([name, Icon]) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className={`
            p-3 rounded-xl flex items-center justify-center transition-all duration-200
            ${selectedIcon === name
              ? 'bg-blue-600 text-white shadow-lg scale-110 ring-2 ring-blue-300 dark:ring-blue-900'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
            }
          `}
          title={name.charAt(0).toUpperCase() + name.slice(1)}
          type="button"
        >
          <Icon className="w-6 h-6" />
        </button>
      ))}
    </div>
  );
}
