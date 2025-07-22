// Global variables
let allIssues = [];
let filteredIssues = [];

// Custom popup function
function showPopup(title, message, type = 'info') {
    const popupOverlay = document.getElementById('popup-overlay');
    const popupIcon = document.getElementById('popup-icon');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupButton = document.getElementById('popup-button');

    // Set icon based on type
    popupIcon.className = 'popup-icon';
    if (type === 'success') {
        popupIcon.textContent = '✓';
        popupIcon.classList.add('success');
        popupButton.className = 'popup-button success';
    } else if (type === 'error') {
        popupIcon.textContent = '✕';
        popupIcon.classList.add('error');
        popupButton.className = 'popup-button error';
    } else if (type === 'warning') {
        popupIcon.textContent = '⚠';
        popupIcon.classList.add('warning');
        popupButton.className = 'popup-button';
    } else {
        popupIcon.textContent = 'ℹ';
        popupButton.className = 'popup-button';
    }

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    // Show popup
    popupOverlay.classList.add('show');

    // Handle button click
    const closePopup = () => {
        popupOverlay.classList.remove('show');
        popupButton.removeEventListener('click', closePopup);
    };

    popupButton.addEventListener('click', closePopup);

    // Close on overlay click
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
}

// Check admin authentication
function checkAdminAuth() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        showPopup('Access Denied', 'Please log in to access the admin dashboard.', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 2000);
        return false;
    }
    // Parse user and set admin name
    try {
        const user = JSON.parse(loggedInUser);
        if (user.role !== 'admin') {
            showPopup('Access Denied', 'You are not authorized to access the admin dashboard.', 'error');
            setTimeout(() => {
                window.location.href = 'auth.html';
            }, 2000);
            return false;
        }
        document.getElementById('admin-name').textContent = '👤 Admin';
    } catch (e) {
        document.getElementById('admin-name').textContent = '👤 Admin';
    }
    return true;
}

// Load all issues from localStorage
function loadIssues() {
    allIssues = JSON.parse(localStorage.getItem('trafficIssues') || '[]');
    
    // Sort by timestamp (newest first)
    allIssues.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    updateStatistics();
    filterIssues();
}

// Update statistics
function updateStatistics() {
    const totalIssues = allIssues.length;
    const pendingIssues = allIssues.filter(issue => issue.status === 'pending').length;
    const solvedIssues = allIssues.filter(issue => issue.status === 'solved').length;
    
    document.getElementById('total-issues').textContent = totalIssues;
    document.getElementById('pending-issues').textContent = pendingIssues;
    document.getElementById('solved-issues').textContent = solvedIssues;
}

