// API Configuration
const API_BASE_URL = window.location.origin + '/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Utility Functions
function showError(message) {
    const errorDiv = document.getElementById('loginError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    // Create a temporary success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    document.querySelector('.content').prepend(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
}

function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

// API Functions
async function apiCall(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Errore nella richiesta');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication
async function login(email, password) {
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        authToken = data.token;
        currentUser = data.employee;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showApp();
        loadDashboard();
    } catch (error) {
        showError(error.message);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showLogin();
}

// Screen Management
function showLogin() {
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('appScreen').classList.remove('active');
}

function showApp() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('appScreen').classList.add('active');
    updateUserInfo();
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById('userName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        document.getElementById('userPoints').textContent = `${currentUser.points} pts`;
    }
}

// Page Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    document.getElementById(`${pageName}Page`).classList.add('active');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    // Load page data
    switch(pageName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'carbon':
            loadCarbonFootprint();
            break;
        case 'volunteering':
            loadVolunteering();
            break;
        case 'gamification':
            loadGamification();
            break;
        case 'leaderboard':
            loadLeaderboard();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

// Dashboard
async function loadDashboard() {
    try {
        const data = await apiCall('/dashboard/overview');
        const overview = data.overview;

        // Update stats
        document.getElementById('totalCO2').textContent = `${formatNumber(overview.stats.totalCO2Saved)} kg`;
        document.getElementById('totalHours').textContent = `${formatNumber(overview.stats.totalVolunteerHours)} ore`;
        document.getElementById('totalBadges').textContent = overview.stats.totalBadges;
        document.getElementById('userRank').textContent = `#${overview.employee.rank}`;

        // Update user info
        currentUser.points = overview.employee.points;
        currentUser.level = overview.employee.level;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInfo();

        // Recent activities
        const activitiesHtml = [];
        (overview.recentActivities?.carbon || []).slice(0, 3).forEach(entry => {
            activitiesHtml.push(`
                <div class="activity-item">
                    <h4>🚗 Spostamento - ${entry.transportMode}</h4>
                    <p>${entry.distance} km - ${formatNumber(entry.co2Saved)} kg CO2 risparmiata</p>
                    <div class="activity-meta">
                        <span>📅 ${formatDate(entry.date)}</span>
                        <span>⭐ +${entry.points} punti</span>
                    </div>
                </div>
            `);
        });
        (overview.recentActivities?.volunteer || []).slice(0, 2).forEach(activity => {
            activitiesHtml.push(`
                <div class="activity-item">
                    <h4>🤝 ${activity.activityName}</h4>
                    <p>${activity.hours} ore - ${activity.location}</p>
                    <div class="activity-meta">
                        <span>📅 ${formatDate(activity.date)}</span>
                        <span>⭐ +${activity.points} punti</span>
                    </div>
                </div>
            `);
        });

        document.getElementById('recentActivities').innerHTML = activitiesHtml.length > 0
            ? activitiesHtml.join('')
            : '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nessuna attività recente</p></div>';

        // Active challenges
        const challengesHtml = (overview.activeChallenges || []).map(challenge => `
            <div class="challenge-item">
                <h4>${challenge.title}</h4>
                <p>${challenge.description}</p>
                <div class="challenge-reward">🏆 ${challenge.reward} punti</div>
            </div>
        `).join('');

        document.getElementById('activeChallenges').innerHTML = challengesHtml || 
            '<div class="empty-state"><i class="fas fa-trophy"></i><p>Nessuna sfida attiva</p></div>';

    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Errore nel caricamento della dashboard');
    }
}

// Carbon Footprint
async function loadCarbonFootprint() {
    try {
        const [entriesData, statsData] = await Promise.all([
            apiCall('/carbon-footprint/entries'),
            apiCall('/carbon-footprint/stats')
        ]);

        const stats = statsData.stats;
        document.getElementById('carbonEmitted').textContent = `${formatNumber(stats.totalCO2Emitted)} kg`;
        document.getElementById('carbonSaved').textContent = `${formatNumber(stats.totalCO2Saved)} kg`;
        document.getElementById('carbonDistance').textContent = `${formatNumber(stats.totalDistance)} km`;
        document.getElementById('carbonSustainable').textContent = `${stats.sustainablePercentage}%`;

        const entriesHtml = entriesData.entries.map(entry => `
            <div class="entry-item">
                <h4>${getTransportIcon(entry.transportMode)} ${entry.transportMode}</h4>
                <p>${entry.distance} km - ${formatNumber(entry.co2Emitted)} kg CO2 emessa</p>
                <div class="activity-meta">
                    <span>📅 ${formatDate(entry.date)}</span>
                    <span>💚 ${formatNumber(entry.co2Saved)} kg risparmiata</span>
                    <span>⭐ +${entry.points} punti</span>
                </div>
            </div>
        `).join('');

        document.getElementById('carbonEntries').innerHTML = entriesHtml ||
            '<div class="empty-state"><i class="fas fa-leaf"></i><p>Nessuno spostamento registrato</p></div>';

    } catch (error) {
        console.error('Error loading carbon footprint:', error);
        showError('Errore nel caricamento dei dati');
    }
}

function getTransportIcon(mode) {
    const icons = {
        car: '🚗',
        motorcycle: '🏍️',
        bus: '🚌',
        train: '🚆',
        bike: '🚴',
        walk: '🚶',
        electric_car: '⚡',
        carpool: '👥'
    };
    return icons[mode] || '🚗';
}

async function addCarbonEntry(formData) {
    try {
        const data = await apiCall('/carbon-footprint/entries', {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        showSuccess(`Spostamento registrato! +${data.pointsEarned} punti`);
        closeModal('carbonModal');
        loadCarbonFootprint();
        
        // Check for new badges
        checkBadges();
    } catch (error) {
        showError(error.message);
    }
}

// Volunteering
async function loadVolunteering() {
    try {
        const [activitiesData, statsData] = await Promise.all([
            apiCall('/volunteering/activities'),
            apiCall('/volunteering/stats')
        ]);

        const stats = statsData.stats;
        document.getElementById('volunteerHours').textContent = formatNumber(stats.totalHours);
        document.getElementById('volunteerActivities').textContent = stats.totalActivities;
        document.getElementById('volunteerVerified').textContent = stats.verifiedActivities;

        const activitiesHtml = activitiesData.activities.map(activity => `
            <div class="entry-item">
                <h4>${getActivityIcon(activity.activityType)} ${activity.activityName}</h4>
                <p>${activity.description}</p>
                <div class="activity-meta">
                    <span>📅 ${formatDate(activity.date)}</span>
                    <span>⏱️ ${activity.hours} ore</span>
                    <span>📍 ${activity.location}</span>
                    <span>⭐ +${activity.points} punti</span>
                    ${activity.verified ? '<span>✅ Verificata</span>' : '<span>⏳ In attesa</span>'}
                </div>
            </div>
        `).join('');

        document.getElementById('volunteerEntries').innerHTML = activitiesHtml ||
            '<div class="empty-state"><i class="fas fa-hands-helping"></i><p>Nessuna attività registrata</p></div>';

    } catch (error) {
        console.error('Error loading volunteering:', error);
        showError('Errore nel caricamento dei dati');
    }
}

function getActivityIcon(type) {
    const icons = {
        street_cleaning: '🧹',
        green_planting: '🌳',
        urban_decor: '🏛️',
        park_maintenance: '🌲',
        graffiti_removal: '🎨',
        community_garden: '🥕',
        other: '📋'
    };
    return icons[type] || '📋';
}

async function addVolunteerActivity(formData) {
    try {
        const data = await apiCall('/volunteering/activities', {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        showSuccess(`Attività registrata! +${data.pointsEarned} punti`);
        closeModal('volunteerModal');
        loadVolunteering();
        
        // Check for new badges
        checkBadges();
    } catch (error) {
        showError(error.message);
    }
}

// Gamification
async function loadGamification() {
    try {
        const [badgesData, challengesData] = await Promise.all([
            apiCall('/gamification/badges'),
            apiCall('/gamification/challenges')
        ]);

        // Badges
        const badgesHtml = badgesData.badges.map(badge => `
            <div class="badge-item ${badge.earned ? 'earned' : 'locked'}">
                <div class="badge-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-description">${badge.description}</div>
                ${badge.earned ? `<small>Ottenuto il ${formatDate(badge.earnedAt)}</small>` : ''}
            </div>
        `).join('');

        document.getElementById('badgesList').innerHTML = badgesHtml;

        // Challenges
        const challengesHtml = challengesData.challenges.map(challenge => {
            const progress = challenge.progress || 0;
            const goal = challenge.goal.value;
            const percentage = Math.min((progress / goal) * 100, 100);

            return `
                <div class="challenge-item">
                    <h4>${challenge.title}</h4>
                    <p>${challenge.description}</p>
                    <div class="challenge-progress">
                        <div class="challenge-progress-bar" style="width: ${percentage}%"></div>
                    </div>
                    <p>${progress} / ${goal}</p>
                    <div class="challenge-reward">🏆 ${challenge.reward} punti</div>
                    ${!challenge.isParticipating ? 
                        `<button class="btn btn-primary" onclick="joinChallenge('${challenge.id}')">Partecipa</button>` :
                        challenge.completed ? '<span>✅ Completata!</span>' : '<span>🔄 In corso</span>'
                    }
                </div>
            `;
        }).join('');

        document.getElementById('challengesList').innerHTML = challengesHtml ||
            '<div class="empty-state"><i class="fas fa-trophy"></i><p>Nessuna sfida disponibile</p></div>';

    } catch (error) {
        console.error('Error loading gamification:', error);
        showError('Errore nel caricamento dei dati');
    }
}

async function joinChallenge(challengeId) {
    try {
        await apiCall(`/gamification/challenges/${challengeId}/join`, {
            method: 'POST'
        });
        showSuccess('Ti sei iscritto alla sfida!');
        loadGamification();
    } catch (error) {
        showError(error.message);
    }
}

async function checkBadges() {
    try {
        const data = await apiCall('/gamification/check-badges', {
            method: 'POST'
        });

        if (data.badges.length > 0) {
            showSuccess(data.message);
            // Reload current page to update stats
            const activePage = document.querySelector('.nav-item.active').dataset.page;
            showPage(activePage);
        }
    } catch (error) {
        console.error('Error checking badges:', error);
    }
}

// Leaderboard
let currentLeaderboardType = 'points';

async function loadLeaderboard(type = 'points') {
    currentLeaderboardType = type;
    
    try {
        const data = await apiCall(`/gamification/leaderboard?type=${type}`);

        const leaderboardHtml = data.leaderboard.map(item => `
            <div class="leaderboard-item ${item.isCurrentUser ? 'current-user' : ''}">
                <div class="leaderboard-rank ${item.rank <= 3 ? 'top-3' : ''}">#${item.rank}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${item.name}</div>
                    <div class="leaderboard-department">${item.department}</div>
                </div>
                <div class="leaderboard-score">
                    ${type === 'points' ? `${item.points} pts` :
                      type === 'co2' ? `${formatNumber(item.totalCO2Saved)} kg` :
                      `${formatNumber(item.totalVolunteerHours)} ore`}
                </div>
            </div>
        `).join('');

        document.getElementById('leaderboardList').innerHTML = leaderboardHtml;

    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showError('Errore nel caricamento della classifica');
    }
}

// Profile
async function loadProfile() {
    try {
        const [profileData, statsData] = await Promise.all([
            apiCall('/employees/profile'),
            apiCall('/employees/stats')
        ]);

        const employee = profileData.employee;
        const stats = statsData.stats;

        document.getElementById('profileInfo').innerHTML = `
            <div class="profile-field">
                <span class="profile-label">Nome</span>
                <span class="profile-value">${employee.firstName} ${employee.lastName}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Email</span>
                <span class="profile-value">${employee.email}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Dipartimento</span>
                <span class="profile-value">${employee.department}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Data Assunzione</span>
                <span class="profile-value">${formatDate(employee.joinDate)}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Ruolo</span>
                <span class="profile-value">${employee.role === 'admin' ? 'Amministratore' : 'Dipendente'}</span>
            </div>
        `;

        document.getElementById('profileStats').innerHTML = `
            <div class="profile-field">
                <span class="profile-label">Livello</span>
                <span class="profile-value">⭐ ${stats.level}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Punti Totali</span>
                <span class="profile-value">${stats.points}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">CO2 Risparmiata</span>
                <span class="profile-value">${formatNumber(stats.totalCO2Saved)} kg</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Ore Volontariato</span>
                <span class="profile-value">${formatNumber(stats.totalVolunteerHours)} ore</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Spostamenti Registrati</span>
                <span class="profile-value">${stats.carbonEntriesCount}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Attività Volontariato</span>
                <span class="profile-value">${stats.volunteerActivitiesCount}</span>
            </div>
            <div class="profile-field">
                <span class="profile-label">Badge Guadagnati</span>
                <span class="profile-value">${stats.badgesEarned}</span>
            </div>
        `;

    } catch (error) {
        console.error('Error loading profile:', error);
        showError('Errore nel caricamento del profilo');
    }
}

// Modal Management
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    // Reset form
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
}

// Auto-login for development
async function autoLoginDevelopment() {
    try {
        const data = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'admin@rm-architettura.it' })
        });

        authToken = data.token;
        currentUser = data.employee;
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showApp();
        loadDashboard();
    } catch (error) {
        console.error('Auto-login error:', error);
        // Even if login fails, show app
        showApp();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Always show app immediately
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'block';
    
    // Then do auto-login in background
    if (!authToken) {
        autoLoginDevelopment();
    } else {
        loadDashboard();
    }

    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            showPage(page);
        });
    });

    // Carbon footprint modal
    document.getElementById('addCarbonBtn').addEventListener('click', () => {
        document.getElementById('carbonDate').valueAsDate = new Date();
        openModal('carbonModal');
    });

    document.getElementById('carbonForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            date: document.getElementById('carbonDate').value,
            transportMode: document.getElementById('transportMode').value,
            distance: parseFloat(document.getElementById('distance').value),
            isCommute: document.getElementById('isCommute').checked,
            notes: document.getElementById('carbonNotes').value
        };
        addCarbonEntry(formData);
    });

    // Volunteering modal
    document.getElementById('addVolunteerBtn').addEventListener('click', () => {
        document.getElementById('volunteerDate').valueAsDate = new Date();
        openModal('volunteerModal');
    });

    document.getElementById('volunteerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            date: document.getElementById('volunteerDate').value,
            activityType: document.getElementById('activityType').value,
            hours: parseFloat(document.getElementById('volunteerHours').value),
            location: document.getElementById('volunteerLocation').value,
            description: document.getElementById('volunteerDescription').value
        };
        addVolunteerActivity(formData);
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Leaderboard filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            loadLeaderboard(btn.dataset.type);
        });
    });
});

// Make functions globally available
window.joinChallenge = joinChallenge;

// Made with Bob
