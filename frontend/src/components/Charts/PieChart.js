import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';

const PieChart = ({ 
  data, 
  dataKey = 'value',
  nameKey = 'name',
  title, 
  height = 300,
  showLegend = true,
  colors = ['#22c55e', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
  innerRadius = 0,
  outerRadius = '80%'
}) => {
  const { isDark } = useTheme();

  const theme = {
    textColor: isDark ? '#e2e8f0' : '#374151',
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    borderColor: isDark ? '#475569' : '#e5e7eb',
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${isDark ? 'bg-dark-800 border-dark-600' : 'bg-white border-gray-200'}`}>
          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {data.payload[nameKey]}
          </p>
          <p className="text-sm" style={{ color: data.color }}>
            {dataKey}: {data.value}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {((data.value / data.payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent > 0.05) {
      return (
        <text 
          x={x} 
          y={y} 
          fill="white" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
          fontSize={12}
          fontWeight="600"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
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
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                stroke={theme.borderColor}
                strokeWidth={2}
              />
            ))}
          </Pie>
          
          <Tooltip content={<CustomTooltip />} />
          
          {showLegend && (
            <Legend 
              wrapperStyle={{ color: theme.textColor }}
              formatter={(value, entry) => (
                <span style={{ color: theme.textColor }}>
                  {value}
                </span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart;