// Filter issues based on selected criteria
function filterIssues() {
    const statusFilter = document.getElementById('status-filter').value;
    const typeFilter = document.getElementById('type-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    filteredIssues = allIssues.filter(issue => {
        // Status filter
        if (statusFilter !== 'all' && issue.status !== statusFilter) {
            return false;
        }
        
        // Type filter
        if (typeFilter !== 'all' && issue.type !== typeFilter) {
            return false;
        }
        
        // Search filter
        if (searchTerm) {
            const searchText = `${issue.type} ${issue.description} ${issue.location.address} ${issue.reporter}`.toLowerCase();
            if (!searchText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    displayIssues();
}

// Display filtered issues
function displayIssues() {
    const issuesList = document.getElementById('issues-list');
    
    if (filteredIssues.length === 0) {
        issuesList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 3em; margin-bottom: 20px;">📭</div>
                <h3>No Issues Found</h3>
                <p>No issues match your current filters.</p>
            </div>
        `;
        return;
    }
    
    issuesList.innerHTML = '';
    
    filteredIssues.forEach(issue => {
        const issueElement = createIssueElement(issue);
        issuesList.appendChild(issueElement);
    });
}

// Create issue element for admin view
function createIssueElement(issue) {
    const issueDiv = document.createElement('div');
    issueDiv.className = 'issue-item';
    
    const issueTypeIcon = getIssueTypeIcon(issue.type);
    const formattedDate = new Date(issue.timestamp).toLocaleString();
    
    let imageHtml = '';
    if (issue.image) {
        imageHtml = `
            <div class="issue-image">
                <img src="${issue.image}" alt="Issue Image">
            </div>
        `;
    }
    
    issueDiv.innerHTML = `
        <div class="issue-header">
            <div class="issue-title">
                <span class="issue-icon">${issueTypeIcon}</span>
                <span class="issue-type">${issue.type.replace('-', ' ')}</span>
            </div>
            <span class="status-badge ${issue.status}">${issue.status}</span>
        </div>
        
        <div class="issue-description">${issue.description}</div>
        
        <div class="issue-location">
            📍 ${issue.location.address}
        </div>
        
        <div class="issue-meta">
            <span>👤 Reported by: ${issue.reporter}</span>
            <span>🕒 ${formattedDate}</span>
        </div>
        
        ${imageHtml}
        
        <div class="status-update">
            <h4>Update Status:</h4>
            <div class="status-buttons">
                <button class="status-btn pending ${issue.status === 'pending' ? 'active' : ''}" 
                        onclick="updateIssueStatus('${issue.id}', 'pending')" 
                        ${issue.status === 'pending' ? 'disabled' : ''}>
                    Mark as Pending
                </button>
                <button class="status-btn solved ${issue.status === 'solved' ? 'active' : ''}" 
                        onclick="updateIssueStatus('${issue.id}', 'solved')" 
                        ${issue.status === 'solved' ? 'disabled' : ''}>
                    Mark as Solved
                </button>
                <button class="status-btn delete-btn" style="background:linear-gradient(90deg,#ff5252,#ff9800);color:white;margin-left:10px;" onclick="deleteIssue('${issue.id}')">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `;
    
    return issueDiv;
}

// Delete issue by id
function deleteIssue(issueId) {
    const idx = allIssues.findIndex(issue => issue.id === issueId);
    if (idx === -1) {
        showPopup('Error', 'Issue not found.', 'error');
        return;
    }
    // Confirm delete
    if (!confirm('Are you sure you want to delete this issue? This action cannot be undone.')) {
        return;
    }
    allIssues.splice(idx, 1);
    localStorage.setItem('trafficIssues', JSON.stringify(allIssues));
    updateStatistics();
    filterIssues();
    showPopup('Deleted', 'Issue has been deleted.', 'success');
}

// Get issue type icon
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

// Update issue status
function updateIssueStatus(issueId, newStatus) {
    // Find the issue in allIssues array
    const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
    
    if (issueIndex === -1) {
        showPopup('Error', 'Issue not found.', 'error');
        return;
    }
    
    // Update the status
    allIssues[issueIndex].status = newStatus;
    
    // Save back to localStorage
    localStorage.setItem('trafficIssues', JSON.stringify(allIssues));
    
    // Update statistics and display
    updateStatistics();
    filterIssues();
    
    // Show success message
    const statusText = newStatus === 'solved' ? 'solved' : 'pending';
    showPopup('Status Updated', `Issue has been marked as ${statusText}.`, 'success');
}

// Logout function
function logout() {
    sessionStorage.removeItem('loggedInUser');
    showPopup('Logged Out', 'You have been successfully logged out.', 'success');
    setTimeout(() => {
        window.location.href = 'auth.html';
    }, 1500);
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdminAuth()) {
        return;
    }
    
    // Load issues on page load
    loadIssues();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + R to refresh
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            loadIssues();
        }
        
        // Escape to close popup
        if (e.key === 'Escape') {
            const popupOverlay = document.getElementById('popup-overlay');
            if (popupOverlay.classList.contains('show')) {
                popupOverlay.classList.remove('show');
            }
        }
    });
}); 