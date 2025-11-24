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
                                    'flex flex-col items-center justify-center p-4 rounded-xl border transition-all min-h-[100px] relative group',
                                    isActive
                                        ? 'border-cyan-500 bg-cyan-500/10 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                        : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700 hover:bg-gray-800 hover:text-white'
                                )
                            }
                        >
                            <sport.icon className={clsx("w-8 h-8 mb-2 transition-colors", ({ isActive }: { isActive: boolean }) => isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300")} />
                            <span className="text-lg font-black tracking-wide">{sport.name}</span>
                            {sport.count > 0 && (
                                <span className={clsx(
                                    "absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full",
                                    ({ isActive }: { isActive: boolean }) => isActive ? "bg-cyan-500 text-black" : "bg-gray-800 text-gray-400"
                                )}>
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
