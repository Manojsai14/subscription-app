import React, { useState, useEffect } from 'react';

function EditSubscriptionModal({ sub, onSave, onClose }) {
  const [form, setForm] = useState(sub);

  useEffect(() => setForm(sub), [sub]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>✏️ Edit Subscription</h3>
        <input style={styles.input} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Service Name" />
        <input style={styles.input} type="number" name="monthlyCost" value={form.monthlyCost} onChange={handleChange} placeholder="Monthly Cost" />
        <input style={styles.input} type="date" name="lastUsedDate" value={form.lastUsedDate?.slice(0, 10)} onChange={handleChange} />
        <input style={styles.input} type="date" name="renewalDate" value={form.renewalDate?.slice(0, 10)} onChange={handleChange} />
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <button style={styles.saveBtn} onClick={() => onSave(form)}>💾 Save Changes</button>
          <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '12px' },
  title: { margin: '0 0 8px', color: '#333' },
  input: { width: '100%', padding: '10px 14px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  saveBtn: { flex: 1, padding: '12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  cancelBtn: { flex: 1, padding: '12px', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default EditSubscriptionModal;