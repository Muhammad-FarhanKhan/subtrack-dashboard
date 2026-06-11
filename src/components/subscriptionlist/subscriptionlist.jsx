import React, { useState } from "react";
import "./subscriptionlist.css";

function SubscriptionList({ subscriptions = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const handleDelete = (id) => {
    if (window.confirm("Are you want to remove subscription?")) {
      const existing = JSON.parse(localStorage.getItem("subscriptions")) || [];
      const targetItem = existing.find((item) => item.id === id);
      const filtered = existing.filter((item) => item.id !== id);
      localStorage.setItem("subscriptions", JSON.stringify(filtered));

      if (targetItem) {
        const currentNotifications =
          JSON.parse(localStorage.getItem("system_notifications")) || [];
        const newDeleteNotification = {
          id: Date.now() + Math.random(),
          type: "delete",
          title: "Subscription Removed 🗑️",
          desc: `Stopped active tracking for "${targetItem.name}". Spent history record remains locked safely.`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
        };
        currentNotifications.unshift(newDeleteNotification);
        localStorage.setItem(
          "system_notifications",
          JSON.stringify(currentNotifications),
        );
        localStorage.setItem(
          "trigger_toast_flash",
          `${newDeleteNotification.title}: ${newDeleteNotification.desc}`,
        );
      }

      window.location.reload();
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = subscriptions.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(subscriptions.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="subscriptions-list-section">
      <h2 className="section-title">Active & Expired Tracked Services</h2>
      {subscriptions.length === 0 ? (
        <div className="empty-state-card">
          <svg
            className="empty-icon"
            xmlns="http://w3.org"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" x2="12" y1="8" y2="12"></line>
            <line x1="12" x2="12.01" y1="16" y2="16"></line>
          </svg>
          <p>
            No subscriptions found. Click "Add Subscription" to start tracking!
          </p>
        </div>
      ) : (
        <>
          <div className="table-responsive-wrapper">
            <table className="subs-data-table">
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Category</th>
                  <th>Cycle</th>
                  <th>Price</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((item) => (
                  <tr key={item.id} className="table-data-row">
                    <td className="td-name-cell">
                      <div className="service-avatar">
                        {item.name ? item.name.charAt(0).toUpperCase() : "S"}
                      </div>
                      <span className="service-text-name">{item.name}</span>
                    </td>
                    <td className="td-category-cell">{item.category}</td>
                    <td>
                      <span className="table-cycle-pill">
                        {item.billingCycle}
                      </span>
                    </td>
                    <td className="td-price-cell">
                      Rs. {item.price ? item.price.toFixed(2) : "0.00"}
                    </td>
                    <td className="td-date-cell">{item.expiryDate}</td>
                    <td>
                      <span
                        className={`status-badge-indicator ${item.status === "Active" ? "status-active" : "status-expired"}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="delete-row-btn"
                        onClick={() => handleDelete(item.id)}
                        title="Remove Subscription"
                      >
                        <svg
                          xmlns="http://w3.org"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="table-pagination-navigator-footer">
              <button
                onClick={handlePrevPage}
                className="pagination-btn-arrow"
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span className="pagination-pages-counter-text">
                Page <strong>{currentPage}</strong> of{" "}
                <strong>{totalPages}</strong>
              </span>
              <button
                onClick={handleNextPage}
                className="pagination-btn-arrow"
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SubscriptionList;
