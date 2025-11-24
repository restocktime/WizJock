import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface UpdateIndicatorProps {
    lastUpdated: Date;
}

export const UpdateIndicator = ({ lastUpdated }: UpdateIndicatorProps) => {
    const [timeAgo, setTimeAgo] = useState('');
    const [isStale, setIsStale] = useState(false);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const diff = now.getTime() - new Date(lastUpdated).getTime();
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(minutes / 60);

            if (hours >= 24) {
                setIsStale(true);
                setTimeAgo(`${Math.floor(hours / 24)} days ago`);
            } else if (hours > 0) {
                setIsStale(false);
                setTimeAgo(`${hours} hours ago`);
            } else {
                setIsStale(false);
                setTimeAgo(`${minutes} minutes ago`);
            }
        };

        updateTime();
        const interval = setInterval(updateTime, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [lastUpdated]);

    return (
        <div className="flex items-center justify-end mb-4 text-sm">
            <div className={clsx('flex items-center gap-1.5', isStale ? 'text-yellow-500' : 'text-gray-400')}>
                {isStale ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                <span className="font-medium">Last Updated: {timeAgo}</span>
            </div>
        </div>
    );
};
