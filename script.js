let map;
let directionsService;
let directionsRenderer;
let placesService;

function initMap() {
    // Initialize the map centered on Kigali
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -1.9441, lng: 30.0619 },
        zoom: 13
    });

    // Initialize directions and places services
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    placesService = new google.maps.places.PlacesService(map);

    // Initialize autocomplete for input fields
    initializeAutocomplete('start');
    initializeAutocomplete('end');
}

function initializeAutocomplete(inputId) {
    const input = document.getElementById(inputId);
    const autocomplete = new google.maps.places.Autocomplete(input, {
        componentRestrictions: { country: 'RW' },
        fields: ['place_id', 'geometry', 'name']
    });
}

function getDirections() {
    const startInput = document.getElementById('start');
    const endInput = document.getElementById('end');
    const errorDiv = document.getElementById('error');
    const loadingDiv = document.querySelector('.loading');

    if (!startInput.value || !endInput.value) {
        showError('Please enter both start and destination locations');
        return;
    }

    loadingDiv.classList.add('active');
    errorDiv.style.display = 'none';

    // Request directions with alternatives
    const request = {
        origin: startInput.value,
        destination: endInput.value,
        travelMode: 'DRIVING',
        provideRouteAlternatives: true
    };

    directionsService.route(request, (response, status) => {
        loadingDiv.classList.remove('active');

        if (status === 'OK') {
            directionsRenderer.setDirections(response);
            displayRouteOptions(response.routes);
        } else {
            showError('Could not calculate directions. Please try again.');
        }
    });
}

function displayRouteOptions(routes) {
    const routeInfo = document.getElementById('routeInfo');
    routeInfo.innerHTML = '<h2>Available Routes</h2>';

    routes.forEach((route, index) => {
        // Simulate traffic conditions (in a real app, this would come from traffic API)
        const trafficConditions = getSimulatedTrafficCondition();
        const duration = route.legs[0].duration.text;
        const distance = route.legs[0].distance.text;
        const isRecommended = index === 0;

        const routeElement = document.createElement('div');
        routeElement.className = 'route-option';
        routeElement.innerHTML = `
            <div class="route-header">
                <h3>
                    <span class="traffic-indicator ${trafficConditions.level}">
                        ${trafficConditions.icon}
                    </span>
                    Route ${index + 1}
                    ${isRecommended ? '<span class="recommended">Recommended</span>' : ''}
                </h3>
            </div>
            <div class="route-details">
                <p><strong>Estimated Time:</strong> ${duration}</p>
                <p><strong>Distance:</strong> ${distance}</p>
            </div>
            <div class="traffic-details ${trafficConditions.level}">
                <p><strong>Traffic Status:</strong> ${trafficConditions.description}</p>
                ${trafficConditions.warning ? `
                    <div class="warning">
                        ⚠️ ${trafficConditions.warning}
                    </div>
                ` : ''}
            </div>
        `;

        routeElement.addEventListener('click', () => {
            directionsRenderer.setRouteIndex(index);
            highlightSelectedRoute(index);
        });

        routeInfo.appendChild(routeElement);
    });
}

function getSimulatedTrafficCondition() {
    // Simulate different traffic conditions
    const conditions = [
        {
            level: 'light',
            icon: '🟢',
            description: 'Light traffic, smooth flow',
            warning: null
        },
        {
            level: 'moderate',
            icon: '🟡',
            description: 'Moderate traffic, some delays',
            warning: 'Expected delays of 5-10 minutes due to ongoing road work'
        },
        {
            level: 'heavy',
            icon: '🔴',
            description: 'Heavy traffic, significant delays',
            warning: 'Major congestion reported. Consider alternative routes'
        }
    ];

    return conditions[Math.floor(Math.random() * conditions.length)];
}

function highlightSelectedRoute(selectedIndex) {
    const routes = document.querySelectorAll('.route-option');
    routes.forEach((route, index) => {
        route.style.backgroundColor = index === selectedIndex ? '#e3f2fd' : '#f8f9fa';
    });
}

function displayRouteOptions(routes) {
    const routeInfo = document.getElementById('routeInfo');
    routeInfo.innerHTML = '<h2>Available Routes</h2>';

    routes.forEach((route, index) => {
        const trafficConditions = getSimulatedTrafficCondition();
        const duration = route.legs[0].duration.text;
        const distance = route.legs[0].distance.text;
        const isRecommended = index === 0;

        // Extract road numbers from the route
        const roadNumbers = extractRoadNumbers(route);
        const roadNumbersDisplay = roadNumbers.length > 0 
            ? `<p><strong>Roads:</strong> ${roadNumbers.join(' → ')}</p>`
            : '<p><strong>Roads:</strong> Local roads</p>';

        const routeElement = document.createElement('div');
        routeElement.className = 'route-option';
        routeElement.innerHTML = `
            <div class="route-header">
                <h3>
                    <span class="traffic-indicator ${trafficConditions.level}">
                        ${trafficConditions.icon}
                    </span>
                    Route ${index + 1}
                    ${isRecommended ? '<span class="recommended">Recommended</span>' : ''}
                </h3>
            </div>
            <div class="route-details">
                <p><strong>Estimated Time:</strong> ${duration}</p>
                <p><strong>Distance:</strong> ${distance}</p>
                ${roadNumbersDisplay}
            </div>
            <div class="traffic-details ${trafficConditions.level}">
                <p><strong>Traffic Status:</strong> ${trafficConditions.description}</p>
                ${trafficConditions.warning ? `
                    <div class="warning">
                        ⚠️ ${trafficConditions.warning}
                    </div>
                ` : ''}
            </div>
        `;

        routeElement.addEventListener('click', () => {
            directionsRenderer.setRouteIndex(index);
            highlightSelectedRoute(index);
        });

        routeInfo.appendChild(routeElement);
    });
}

