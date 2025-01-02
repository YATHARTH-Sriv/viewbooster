import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string;
  views: number;
  date: string;
  likes: number;
  comments: number;
}

interface ChartProps {
  data: ChartData[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis 
          dataKey="date" 
          stroke="#888" 
          tick={{ fill: '#888' }}
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <YAxis stroke="#888" tick={{ fill: '#888' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
          labelStyle={{ color: '#888' }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="views" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6' }}
        />
        <Line 
          type="monotone" 
          dataKey="likes" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ fill: '#10b981' }}
        />
        <Line 
          type="monotone" 
          dataKey="comments" 
          stroke="#f59e0b" 
          strokeWidth={2}
          dot={{ fill: '#f59e0b' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;
