import { NavLink } from 'react-router-dom';
import { Trophy, Activity, Target, Swords } from 'lucide-react';
import clsx from 'clsx';

const sports = [
    { id: 'nfl', name: 'NFL', icon: Trophy, count: 12 },
    { id: 'nba', name: 'NBA', icon: Activity, count: 8 },
    { id: 'ncaa', name: 'NCAA', icon: Target, count: 15 },
    { id: 'ufc', name: 'UFC', icon: Swords, count: 4 },
];

export const SportNavigation = () => {
    return (
        <nav className="mb-6">
            <ul className="grid grid-cols-2 gap-3 sm:flex sm:space-x-4">
                {sports.map((sport) => (
                    <li key={sport.id} className="flex-1">
                        <NavLink
                            to={`/${sport.id}`}
                            className={({ isActive }) =>
                                clsx(
                                    'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all min-h-[100px] relative',
                                    isActive
                                        ? 'border-accent bg-accent/5 text-accent shadow-sm'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                )
                            }
                        >
                            <sport.icon className="w-8 h-8 mb-2" />
                            <span className="text-lg font-bold">{sport.name}</span>
                            {sport.count > 0 && (
                                <span className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {sport.count}
                                </span>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
