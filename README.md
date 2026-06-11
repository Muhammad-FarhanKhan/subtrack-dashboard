# SubTrack - Subscription Tracking Dashboard

This is a personal financial management web application designed to track recurring software licenses, subscription packages, and monthly expenditures. This application has been successfully completed as a core project for App Fusion.

Developed by: Muhammad Farhan Khan  
Tech Stack: React 19, JavaScript (ES6+), Native CSS3, LocalStorage API, Vite Build Engine

---

## Core Functionality & Features

### 1. Financial Overview Cards
* Monthly Total: This card calculates the expenses for the current ongoing month. It is configured to automatically reset back to 0.00 when a new month begins according to the system calendar date.
* Yearly Total: This card tracks the simple accumulated sum of all added subscription prices over the running year. It auto-resets when the year changes.
* Delete-Proof History: When a user deletes any subscription from the bottom data table list, the values inside the Monthly and Yearly overview cards do not decrease. It locks the highest spent values in LocalStorage so that historical spending records remain accurate because the money was actually spent.

### 2. Category Analytics Chart
* Fully Custom Bar Graph: This graph is created entirely using pure React states and HTML/CSS styling grids without using any third-party chart libraries to keep the code lightweight and safe from UI crashes.
* Dynamic Relative Scaling: The script reads all entries and finds the highest spending amount among categories. It automatically sets that highest amount as the 100% height limit of the chart canvas, and scales down all other category pillars proportionally. This ensures that no bar ever breaks out of the screen layout.
* Duration Selection Tabs: Users can toggle between Daily, Weekly, Monthly, and Yearly Plan views to check exactly how much budget has been spent on different packages (like Streaming, Music, SaaS, etc.).

### 3. Centralized Notification Panel
* Real-time Polling: A background pooling system in App.jsx scans the browser localStorage every 300ms to immediately capture data modifications.
* Push Toast Messages: An animated popup banner slides down from the top right whenever a user successfully adds a new subscription or removes an item from the tracking table list.
* Expiry Alerts: If the computer system date crosses the expiration date of an active subscription plan, the badge automatically changes to a red "Expired" status and logs an unread caution notice inside the navbar bell dropdown container.
* Clear All Logs: The header dropdown is equipped with a clean button link to empty the notification list instantly with a local storage state reset handler.

### 4. Paginated Data Management Table
* 10-Row Pagination Slicing: If the active subscription list exceeds 10 records, the application splits the table view rows and unlocks standard Next and Previous navigation controls in the footer.
* Alphabetical Avatars: The code automatically takes the first character of the subscription name to generate text profiles icons (e.g., Netflix generates 'N', Spotify generates 'S').
* Space Cleared Structure: The HTML structure inside the table rows is tightly integrated without line gaps or empty text child nodes to prevent runtime hydration errors in newer React frameworks.

---

## Responsive Device Layout Matrix

The layout handles layout adjustments dynamically through pure CSS media queries without relying on extra UI framework libraries:
* Extra Large Display Monitors (1441px to 1920px+): Clamps the content canvas safely inside an organized max-width template of 1380px or 1600px centered smoothly on broad monitors screens.
* Tablets & iPads (769px to 1024px): Converts the layout into solid double column grids to optimize layout viewing room.
* Handheld Smart Mobile Phones (iPhones/Android < 768px): The navigation list folds cleanly into vertical responsive columns. The notification container panel automatically removes full-screen transparent modal covers and becomes a sleek 320px compact portion box opening directly beneath the bell icon to fit small mobile screen viewports perfectly.

---

## How to Install and Run Locally

1. Clone the project repository folder:
git clone https://github.com

2. Go inside the project directory:
cd subtrack-dashboard

3. Install all the necessary packages and packages:
npm install

4. Run the local development server:
npm run dev

5. Compile the project files optimized optimized optimized optimized code for deployment build:
npm run build

---

## Deployment Settings

This project is fully ready for global distribution serverless hosting on Vercel Node Frameworks. Configure the following parameter keys during continuous deployment import setup options:
* Framework Preset: Vite
* Root Directory: ./
* Build Command: vite build || tsc && vite build
* Output Directory: dist

---
Submitted to App Fusion. Prepared and developed independently with standard documentation standards by Muhammad Farhan Khan.
