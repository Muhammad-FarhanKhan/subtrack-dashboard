import React, { useState, useEffect, useRef } from "react";
import { NavLink } from 'react-router-dom';
import "./navbar.css";
import Logo from "../../assets/SubTrack.png";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const dropdownRef = useRef(null);

  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-theme");
    else document.body.classList.remove("dark-theme");
  }, [darkMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const syncNotificationsEngine = () => {
    const subs = JSON.parse(localStorage.getItem('subscriptions')) || [];
    let logs = JSON.parse(localStorage.getItem('system_notifications')) || [];
    const today = new Date();
    const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
    const currentYearKey = `${today.getFullYear()}`;
    let stateChanged = false;

    subs.forEach(item => {
      if (item.status === 'Active' && item.expiryDate) {
        const expiry = new Date(item.expiryDate);
        if (today > expiry) {
          const isDuplicate = logs.some(n => n.itemId === item.id && n.type === 'expiry');
          if (!isDuplicate) {
            logs.unshift({
              id: Date.now() + Math.random(),
              itemId: item.id,
              type: 'expiry',
              title: 'Subscription Expired! ⚠️',
              desc: `Your active package plan for "${item.name}" has expired on ${item.expiryDate}.`,
              timestamp: today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              read: false
            });
            stateChanged = true;
          }
        }
      }
    });

    const monthlySpendData = JSON.parse(localStorage.getItem('locked_monthly_spend')) || {};
    const yearlySpendData = JSON.parse(localStorage.getItem('locked_yearly_spend')) || {};

    if (monthlySpendData[currentMonthKey] > 0 && !logs.some(n => n.cycleKey === currentMonthKey && n.type === 'monthly_summary')) {
      logs.unshift({
        id: Date.now() + Math.random(),
        cycleKey: currentMonthKey,
        type: 'monthly_summary',
        title: 'Monthly Ledger Closed 📊',
        desc: `Current month cycle closing balance totals locked at Rs.${monthlySpendData[currentMonthKey].toFixed(2)}.`,
        timestamp: today.toLocaleDateString(),
        read: false
      });
      stateChanged = true;
    }

    if (yearlySpendData[currentYearKey] > 0 && !logs.some(n => n.cycleKey === currentYearKey && n.type === 'yearly_summary')) {
      logs.unshift({
        id: Date.now() + Math.random(),
        cycleKey: currentYearKey,
        type: 'yearly_summary',
        title: 'Annual Fiscal Closed 🏢',
        desc: `Annual dynamic projection spend ledger compiled total: Rs.${Math.round(yearlySpendData[currentYearKey])}.`,
        timestamp: today.toLocaleDateString(),
        read: false
      });
      stateChanged = true;
    }

    const pendingToastFlash = localStorage.getItem('trigger_toast_flash');
    if (pendingToastFlash) {
      setToastMessage(pendingToastFlash);
      localStorage.removeItem('trigger_toast_flash');
      setTimeout(() => setToastMessage(null), 4000);
      stateChanged = true;
    }

    if (stateChanged || logs.length !== notifications.length) {
      localStorage.setItem('system_notifications', JSON.stringify(logs));
      setNotifications(logs);
    }
  };

  useEffect(() => {
    syncNotificationsEngine();
    const corePollingIntervalId = setInterval(syncNotificationsEngine, 1000); 
    return () => clearInterval(corePollingIntervalId);
  }, [notifications.length]);

  const handleClearAllNotifications = () => {
    if (notifications.length === 0) return;
    if (window.confirm("Kya aap waqai saari notifications delete karna chahty hain?")) {
      localStorage.removeItem('system_notifications'); 
      setNotifications([]); 
    }
  };

  const handleOpenDropdownDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      const readUpdates = notifications.map(n => ({ ...n, read: true }));
      localStorage.setItem('system_notifications', JSON.stringify(readUpdates));
      setNotifications(readUpdates);
    }
  };

  const hasUnreadAlerts = notifications.some(n => n.read === false);

  return (
    <>
      {toastMessage && (
        <div className="live-toast-alert-popup">
          <div className="toast-accent-line"></div>
          <div className="toast-content-wrapper-box">
            <h4>System Event Alert</h4>
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="nav-left">
          <img src={Logo} className="brand-logo-img" alt="SubTrack Logo" />
          <span className="brand-name">SUBTRACK</span>
        </div>

        <div className="nav-center">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
          <NavLink to="/add-subscription" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Add Subscription</NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Settings</NavLink>
        </div>

        <div className="nav-right" ref={dropdownRef}>
          <div className="theme-switch-wrapper">
            <label className="theme-switch" htmlFor="checkbox">
              <input type="checkbox" id="checkbox" checked={darkMode} onChange={toggleTheme} />
              <div className="slider">
                <svg className="icon-sun" xmlns="http://w3.org" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2m-7.07-15.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2m-15.66 5.66 1.41-1.41m11.32-11.32 1.41-1.41"/></svg>
                <svg className="icon-moon" xmlns="http://w3.org" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              </div>
            </label>
          </div>

          <button className="nav-btn bell-btn" onClick={handleOpenDropdownDropdown} title="Notifications Panel">
            <svg className="icon-bell" xmlns="http://w3.org" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
            {hasUnreadAlerts && <span className="bell-badge"></span>}
          </button>

          {/* FIXED MARKUP: Injected explicit overlay and card wrappers to link with the responsive CSS selectors */}
          {isOpen && (
            <div className="notifications-dropdown-sheet">
              <div className="mobile-only-modal-overlay" onClick={() => setIsOpen(false)}></div>
              
              <div className="dropdown-sheet-main-card">
                <div className="dropdown-sheet-header">
                  <h3>System Notifications</h3>
                  <div className="dropdown-actions-group">
                    <span className="notif-count-label">{notifications.length} Logs</span>
                    {notifications.length > 0 && (
                      <button onClick={handleClearAllNotifications} className="clear-all-notif-btn">Clear All</button>
                    )}
                  </div>
                </div>

                <div className="dropdown-scrollable-content-area">
                  {notifications.length === 0 ? (
                    <div className="empty-notif-state-message">
                      <p>Log interface empty. No warnings captured yet.</p>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <div key={item.id} className={`notification-item-card ${!item.read ? 'unread-item-bg' : ''}`}>
                        <div className="notif-item-header-meta">
                          <span className="notif-item-title-text">{item.title}</span>
                          <span className="notif-item-time-stamp">{item.timestamp}</span>
                        </div>
                        <p className="notif-item-desc-para">{item.desc}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </nav>
    </>
  );
}

export default Navbar;
