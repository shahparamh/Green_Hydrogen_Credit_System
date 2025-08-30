import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

const BarChart = ({ 
  data, 
  dataKeys, 
  xAxisKey, 
  title, 
  height = 300,
  showGrid = true,
  showLegend = true,
  colors = ['#22c55e', '#0ea5e9', '#f59e0b', '#ef4444'],
  stacked = false
}) => {
  const { isDark } = useTheme();

  const theme = {
    textColor: isDark ? '#e2e8f0' : '#374151',
    gridColor: isDark ? '#475569' : '#e5e7eb',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#475569' : '#e5e7eb',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${isDark ? 'bg-dark-800 border-dark-600' : 'bg-white border-gray-200'}`}>
          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`card p-6 ${isDark ? 'bg-dark-800' : 'bg-white'}`}>
      {title && (
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={theme.gridColor}
              opacity={0.3}
            />
          )}
          
          <XAxis 
            dataKey={xAxisKey} 
            stroke={theme.textColor}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: theme.borderColor }}
          />
          
          <YAxis 
            stroke={theme.textColor}
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: theme.borderColor }}
            tickFormatter={(value) => value.toLocaleString()}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {showLegend && (
            <Legend 
              wrapperStyle={{ color: theme.textColor }}
            />
          )}
          
          {dataKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[4, 4, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
