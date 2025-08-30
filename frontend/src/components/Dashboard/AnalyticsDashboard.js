import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon,
  Calendar,
  Filter
} from 'lucide-react';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import PieChart from '../Charts/PieChart';
import { useTheme } from '../../contexts/ThemeContext';

const AnalyticsDashboard = ({ 
  title = 'Analytics Dashboard',
  data = {},
  timeRange = '30d',
  onTimeRangeChange,
  className = ''
}) => {
  const { isDark } = useTheme();
  const [selectedCharts, setSelectedCharts] = useState(['line', 'bar', 'pie']);
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    // Process and format data for charts
    if (data) {
      setChartData(data);
    }
  }, [data]);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' }
  ];

  const chartTypes = [
    { id: 'line', label: 'Line Charts', icon: TrendingUp },
    { id: 'bar', label: 'Bar Charts', icon: BarChart3 },
    { id: 'pie', label: 'Pie Charts', icon: PieChartIcon }
  ];

  const toggleChart = (chartId) => {
    setSelectedCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId)
        : [...prev, chartId]
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analytics and insights for your data
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Chart Type Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-800 rounded-lg p-1">
            {chartTypes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => toggleChart(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCharts.includes(id)
                    ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => onTimeRangeChange?.(e.target.value)}
              className="input-field py-1 px-2 text-sm min-w-[120px]"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        {selectedCharts.includes('line') && (
          <LineChart
            title="Trend Analysis"
            data={chartData.trendData || []}
            dataKeys={['credits', 'requests', 'approved']}
            xAxisKey="date"
            height={300}
            colors={['#22c55e', '#0ea5e9', '#f59e0b']}
          />
        )}

        {/* Bar Chart */}
        {selectedCharts.includes('bar') && (
          <BarChart
            title="Performance Comparison"
            data={chartData.performanceData || []}
            dataKeys={['current', 'previous']}
            xAxisKey="metric"
            height={300}
            colors={['#22c55e', '#0ea5e9']}
          />
        )}

        {/* Pie Chart */}
        {selectedCharts.includes('pie') && (
          <PieChart
            title="Distribution Overview"
            data={chartData.distributionData || []}
            dataKey="value"
            nameKey="category"
            height={300}
            innerRadius="40%"
          />
        )}

        {/* Additional Analytics Cards */}
        {chartData.summaryStats && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Summary Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(chartData.summaryStats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* No Charts Selected State */}
      {selectedCharts.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Charts Selected
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Select chart types from the toggle buttons above to view analytics
          </p>
          <button
            onClick={() => setSelectedCharts(['line', 'bar', 'pie'])}
            className="btn-primary"
          >
            Show All Charts
          </button>
        </div>
      )}

      {/* Data Export Section */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Export Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Download your analytics data in various formats
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="btn-outline text-sm">
              Export CSV
            </button>
            <button className="btn-outline text-sm">
              Export PDF
            </button>
            <button className="btn-outline text-sm">
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
