import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Subscription.css";

function AddSubscription() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); 
  const [category, setCategory] = useState("Entertainment");
  const [billingCycle, setBillingCycle] = useState("Monthly");
  const [durationPackage, setDurationPackage] = useState("1 Month");

  const handleAdd = (e) => {
    e.preventDefault();

    if (!name || !price || !durationPackage || !category) {
      alert("Please fill all the fields!");
      return;
    }

    // =======================================================
    // AUTO-DETECT CURRENT DATE & CALCULATE EXPIRY LOGIC
    // =======================================================
    const today = new Date();
    
    //Auto Detect Current Date
    const autoCurrentDateStr = today.toISOString().split("T")[0];

    const purchaseDate = new Date(autoCurrentDateStr);
    const expiryDate = new Date(autoCurrentDateStr);

    const [valueStr, unitStr] = durationPackage.split(" ");
    const valueNum = parseInt(valueStr);

    if (unitStr === "Day" || unitStr === "Days") {
      expiryDate.setDate(purchaseDate.getDate() + valueNum);
    } else if (unitStr === "Week" || unitStr === "Weeks") {
      expiryDate.setDate(purchaseDate.getDate() + (valueNum * 7));
    } else if (unitStr === "Month" || unitStr === "Months") {
      expiryDate.setMonth(purchaseDate.getMonth() + valueNum);
    } else if (unitStr === "Year" || unitStr === "Years") {
      expiryDate.setFullYear(purchaseDate.getFullYear() + valueNum);
    }

    const initialStatus = today > expiryDate ? "Expired" : "Active";

    const newSubscription = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      startDate: autoCurrentDateStr, // Auto-detected date saved here!
      expiryDate: expiryDate.toISOString().split("T")[0], 
      duration: durationPackage, 
      category,
      billingCycle,
      status: initialStatus,
    };

    const existingSubscriptions =
      JSON.parse(localStorage.getItem("subscriptions")) || [];

    const updatedList = [...existingSubscriptions, newSubscription];

    localStorage.setItem("subscriptions", JSON.stringify(updatedList));


    // =======================================================
    // REAL-TIME NOTIFICATION ON OPERATION
    // =======================================================
    const currentNotifications = JSON.parse(localStorage.getItem('system_notifications')) || [];
    const newAddNotification = {
      id: Date.now() + Math.random(),
      type: 'add',
      title: 'New Subscription Active! ',
      desc: `Successfully tracking "${name}" under "${category}" category at Rs.${parseFloat(price).toFixed(2)} (${billingCycle}).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    
    currentNotifications.unshift(newAddNotification);
    localStorage.setItem('system_notifications', JSON.stringify(currentNotifications));
    
    localStorage.setItem('trigger_toast_flash', `${newAddNotification.title}: ${newAddNotification.desc}`);

    alert("Subscription successfully added!");

    setName("");
    setPrice("");
    setDurationPackage("1 Month");
    setCategory("Entertainment");
    setBillingCycle("Monthly");

    navigate("/");
    window.location.reload(); 
  };

  return (
    <>
      <div className="add-sub-container">
        <div className="add-sub-header">
          <h1>Add New Subscription</h1>
          <p>Enter the details below to track your new subscription</p>
        </div>
        <form className="add-sub-form" onSubmit={handleAdd}>
          
          {/* 1. Subscription Name */}
          <div className="form-group">
            <label>Subscription Name</label>
            <input
              type="text"
              placeholder="e.g., Netflix, Spotify, GitHub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* 2. Price aur Billing Cycle */}
          <div className="form-row-grid">
            <div className="form-group">
              <label>Price (PKR)</label>
              <div className="price-input-wrapper">
                <span className="price-prefix">Rs</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Billing Cycle</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
              >
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>

          {/* 3. Category Dropdown List */}
          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="duration-select-field"
            >
              <option value="Entertainment">Entertainment (Movies, OTT)</option>
              <option value="Streaming">Streaming Video (Netflix, Prime)</option>
              <option value="Music">Music & Audio (Spotify, Apple Music)</option>
              <option value="Gaming">Gaming (Xbox, PlayStation Plus, Steam)</option>
              <option value="Software/SaaS">Software & Cloud Services</option>
              <option value="Productivity">Productivity Tools (Notion, ChatGPT)</option>
              <option value="Developer Tools">Developer Tech Tools (GitHub, Vercel)</option>
              <option value="Business/Work">Business & Work Logistics</option>
              <option value="Utilities">Utilities (Internet, Cloud Storage)</option>
              <option value="Household Bills">Household Subscriptions</option>
              <option value="News & Reading">News, Books & Magazines</option>
              <option value="Health & Fitness">Health & Fitness (Gym, Apps)</option>
              <option value="Education">Education & Courses</option>
              <option value="Insurance">Financial Insurance Plans</option>
              <option value="Other">Other Miscellaneous Expenses</option>
            </select>
          </div>

          {/* 4. FIXED DURATION SINGLE DROPDOWN MATRIX (Purchase Date Completely Skipped!) */}
          <div className="form-group">
            <label>Subscription Duration</label>
            <select
              className="duration-select-field"
              value={durationPackage}
              onChange={(e) => setDurationPackage(e.target.value)}
            >
              <option value="1 Day">1 Day</option>
              <option value="1 Week">1 Week</option>
              <option value="1 Month">1 Month</option>
        
              
              <option value="1 Year">1 Year</option>
              
            </select>
          </div>

          {/* Form Action Controls buttons */}
          <div className="form-actions-buttons">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Subscription
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddSubscription;
