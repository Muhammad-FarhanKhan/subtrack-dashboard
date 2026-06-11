// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import SubscriptionList from '../components/subscriptionlist/subscriptionlist'; 
import ExpenseChart from '../components/charts/chart';
import FinancialOverview from '../components/financialSection/financial'; 
import Banner from '../assets/banner.png'; 
import '../css/Dashboard.css';

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);

  // =======================================================
  // 1. LOCAL STORAGE DATA EXTRACTION
  // =======================================================
  useEffect(() => {
    
    const savedData = JSON.parse(localStorage.getItem('subscriptions')) || [];
    setSubscriptions(savedData);
  }, []);

  // =======================================================
  // 2. ACTIVE STATUS COUNTER ONLY (REQUIRED FOR SYNC)
  // =======================================================
  const activeCount = subscriptions.filter(item => item.status === 'Active').length;

  return (
    <div className="dashboard-container">
      
      
      <div className="dashboard-hero-banner">

        <img src={Banner} className="banner-bg-img" alt="Dashboard Banner" />

        <div className="banner-overlay-content">
          <h1 className="header-title">Your Subscription Dashboard</h1>
          <p className="header-subtitle">
            Track your monthly expenses, manage active renewals, and keep your
            budget under control in one single place.
          </p>
        </div>

      </div>

      {/* Financial Section */}
      <FinancialOverview activeCount={activeCount} />

      {/* Expensive Chart Section */}
      <ExpenseChart activeCount={activeCount} />

      {/* Subscription List Section*/}
      <SubscriptionList subscriptions={subscriptions} />
      
    </div>
  );
}

export default Dashboard;
