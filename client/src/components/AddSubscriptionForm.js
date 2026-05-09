import React, { useState } from 'react';

function AddSubscriptionForm({ onAdd }) {
  const [form, setForm] = useState({
    name: '', monthlyCost: '', category: 'OTT',
    lastUsedDate: '', renewalDate: '', notes: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ name: '', monthlyCost: '', category: 'OTT', lastUsedDate: '', renewalDate: '', notes: '' });
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>➕ Add New Subscription</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} type="text" name="name" placeholder="Service Name (e.g. Netflix)" value={form.name} onChange={handleChange} required />
        <input style={styles.input} type="number" name="monthlyCost" placeholder="Monthly Cost (₹)" value={form.monthlyCost} onChange={handleChange} required />
        <select style={styles.input} name="category" value={form.category} onChange={handleChange}>
          <option>OTT</option>
          <option>Music</option>
          <option>Software</option>
          <option>Gaming</option>
          <option>Other</option>
        </select>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Last Used Date</label>
            <input style={styles.input} type="date" name="lastUsedDate" value={form.lastUsedDate} onChange={handleChange} required />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Renewal Date</label>
            <input style={styles.input} type="date" name="renewalDate" value={form.renewalDate} onChange={handleChange} required />
          </div>
        </div>
        <textarea style={{ ...styles.input, height: '70px', resize: 'vertical' }} name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} />
        <button style={styles.button} type="submit">Add Subscription</button>
      </form>
    </div>
  );
}

const styles = {
  container: { background: 'white', padding: '24px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  title: { margin: '0 0 16px', color: '#333' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  label: { fontSize: '13px', color: '#666', display: 'block', marginBottom: '4px' },
  input: { width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  button: { padding: '12px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }
};

export default AddSubscriptionForm;