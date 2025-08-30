import React from 'react';
import { LucideIcon } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon: Icon, 
  trend = null,
  className = '' 
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-600 dark:text-green-400';
      case 'negative':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive':
        return '↗';
      case 'negative':
        return '↘';
      default:
        return '→';
    }
  };

  const getTrendColor = (trend) => {
    if (!trend) return '';
    return trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          
          {change && (
            <div className="mt-2 flex items-center text-sm">
              <span className={`font-medium ${getChangeColor(changeType)}`}>
                {getChangeIcon(changeType)} {change}
              </span>
              {trend && (
                <span className={`ml-2 ${getTrendColor(trend)}`}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
            </div>
          )}
        </div>
        
        {Icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
