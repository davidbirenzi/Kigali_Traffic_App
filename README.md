# Kigali Traffic Navigation System

A modern web application to help users navigate Kigali with real-time traffic updates, community-reported issues, and route recommendations. Includes user authentication and an admin dashboard for managing reports.

## Features

-**Route Planning:** Get directions between locations in Kigali with simulated real-time traffic conditions.
-**Interactive Map:** Google Maps integration for route display and location selection.
-**Start Navigation:** Start navigating through the chosen route with full route information like  Distance Remaining, Time Remaining and Current Speed all in a full screen mode with the route on the map.
-**Community Issue Reporting:** Users can report traffic jams, accidents, road closures, and more.
-**View & Filter Issues:** See all reported issues, filter by type/status, and view details.
-**Authentication:** Secure login and signup for users and admin.
-**Admin Dashboard:** Manage, filter, and update the status of reported issues.



## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Kigali_Traffic_App.git
cd Kigali_Traffic_App
```

### 2. Google Maps API Key
This app uses Google Maps JavaScript API. You need to provide your own API key:

- Open `index.html` and `issue-report.html`.
- Replace the value of `key=YOUR_API_KEY` in the `<script src="https://maps.googleapis.com/maps/api/js?...">` tag with your actual Google Maps API key.

Example:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap" async defer></script>
```

### 3. Run the App
This is a static frontend app. You can open `index.html` directly in your browser, or use a local server for best results:

#### Using VSCode Live Server Extension
- Right-click `index.html` and select **Open with Live Server**.


## Folder Structure
```
Kigali_Traffic_App/
├── index.html           # Main app page (map, directions, issues)
├── script.js            # Main JS logic for map, routes, issues
├── admin.html           # Admin dashboard
├── admin.js             # Admin dashboard logic
├── admin.css            # Admin dashboard styles
├── auth.html            # Login/Signup page
├── auth.js              # Auth logic
├── auth.css             # Auth styles
├── issue-report.html    # Issue reporting page
├── issue-report.js      # Issue reporting logic
├── issue-report.css     # Issue reporting styles
├── ...
```

## Usage
- **Sign Up / Log In:** Access the app via `auth.html`. Users can sign up or log in. Admin uses `admin@kigali.com` / `admin123`.

- **Get Directions:** Enter start and end locations, click **Get Directions**.
- **Report Issue:** Click **Report an Issue** to submit a new traffic problem.
- **View Issues:** Click **See Reported Issues** to view and filter community reports.
- **Admin:** Log in as admin to access the dashboard and manage issues.

## Customization
- **Change Map Center:** Edit the coordinates in `initMap()` in `script.js` and `issue-report.js`.
- **Add Issue Types:** Update the `<select>` in `issue-report.html` and related logic in JS files.

## Credits
- Developed by David Birenzi
- UI inspired by modern navigation and reporting apps
- Powered by [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview)


God Bless You!

## **Diagnosis**

### **What’s Happening?**
- When you submit an issue on `issue-report.html` and then return to `index.html`, the map sometimes does not appear.
- The map on `index.html` is initialized by the `initMap` function, which is set as the callback in the Google Maps script tag.
- Both `index.html` and `issue-report.html` load the Google Maps API script, but with different parameters:
  - `index.html` uses:  
    `<script src="https://maps.googleapis.com/maps/api/js?key=...&libraries=places&callback=initMap" async defer></script>`
  - `issue-report.html` uses:  
    `<script src="https://maps.googleapis.com/maps/api/js?key=...&libraries=places"></script>`

### **Why Does the Map Disappear?**
- **Netlify and Single Page App (SPA) Navigation:**  
  If you use Netlify’s default SPA redirect or browser navigation (back/forward), the Google Maps API script may not reload or the callback may not fire as expected, especially if the script is already present in the browser cache.
- **Callback Not Triggered:**  
  If you return to `index.html` via browser navigation (not a full reload), the `initMap` callback may not be called, so the map is not initialized.
- **Session/Storage:**  
  There is no evidence that submitting an issue or storage logic is breaking the map. The authentication logic is robust and does not clear the session on issue submission.

## **How to Fix**

### **Best Practice**
- **Always use the `callback=initMap` parameter** in the Google Maps script tag on every page that loads the map.
- **Remove duplicate script tags** or ensure the script is loaded only once per page load.
- **Force a full reload** when navigating back to the home page after submitting an issue.

### **Recommended Fixes**

#### **1. Update `issue-report.html` to use the callback**
Change:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```
To:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap" async defer></script>
```
This ensures the map always initializes correctly.

#### **2. Force a Full Reload When Returning Home**
In `issue-report.html`, change the "Back to Home" link:
```html
<a href="index.html" class="back-btn">← Back to Home</a>
```
to:
```html
<a href="index.html" class="back-btn" onclick="window.location.href='index.html';">← Back to Home</a>
```
Or, better, add this script at the bottom of `issue-report.html`:
```js
document.querySelector('.back-btn').addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = 'index.html';
});
```
This ensures a full reload, not just browser navigation.

#### **3. (Optional) Remove Duplicate Google Maps Script Loads**
If you ever use a SPA router or AJAX navigation, ensure you do not load the Google Maps script more than once.

---

## **Summary Table**

| Page              | Google Maps Script Tag (should be)                                      |
|-------------------|-------------------------------------------------------------------------|
| index.html        | `<script src="...&callback=initMap" async defer></script>`              |
| issue-report.html | `<script src="...&callback=initMap" async defer></script>`              |

---

## **Next Steps**
1. Update the Google Maps script tag in `issue-report.html` to include the `callback=initMap` and `async defer`.
2. Ensure navigation back to `index.html` triggers a full page reload.

Would you like me to make these changes for you?