import React from 'react';

function SummaryCard({ data }) {
  const totalMonthly = data.reduce((sum, s) => sum + s.monthlyCost, 0);
  const leaking = data.filter(s => s.priority !== 'Active');
  const leakageAmount = leaking.reduce((sum, s) => sum + s.monthlyCost, 0);

  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
      <div style={{ ...styles.card, background: '#e3f2fd' }}>
        <h3 style={styles.label}>Total Monthly Spend</h3>
        <p style={styles.value}>₹{totalMonthly.toLocaleString()}</p>
      </div>
      <div style={{ ...styles.card, background: '#ffebee' }}>
        <h3 style={styles.label}>Monthly Leakage</h3>
        <p style={{ ...styles.value, color: '#c62828' }}>₹{leakageAmount.toLocaleString()}</p>
      </div>
      <div style={{ ...styles.card, background: '#fff3e0' }}>
        <h3 style={styles.label}>Inactive Subscriptions</h3>
        <p style={{ ...styles.value, color: '#e65100' }}>{leaking.length}</p>
      </div>
      <div style={{ ...styles.card, background: '#e8f5e9' }}>
        <h3 style={styles.label}>Potential Annual Savings</h3>
        <p style={{ ...styles.value, color: '#2e7d32' }}>₹{(leakageAmount * 12).toLocaleString()}</p>
      </div>
    </div>
  );
}

const styles = {
  card: { padding: '20px', borderRadius: '12px', flex: '1', minWidth: '180px' },
  label: { margin: '0 0 8px', fontSize: '14px', color: '#555' },
  value: { margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#333' }
};

export default SummaryCard;