import React, { useState } from 'react';
import { signIn } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await signIn(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📊 Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  card: {
    background: 'white', padding: '40px', borderRadius: '16px',
    width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
  },
  title: { textAlign: 'center', color: '#333', marginBottom: '8px' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '24px' },
  input: {
    width: '100%', padding: '12px 16px', marginBottom: '16px',
    border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '15px',
    outline: 'none', boxSizing: 'border-box'
  },
  button: {
    width: '100%', padding: '14px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px',
    cursor: 'pointer', fontWeight: 'bold'
  },
  error: {
    background: '#ffebee', color: '#c62828', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', textAlign: 'center'
  },
  link: { textAlign: 'center', marginTop: '20px', color: '#666' }
};

export default SignIn;