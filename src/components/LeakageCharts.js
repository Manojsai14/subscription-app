import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#f44336', '#ff9800', '#4caf50'];

function LeakageCharts({ data }) {
  const pieData = [
    { name: 'High Leakage', value: data.filter(s => s.priority === 'High').reduce((sum, s) => sum + s.monthlyCost, 0) },
    { name: 'Medium Leakage', value: data.filter(s => s.priority === 'Medium').reduce((sum, s) => sum + s.monthlyCost, 0) },
    { name: 'Active / Safe', value: data.filter(s => s.priority === 'Active').reduce((sum, s) => sum + s.monthlyCost, 0) },
  ].filter(d => d.value > 0);

  const barData = data.slice(0, 8).map(s => ({
    name: s.name.length > 10 ? s.name.slice(0, 10) + '...' : s.name,
    cost: s.monthlyCost,
    score: Math.round(s.leakageScore / 100)
  }));

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
      <div style={styles.chartBox}>
        <h3 style={styles.title}>💸 Spending Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(value) => `₹${value}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.chartBox}>
        <h3 style={styles.title}>📊 Cost vs Leakage Score</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cost" fill="#667eea" name="Monthly Cost (₹)" />
            <Bar dataKey="score" fill="#f44336" name="Leakage Score (/100)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const styles = {
  chartBox: { flex: 1, minWidth: '300px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  title: { margin: '0 0 16px', color: '#333', fontSize: '16px' }
};

export default LeakageCharts;