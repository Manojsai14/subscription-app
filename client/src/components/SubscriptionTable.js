import React from 'react';

function SubscriptionTable({ data, onEdit, onDelete, onLogUsage }) {
  const priorityColors = { High: '#ffcdd2', Medium: '#ffe0b2', Active: '#c8e6c9' };
  const textColors = { High: '#c62828', Medium: '#e65100', Active: '#2e7d32' };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Service</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Monthly Cost</th>
            <th style={styles.th}>Last Used</th>
            <th style={styles.th}>Days Unused</th>
            <th style={styles.th}>Renewal Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sub) => (
            <tr key={sub._id} style={styles.row}>
              <td style={styles.td}><strong>{sub.name}</strong></td>
              <td style={styles.td}>{sub.category}</td>
              <td style={styles.td}>₹{sub.monthlyCost}</td>
              <td style={styles.td}>{new Date(sub.lastUsedDate).toLocaleDateString()}</td>
              <td style={styles.td}>{sub.unusedDays ?? '—'} days</td>
              <td style={styles.td}>{new Date(sub.renewalDate).toLocaleDateString()}</td>
              <td style={styles.td}>
                <span style={{
                  padding: '4px 10px', borderRadius: '20px',
                  background: priorityColors[sub.priority] || '#e0e0e0',
                  color: textColors[sub.priority] || '#333',
                  fontWeight: 'bold', fontSize: '13px'
                }}>
                  {sub.priority || 'Active'}
                </span>
              </td>
              <td style={styles.td}>
                <button style={styles.btnGreen} onClick={() => onLogUsage(sub._id)}>✅ Used</button>
                <button style={styles.btnBlue} onClick={() => onEdit(sub)}>✏️ Edit</button>
                <button style={styles.btnRed} onClick={() => onDelete(sub._id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' },
  headerRow: { background: '#667eea', color: 'white' },
  th: { padding: '14px 16px', textAlign: 'left', fontWeight: '600' },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', color: '#333' },
  btnGreen: { background: '#4caf50', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '4px', fontSize: '12px' },
  btnBlue: { background: '#2196f3', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', marginRight: '4px', fontSize: '12px' },
  btnRed: { background: '#f44336', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }
};

export default SubscriptionTable;