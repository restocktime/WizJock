import { Link } from 'react-router-dom';
import type { BreadcrumbItem } from '../utils/seo';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation component
 * 
 * Displays breadcrumb navigation with proper semantic HTML and accessibility
 * 
 * Usage:
 * ```tsx
 * const breadcrumbs = generateStateBreadcrumbs(stateData);
 * <Breadcrumb items={breadcrumbs} />
 * ```
 */
export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`text-sm text-gray-600 ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;
          
          // Convert full URLs to relative paths for internal links
          const path = item.url.replace('https://wizjock.com', '');
          
          return (
            <li key={item.position} className="flex items-center">
              {!isFirst && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  /
                </span>
              )}
              {isLast ? (
                <span 
                  className="font-medium text-gray-900" 
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={path}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
