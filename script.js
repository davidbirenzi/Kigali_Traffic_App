let map;
let directionsService;
let directionsRenderer;
let placesService;
const googleMapsAPI = require('google-maps-api');

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

const apiKey = process.env.API_KEY;
const googleMapsClient = googleMapsAPI.createClient({
  key: apiKey,
  Promise: Promise,
});

googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA',
})
.then((response) => {
  console.log(response.json.results);
})
.catch((err) => {
  console.error(err);
});

app.get('/api/maps', (req, res) => {
  googleMapsClient.geocode({
    address: '1600 Amphitheatre Parkway, Mountain View, CA',
  })
  .then((response) => {
    res.json(response.json.results);
  })
  .catch((err) => {
    res.status(500).json({ error: 'Failed to geocode address' });
  });
});

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