function extractRoadNumbers(route) {
    const roadNumbers = [];
    
    // Check if route has steps
    if (route.legs && route.legs[0] && route.legs[0].steps) {
        route.legs[0].steps.forEach(step => {
            // Extract road numbers from instructions
            // Look for common Rwanda road number formats (KK, RN, etc.)
            const matches = step.instructions.match(/\b(KK|RN)\s*\d+\b/g);
            if (matches) {
                matches.forEach(roadNumber => {
                    if (!roadNumbers.includes(roadNumber)) {
                        roadNumbers.push(roadNumber);
                    }
                });
            }
        });
    }
    
    return roadNumbers;
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Issues Management Functions
function toggleIssuesView() {
    const issuesContainer = document.getElementById('issues-container');
    const viewBtn = document.getElementById('view-issues-btn');
    
    if (issuesContainer.style.display === 'none') {
        issuesContainer.style.display = 'block';
        viewBtn.innerHTML = '<span style="font-size: 1.2em;">👁️</span> Hide Issues';
        loadIssues();
    } else {
        issuesContainer.style.display = 'none';
        viewBtn.innerHTML = '<span style="font-size: 1.2em;">📋</span> See Reported Issues';
    }
}

function loadIssues() {
    const issuesList = document.getElementById('issues-list');
    const issues = JSON.parse(localStorage.getItem('trafficIssues') || '[]');
    
    if (issues.length === 0) {
        issuesList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 3em; margin-bottom: 20px;">📭</div>
                <h3>No Issues Reported Yet</h3>
                <p>Be the first to report a traffic issue!</p>
                <a href="issue-report.html" style="
                    display: inline-block;
                    background-color: #2196F3;
                    color: white;
                    text-decoration: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    margin-top: 15px;
                ">Report an Issue</a>
            </div>
        `;
        return;
    }
    
    // Sort issues by timestamp (newest first)
    issues.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    issuesList.innerHTML = '';
    
    issues.forEach(issue => {
        const issueElement = createIssueElement(issue);
        issuesList.appendChild(issueElement);
    });
}

function createIssueElement(issue) {
    const issueDiv = document.createElement('div');
    issueDiv.className = 'issue-item';
    issueDiv.style.cssText = `
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 15px;
        background: white;
        transition: box-shadow 0.3s ease;
    `;
    
    issueDiv.addEventListener('mouseenter', () => {
        issueDiv.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    });
    
    issueDiv.addEventListener('mouseleave', () => {
        issueDiv.style.boxShadow = 'none';
    });
    
    const issueTypeIcon = getIssueTypeIcon(issue.type);
    const formattedDate = new Date(issue.timestamp).toLocaleString();
    
    let imageHtml = '';
    if (issue.image) {
        imageHtml = `
            <div style="margin-top: 15px;">
                <img src="${issue.image}" alt="Issue Image" style="
                    max-width: 100%;
                    max-height: 200px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                ">
            </div>
        `;
    }
    
    issueDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5em;">${issueTypeIcon}</span>
                <h3 style="margin: 0; color: #333; text-transform: capitalize;">${issue.type.replace('-', ' ')}</h3>
            </div>
            <span style="
                background-color: ${issue.status === 'solved' ? '#e8f5e8' : '#fff3e0'};
                color: ${issue.status === 'solved' ? '#388e3c' : '#f57c00'};
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: bold;
                text-transform: uppercase;
            ">${issue.status}</span>
        </div>
        
        <p style="color: #666; margin-bottom: 15px; line-height: 1.5;">${issue.description}</p>
        
        <div style="
            background-color: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 10px;
        ">
            <strong>📍 Location:</strong> ${issue.location.address}
        </div>
        
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.9rem;
            color: #666;
        ">
            <span>👤 Reported by: ${issue.reporter}</span>
            <span>🕒 ${formattedDate}</span>
        </div>
        
        ${imageHtml}
    `;
    
    return issueDiv;
}

function getIssueTypeIcon(type) {
    const icons = {
        'traffic-jam': '🚗',
        'accident': '🚨',
        'road-closure': '🚧',
        'construction': '🏗️',
        'pothole': '🕳️',
        'flooding': '🌊',
        'broken-traffic-light': '🚦',
        'other': '⚠️'
    };
    return icons[type] || '⚠️';
}

// Initialize issues on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // Redirect to login if not authenticated
        window.location.href = 'auth.html';
        return;
    }
    
    // Update the report issue link to point to the correct page
    const reportLink = document.querySelector('a[href="report-issue.html"]');
    if (reportLink) {
        reportLink.href = 'issue-report.html';
    }
});