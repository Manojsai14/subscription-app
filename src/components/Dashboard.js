import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getLeakageAnalysis,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  logUsage
} from '../services/api';
import SummaryCard from './SummaryCard';
import SubscriptionTable from './SubscriptionTable';
import LeakageCharts from './LeakageCharts';
import AddSubscriptionForm from './AddSubscriptionForm';
import EditSubscriptionModal from './EditSubscriptionModal';

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [editSub, setEditSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Fetch all subscriptions with leakage analysis
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getLeakageAnalysis();
      setSubscriptions(data);
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Get subscriptions renewing within 7 days
  const getRenewalAlerts = () => {
    return subscriptions
      .filter(s => {
        const daysLeft = Math.ceil(
          (new Date(s.renewalDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return daysLeft <= 7 && daysLeft >= 0;
      })
      .map(s => ({
        ...s,
        daysLeft: Math.ceil(
          (new Date(s.renewalDate) - new Date()) / (1000 * 60 * 60 * 24)
        )
      }));
  };

  // Add new subscription
  const handleAdd = async (form) => {
    try {
      await addSubscription(form);
      fetchData();
    } catch (err) {
      console.error('Failed to add subscription:', err);
    }
  };

  // Save edited subscription
  const handleSaveEdit = async (form) => {
    try {
      await updateSubscription(form._id, form);
      setEditSub(null);
      fetchData();
    } catch (err) {
      console.error('Failed to update subscription:', err);
    }
  };

  // Delete subscription
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteSubscription(id);
        fetchData();
      } catch (err) {
        console.error('Failed to delete subscription:', err);
      }
    }
  };

  // Log usage (mark as used today)
  const handleLogUsage = async (id) => {
    try {
      await logUsage(id);
      fetchData();
    } catch (err) {
      console.error('Failed to log usage:', err);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  const alerts = getRenewalAlerts();

  return (
    <div style={styles.page}>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.headerTitle}>📊 Subscription Leakage Tracker</h1>
          <p style={styles.headerSubtitle}>Monitor and manage your subscriptions</p>
        </div>
        <div style={styles.userArea}>
          <span style={styles.userName}>👤 {user.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.content}>

        {loading ? (
          <div style={styles.loadingContainer}>
            <p style={styles.loadingText}>⏳ Loading your subscriptions...</p>
          </div>
        ) : (
          <>
            {/* Renewal Alerts */}
            {alerts.length > 0 && (
              <div style={styles.alertContainer}>
                <h3 style={styles.alertHeading}>🔔 Upcoming Renewals</h3>
                {alerts.map(s => (
                  <div
                    key={s._id}
                    style={{
                      ...styles.alertBox,
                      background: s.daysLeft <= 2 ? '#ffebee' : '#fff3e0',
                      borderLeft: s.daysLeft <= 2
                        ? '5px solid #f44336'
                        : '5px solid #ff9800'
                    }}
                  >
                    <span style={styles.alertIcon}>
                      {s.daysLeft <= 2 ? '🚨' : '⚠️'}
                    </span>
                    <div style={styles.alertInfo}>
                      <strong style={styles.alertName}>{s.name}</strong>
                      <p style={styles.alertText}>
                        Renews in{' '}
                        <strong>{s.daysLeft} day{s.daysLeft !== 1 ? 's' : ''}</strong>
                        {' '}— ₹{s.monthlyCost}/month
                      </p>
                    </div>
                    <span
                      style={{
                        ...styles.alertBadge,
                        background: s.daysLeft <= 2 ? '#f44336' : '#ff9800'
                      }}
                    >
                      {s.daysLeft <= 2 ? 'URGENT' : 'SOON'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Cards */}
            <SummaryCard data={subscriptions} />

            {/* Add Subscription Form */}
            <AddSubscriptionForm onAdd={handleAdd} />

            {/* Charts */}
            <LeakageCharts data={subscriptions} />

            {/* Subscription Table */}
            <div style={styles.tableContainer}>
              <h3 style={styles.tableTitle}>📋 All Subscriptions</h3>
              {subscriptions.length === 0 ? (
                <p style={styles.emptyText}>
                  No subscriptions yet. Add your first one above! 👆
                </p>
              ) : (
                <SubscriptionTable
                  data={subscriptions}
                  onEdit={setEditSub}
                  onDelete={handleDelete}
                  onLogUsage={handleLogUsage}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {editSub && (
        <EditSubscriptionModal
          sub={editSub}
          onSave={handleSaveEdit}
          onClose={() => setEditSub(null)}
        />
      )}
    </div>
  );
}

const styles = {
  // Page
  page: {
    minHeight: '100vh',
    background: '#f5f7fb'
  },

  // Header
  header: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerTitle: {
    color: 'white',
    margin: 0,
    fontSize: '22px',
    fontWeight: 'bold'
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    margin: '4px 0 0',
    fontSize: '13px'
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userName: {
    color: 'white',
    fontSize: '15px'
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.4)',
    padding: '8px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },

  // Content
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px'
  },

  // Loading
  loadingContainer: {
    textAlign: 'center',
    padding: '60px'
  },
  loadingText: {
    color: '#666',
    fontSize: '18px'
  },

  // Renewal Alerts
  alertContainer: {
    background: 'white',
    padding: '20px 24px',
    borderRadius: '12px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  alertHeading: {
    margin: '0 0 16px',
    color: '#333',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  alertBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '14px 16px',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  alertIcon: {
    fontSize: '24px'
  },
  alertInfo: {
    flex: 1
  },
  alertName: {
    color: '#333',
    fontSize: '15px'
  },
  alertText: {
    margin: '4px 0 0',
    color: '#666',
    fontSize: '13px'
  },
  alertBadge: {
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap'
  },

  // Table Section
  tableContainer: {
    background: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  tableTitle: {
    margin: '0 0 16px',
    color: '#333',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    padding: '40px',
    fontSize: '16px'
  }
};

export default Dashboard;