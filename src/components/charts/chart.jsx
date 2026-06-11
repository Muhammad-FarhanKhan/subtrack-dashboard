import React, { useState, useEffect } from "react";
import "../charts/chart.css";

function ExpenseChart({ activeCount = 0 }) {
  const [timePeriod, setTimePeriod] = useState("monthly");
  const [chartData, setChartData] = useState([]);
  const [maxAmount, setMaxAmount] = useState(1);

  useEffect(() => {
    // 1. LocalStorage se live subscriptions data array load karna
    const subscriptions =
      JSON.parse(localStorage.getItem("subscriptions")) || [];
    const today = new Date();

    const dayKey = today.toDateString();
    const monthKey = `${today.getFullYear()}-${today.getMonth()}`;
    const yearKey = `${today.getFullYear()}`;

    // 2. Persistent locked metrics historical snapshot loaders
    const historyStorageKey = `chart_locked_history_duration_${timePeriod}`;
    const savedChartHistory =
      JSON.parse(localStorage.getItem(historyStorageKey)) || {};

    // Dynamic state context identifier key parameters setup
    let activeIntervalKey = monthKey;
    if (timePeriod === "daily") activeIntervalKey = dayKey;
    if (timePeriod === "weekly")
      activeIntervalKey = `week-${Math.ceil(today.getDate() / 7)}-${monthKey}`;
    if (timePeriod === "yearly") activeIntervalKey = yearKey;

    if (!savedChartHistory[activeIntervalKey]) {
      savedChartHistory[activeIntervalKey] = {};
    }

    // Initialize accumulative structure array cache layers
    const finalMergedSum = { ...savedChartHistory[activeIntervalKey] };

    // 3. INTERNAL SESSION CONTROLLER RIG: Prevents duplicate addition on page reloads/switches
    const trackedSessionKey = `session_processed_ids_${timePeriod}`;
    let processedIdsLog = JSON.parse(
      window.sessionStorage?.getItem(trackedSessionKey) || "[]",
    );

    // 4. PARSE SUBSCRIPTIONS STREAM WITH ACCUMULATIVE LOGIC
    subscriptions.forEach((item) => {
      if (!item.price || !item.category || !item.duration || !item.id) return;

      // Skip item calculation loop framework criteria if already counted inside current session
      if (processedIdsLog.includes(item.id)) return;

      const itemDuration = item.duration.trim();
      let isPackageMatch = false;

      // Classify and filter items according to select text dropdown states duration structures
      if (timePeriod === "daily") {
        if (itemDuration === "1 Day") isPackageMatch = true;
      } else if (timePeriod === "weekly") {
        if (itemDuration === "1 Week") isPackageMatch = true;
      } else if (timePeriod === "monthly") {
        if (
          itemDuration === "1 Month" ||
          itemDuration === "3 Months" ||
          itemDuration === "6 Months"
        )
          isPackageMatch = true;
      } else if (timePeriod === "yearly") {
        if (itemDuration === "1 Year" || itemDuration === "2 Years")
          isPackageMatch = true;
      }

      // FIXED ENGINE PURE MATH MATRIX ACCUMULATION
      if (isPackageMatch) {
        const cat = item.category.trim();
        let basePrice = parseFloat(item.price) || 0;

        // Cumulative plus addition loop logic. Never drops figures over row removals!
        finalMergedSum[cat] = (finalMergedSum[cat] || 0) + basePrice;
        processedIdsLog.push(item.id);
      }
    });

    // 5. UPDATE SYSTEM DATA OVERWRITE STORAGE KEYS LEDGERS
    savedChartHistory[activeIntervalKey] = finalMergedSum;
    localStorage.setItem(historyStorageKey, JSON.stringify(savedChartHistory));

    if (window.sessionStorage) {
      window.sessionStorage.setItem(
        trackedSessionKey,
        JSON.stringify(processedIdsLog),
      );
    }

    // 6. FORMAT DICTIONARY RECODS TO RENDER VERTICAL GRAPH COLUMNS PILLARS
    const formattedData = Object.keys(finalMergedSum).map((catName) => ({
      name: catName,
      amount: finalMergedSum[catName],
    }));

    // Find highest peak pricing limits variables to scale bar chart dimension lines dynamically
    const maxVal = formattedData.reduce(
      (max, item) => (item.amount > max ? item.amount : max),
      0,
    );

    setMaxAmount(maxVal > 0 ? maxVal : 1);
    setChartData(formattedData);
  }, [timePeriod, activeCount]);

  return (
    <div className="analytics-chart-container">
      <div className="chart-top-header">
        <h2 className="chart-section-title">
          Expense Analytics By Duration Plans
        </h2>

        {/* INTERACTIVE NAVIGATION CONTROL INTERVAL TIME FILTERS BUTTON SWITCHES TILES */}
        <div className="chart-filter-tabs">
          <button
            className={`filter-tab ${timePeriod === "daily" ? "active-tab" : ""}`}
            onClick={() => setTimePeriod("daily")}
          >
            Daily Plans
          </button>
          <button
            className={`filter-tab ${timePeriod === "weekly" ? "active-tab" : ""}`}
            onClick={() => setTimePeriod("weekly")}
          >
            Weekly Plans
          </button>
          <button
            className={`filter-tab ${timePeriod === "monthly" ? "active-tab" : ""}`}
            onClick={() => setTimePeriod("monthly")}
          >
            Monthly Plans
          </button>
          <button
            className={`filter-tab ${timePeriod === "yearly" ? "active-tab" : ""}`}
            onClick={() => setTimePeriod("yearly")}
          >
            Yearly Plans
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="chart-empty-state">
          <p>
            No historical expenses captured inside this subscription package
            configuration yet.
          </p>
        </div>
      ) : (
        /* VISUAL FLEX RESPONSIVE BARS WRAPPER COLUMN LAYOUTS */
        <div className="visual-chart-bars-wrapper">
          {chartData.map((item, index) => {
            const barHeightPercentage = (item.amount / maxAmount) * 100;
            if (item.amount === 0) return null;

            return (
              <div key={index} className="individual-chart-column">
                <div className="bar-interactive-track">
                  {/* Absolute integer value price output layer inside hovering pop container label tooltips */}
                  <span className="bar-tooltip-price">
                    Rs.{item.amount.toFixed(0)}
                  </span>
                  <div
                    className={`bar-dynamic-fill-pillar fill-color-${index % 4}`}
                    style={{ height: `${barHeightPercentage}%` }}
                  ></div>
                </div>
                <span
                  className="chart-bar-category-label-text"
                  title={item.name}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExpenseChart;
