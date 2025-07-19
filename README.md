# Traffic App System 🚦

The **Traffic App System** is a web application designed to monitor and analyze traffic congestion in Kigali. It provides real-time updates, traffic patterns, and route suggestions to help users save time and improve their travel experience. Built using modern technologies, this app leverages APIs like **Google Maps API** or **OpenStreetMap** to deliver accurate and reliable traffic data.

---

## Table of Contents 📖
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Deployment and Load Balancer Configuration](#deployment-and-load-balancer-configuration)
- [Usage](#usage)
- [APIs and Documentation](#apis-and-documentation)
- [Challenges and Solutions](#challenges-and-solutions)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [Credits and Acknowledgments](#credits-and-acknowledgments)

---

## Features 🛠️
- **Real-Time Traffic Updates**: Displays the latest traffic conditions in Kigali.
- **Route Optimization**: Suggests the best routes to avoid congestion.
- **Traffic Heatmap**: Visualizes traffic density on a map.
- **Custom Alerts**: Notify users about road closures, accidents, or heavy traffic zones.
- **User-Friendly Interface**: Intuitive and easy-to-use design.

---

## Technologies Used 💻
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js (Express)
- **APIs**: Google Maps API
- **Hosting**: load balancer

---

## Installation ⚙️

### Running Locally
1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/Kigali_Traffic_App.git
    ```
2. **Navigate to the Project Directory**:
    ```bash
    cd Kigali_Traffic_App
    ```
3. **Install Dependencies**:
    ```bash
    npm install
    ```
4. **Set Up API Keys**:
   - Obtain an API key from [Google Maps API](https://developers.google.com/maps/documentation)
   - Create a `.env` file in the root directory and add the following:
     ```env
     GOOGLE_MAPS_API_KEY=your-api-key
     ```
5. **Start the Application**:
    ```bash
    npm start
    ```

---

## Deployment and Load Balancer Configuration 🌐

### Deployment Steps
1. **Set Up Servers**:
   - Provision multiple servers
   - Install Node.js and required dependencies on each server.

2. **Configure the Application**:
   - Clone the repository on each server.
   - Install dependencies with:
     ```bash
     npm install
     ```
   - Start the application using:
     ```bash
     npm run start
     ```

3. **Load Balancer Setup**:
   - Usec Load Balancer to distribute traffic across multiple servers.
   - Configure health checks to ensure server availability.
   - Add server IPs or DNS records to the load balancer’s target group.

4. **Enable HTTPS**:
   - Secure communication using SSL/TLS certificates from **Let's Encrypt**.

---

## Usage 🚗

1. Open the app in your browser at `http://www.davidbirenzi.tech`.
2. Allow location permissions for accurate traffic updates.
3. View real-time traffic conditions and choose optimized routes.

---

## APIs and Documentation 🌐

This project uses the following APIs:
1. **Google Maps API**:
   - Documentation: [Google Maps API Documentation](https://developers.google.com/maps/documentation)
   - Features used: Traffic data, route optimization, and map rendering.

## Challenges and Solutions ⚡

### Challenges Faced
1. **Integrating Traffic Data APIs**:
   - Problem: Understanding how to fetch and use live traffic data.
   - Solution: Carefully studied the Google Maps API documentation and tested API calls using Postman.

2. **Configuring the Load Balancer**:
   - Problem: Servers were not equally distributing traffic.
   - Solution: Used health checks and configured target groups correctly to ensure all servers were operational.

3. **Scaling the Application**:
   - Problem: Managing increased traffic without downtime.
   - Solution: Enabled auto-scaling on AWS EC2 to dynamically add or remove servers based on load.

4. **HTTPS Setup**:
   - Problem: Handling SSL/TLS certificate setup for secure communication.
   - Solution: Used AWS Certificate Manager for automatic certificate management.

---

## Future Enhancements 🚀
- **Public Transport Integration**: Add bus routes and schedules.
- **Traffic Prediction**: Use AI to forecast traffic patterns.
- **Offline Mode**: Allow route viewing without an active internet connection.
- **Multilingual Support**: Include translations for Kinyarwanda, English, and French.

---

## Contributing 🤝

Contributions are welcome! 
*Credits and Acknowledgments* 🙌
Google Maps API Developers: For providing comprehensive and reliable traffic data.
OpenStreetMap Contributors: For offering a robust and free mapping solution.
AWS Documentation: For guidance on deploying and scaling the application.
Libraries Used:
Axios for API requests
dotenv for environment variable management
