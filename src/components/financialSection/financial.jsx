import React, { useEffect, useState } from "react";
import "../financialSection/financial.css";

function FinancialOverview({ activeCount = 0 }) {
  // System dates tracking variables
  const today = new Date();
  const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`; // e.g., "2026-5"
  const currentYearKey = `${today.getFullYear()}`; // e.g., "2026"

  // States to lock values so they never go down on deletion
  const [monthlySpend, setMonthlySpend] = useState(0);
  const [yearlySpend, setYearlySpend] = useState(0);

  useEffect(() => {
    // 1. Current state database loading from local storage
    const subscriptions =
      JSON.parse(localStorage.getItem("subscriptions")) || [];

    // 2. Load previously locked totals to prevent subtraction on delete
    const savedMonthlyLog =
      JSON.parse(localStorage.getItem("locked_monthly_spend")) || {};
    const savedYearlyLog =
      JSON.parse(localStorage.getItem("locked_yearly_spend")) || {};

    // 3. Calculate current input stream monthly values (Normalized to Month)
    let calculatedMonthly = subscriptions.reduce((sum, item) => {
      // SECURE FALLBACK LOGIC: Both keys handled dynamically
      const rawDate = item.startDate || item.date;
      const pDate = new Date(rawDate);

      if (
        !isNaN(pDate.getTime()) &&
        pDate.getMonth() === today.getMonth() &&
        pDate.getFullYear() === today.getFullYear()
      ) {
        let price = parseFloat(item.price) || 0;
        if (item.billingCycle === "Yearly") price = price / 12;
        if (item.billingCycle === "Weekly") price = price * 4.33;
        return sum + price;
      }
      return sum;
    }, 0);

    // 4. YEARLY ACCUMULATOR (FIXED SIMPLE SEEDHA MATH): Pure direct price counting loop
    let calculatedYearly = subscriptions.reduce((sum, item) => {
      const rawDate = item.startDate || item.date;
      const pDate = new Date(rawDate);

      // Strict year matching filter: Pure chalte huay saal ka absolute values addition without multipliers!
      if (
        !isNaN(pDate.getTime()) &&
        pDate.getFullYear() === today.getFullYear()
      ) {
        let price = parseFloat(item.price) || 0;
        return sum + price;
      }
      return sum;
    }, 0);

    // 5. THE CORE RULE: Lock values so they ONLY grow, never drop on deletion!
    const finalMonthly = Math.max(
      calculatedMonthly,
      savedMonthlyLog[currentMonthKey] || 0,
    );
    const finalYearly = Math.max(
      calculatedYearly,
      savedYearlyLog[currentYearKey] || 0,
    );

    // 6. Update LocalStorage with the highest locked cumulative value
    savedMonthlyLog[currentMonthKey] = finalMonthly;
    savedYearlyLog[currentYearKey] = finalYearly;

    localStorage.setItem(
      "locked_monthly_spend",
      JSON.stringify(savedMonthlyLog),
    );
    localStorage.setItem("locked_yearly_spend", JSON.stringify(savedYearlyLog));

    // Set variables to state layout matrix
    setMonthlySpend(finalMonthly);
    setYearlySpend(finalYearly);

    // FIXED DEPENDENCY: LocalStorage length check directly read inside scope boundary
  }, [activeCount, localStorage.getItem("subscriptions")]);

  return (
    <div className="financial-overview-section">
      <h2 className="section-title">Financial Overview</h2>

      <div className="stats-grid-row">
        {/* Card 1: Monthly Total (Resets automatically next month) */}
        <div className="overview-stat-card card-monthly">
          <div className="card-top-header">
            <div className="label-with-icon">
              <svg
                className="stat-icon"
                xmlns="http://w3.org"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                <line x1="2" x2="22" y1="10" y2="10"></line>
              </svg>
              <span className="stat-label">Monthly Total</span>
            </div>
            <span className="card-badge badge-blue">1M Reset</span>
          </div>
          <div className="stat-amount-wrapper">
            <span className="currency-symbol">Pkr</span>
            <span className="stat-value-amount">{monthlySpend.toFixed(2)}</span>
          </div>
          <p className="card-footer-desc">Locked current month spending</p>
        </div>

        {/* Card 2: Yearly Total (FIXED: Direct counts accumulated over 1 year) */}
        <div className="overview-stat-card card-yearly">
          <div className="card-top-header">
            <div className="label-with-icon">
              <svg
                className="stat-icon"
                xmlns="http://w3.org"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="m12 3-1.912 5.886H3.894l5.018 3.646L6.999 18.42 12 14.774l5.001 3.645-1.913-5.888 5.018-3.646H13.912Z"></path>
              </svg>
              <span className="stat-label">Yearly Total</span>
            </div>
            <span className="card-badge badge-green">1Y Reset</span>
          </div>
          <div className="stat-amount-wrapper">
            <span className="currency-symbol">Pkr</span>
            <span className="stat-value-amount">{Math.round(yearlySpend)}</span>
          </div>
          <p className="card-footer-desc">Locked annual accumulated spend</p>
        </div>

        {/* Card 3: Active Subscriptions Live Counter */}
        <div className="overview-stat-card card-active">
          <div className="card-top-header">
            <div className="label-with-icon">
              <svg
                className="stat-icon"
                xmlns="http://w3.org"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21.89 10.5c.11.49.11.99.11 1.5 0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.51 0 2.92.37 4.16 1.02"></path>
                <path d="m10 11 2 2 8-8"></path>
              </svg>
              <span className="stat-label">Active Subscriptions</span>
            </div>
            <span className="card-badge badge-purple">Live</span>
          </div>
          <div className="stat-amount-wrapper">
            <span className="stat-value-amount no-currency">{activeCount}</span>
          </div>
          <p className="card-footer-desc">Service Tracked</p>
        </div>
      </div>
    </div>
  );
}

export default FinancialOverview;
