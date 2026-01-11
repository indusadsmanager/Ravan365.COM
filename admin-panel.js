// Initialize data
let users = JSON.parse(localStorage.getItem('ravan365_users') || '[]');
let deposits = JSON.parse(localStorage.getItem('ravan365_deposits') || '[]');
let withdrawals = JSON.parse(localStorage.getItem('ravan365_withdrawals') || '[]');
let games = JSON.parse(localStorage.getItem('ravan365_games') || '[]');
let registrations = JSON.parse(localStorage.getItem('ravan365_pending_registrations') || '[]');

// Payment Settings
let paymentSettings = JSON.parse(localStorage.getItem('ravan365_payment_settings') || JSON.stringify({
    upi: {
        enabled: true,
        qrUrl: '',
        upiId: ''
    },
    bank: {
        enabled: true,
        holderName: '',
        accountNumber: '',
        ifsc: '',
        bankName: ''
    },
    usdt: {
        enabled: true,
        qrUrl: '',
        walletAddress: ''
    }
}));

// Platform Settings
let platformSettings = JSON.parse(localStorage.getItem('ravan365_platform_settings') || JSON.stringify({
    platformName: 'Ravan365',
    whatsappNumber: '1234567890',
    minDeposit: 100,
    maxWithdraw: 50000,
    withdrawalTime: 24
}));

// Initialize games if empty
if (games.length === 0) {
    games = [
        { id: 1, name: 'Lucky Slots', category: 'slots', provider: 'NetEnt', minBet: 10, maxBet: 5000, winRatio: 50, status: 'active' },
        { id: 2, name: 'Blackjack Pro', category: 'table', provider: 'Evolution', minBet: 50, maxBet: 10000, winRatio: 45, status: 'active' },
        { id: 3, name: 'Live Roulette', category: 'live', provider: 'Pragmatic', minBet: 20, maxBet: 15000, winRatio: 48, status: 'active' },
        { id: 4, name: 'Football Betting', category: 'sports', provider: 'Betradar', minBet: 100, maxBet: 50000, winRatio: 42, status: 'active' },
        { id: 5, name: 'Mega Fortune', category: 'slots', provider: 'Microgaming', minBet: 25, maxBet: 8000, winRatio: 55, status: 'active' },
        { id: 6, name: 'Poker Stars', category: 'table', provider: 'Playtech', minBet: 30, maxBet: 6000, winRatio: 47, status: 'active' }
    ];
    saveGames();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    loadRegistrations();
    loadUsers();
    loadDeposits();
    loadWithdrawals();
    loadGames();
    loadPaymentSettings();
    loadPlatformSettings();
    updateNotificationCount();
});

// Navigation
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    event.currentTarget.classList.add('active');

    // Refresh data when switching sections
    if (sectionId === 'dashboard') loadDashboard();
    if (sectionId === 'registrations') loadRegistrations();
    if (sectionId === 'users') loadUsers();
    if (sectionId === 'deposits') loadDeposits();
    if (sectionId === 'withdrawals') loadWithdrawals();
    if (sectionId === 'games') loadGames();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Dashboard
function loadDashboard() {
    document.getElementById('totalUsers').textContent = users.length;
    
    let totalBalance = 0;
    users.forEach(user => {
        totalBalance += user.balance || 0;
    });
    document.getElementById('totalBalance').textContent = '₹' + totalBalance.toLocaleString();

    const pendingDepositsCount = deposits.filter(d => d.status === 'pending').length;
    document.getElementById('pendingDeposits').textContent = pendingDepositsCount;

    const pendingWithdrawalsCount = withdrawals.filter(w => w.status === 'pending').length;
    document.getElementById('pendingWithdrawals').textContent = pendingWithdrawalsCount;

    // Load recent activity
    loadRecentActivity();
}

function loadRecentActivity() {
    const activityDiv = document.getElementById('recentActivity');
    const allActivity = [
        ...deposits.map(d => ({ ...d, type: 'deposit' })),
        ...withdrawals.map(w => ({ ...w, type: 'withdrawal' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    if (allActivity.length === 0) {
        activityDiv.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 40px;">No recent activity</p>';
        return;
    }

    let html = '<table class="data-table"><thead><tr><th>Type</th><th>User</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>';
    
    allActivity.forEach(activity => {
        const user = users.find(u => u.id === activity.userId);
        const typeClass = activity.type === 'deposit' ? 'badge-success' : 'badge-danger';
        const typeText = activity.type === 'deposit' ? 'Deposit' : 'Withdrawal';
        const statusClass = activity.status === 'completed' ? 'badge-success' : activity.status === 'pending' ? 'badge-warning' : 'badge-danger';
        
        html += `
            <tr>
                <td><span class="badge ${typeClass}">${typeText}</span></td>
                <td>${user ? user.username : 'Unknown'}</td>
                <td>₹${activity.amount.toLocaleString()}</td>
                <td><span class="status-badge ${activity.status}">${activity.status}</span></td>
                <td>${new Date(activity.createdAt).toLocaleString()}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    activityDiv.innerHTML = html;
}

// Registrations
function loadRegistrations() {
    const tbody = document.getElementById('registrationsTable');
    tbody.innerHTML = '';

    if (registrations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #94a3b8; padding: 40px;">No new registrations</td></tr>';
        return;
    }

    registrations.forEach(reg => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${reg.username}</strong></td>
            <td>${reg.email}</td>
            <td>${reg.phone}</td>
            <td>${new Date(reg.registeredAt).toLocaleString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn approve" onclick="approveRegistration(${reg.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="action-btn reject" onclick="rejectRegistration(${reg.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function approveRegistration(id) {
    const regIndex = registrations.findIndex(r => r.id === id);
    if (regIndex === -1) return;

    const reg = registrations[regIndex];
    
    // Add to users
    users.push({
        id: reg.id,
        username: reg.username,
        email: reg.email,
        phone: reg.phone,
        password: reg.password,
        balance: 0,
        status: 'active',
        createdAt: reg.createdAt,
        lastLogin: null
    });

    // Remove from registrations
    registrations.splice(regIndex, 1);

    saveUsers();
    saveRegistrations();
    loadRegistrations();
    loadDashboard();
    updateNotificationCount();

    showNotification(`User ${reg.username} approved successfully!`, 'success');
}

function rejectRegistration(id) {
    if (!confirm('Are you sure you want to reject this registration?')) return;

    const regIndex = registrations.findIndex(r => r.id === id);
    if (regIndex === -1) return;

    registrations.splice(regIndex, 1);
    saveRegistrations();
    loadRegistrations();
    updateNotificationCount();

    showNotification('Registration rejected', 'info');
}

function clearRegistrations() {
    if (!confirm('Are you sure you want to clear all registrations?')) return;
    registrations = [];
    saveRegistrations();
    loadRegistrations();
    updateNotificationCount();
    showNotification('All registrations cleared', 'success');
}

function filterRegistrations() {
    const searchTerm = document.getElementById('searchRegistrations').value.toLowerCase();
    const rows = document.querySelectorAll('#registrationsTable tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Users
function loadUsers() {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #94a3b8; padding: 40px;">No users found</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.username}</strong></td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>₹${(user.balance || 0).toLocaleString()}</td>
            <td><span class="status-badge ${user.status}">${user.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewUser(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn ${user.status === 'active' ? 'ban' : 'unban'}" onclick="toggleBanUser(${user.id})">
                        <i class="fas ${user.status === 'active' ? 'fa-ban' : 'fa-check'}"></i>
                        ${user.status === 'active' ? 'Ban' : 'Unban'}
                    </button>
                    <button class="action-btn edit" onclick="editUserBalance(${user.id})">
                        <i class="fas fa-wallet"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function viewUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const details = `
        Username: ${user.username}
        Email: ${user.email}
        Phone: ${user.phone}
        Balance: ₹${(user.balance || 0).toLocaleString()}
        Status: ${user.status}
        Created: ${new Date(user.createdAt).toLocaleString()}
    `;
    showNotification(details, 'info');
}

function toggleBanUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const action = user.status === 'active' ? 'ban' : 'unban';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    user.status = user.status === 'active' ? 'banned' : 'active';
    saveUsers();
    loadUsers();
    loadDashboard();

    showNotification(`User ${user.username} ${action}ned successfully!`, user.status === 'active' ? 'success' : 'warning');
}

function editUserBalance(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    const newBalance = prompt(`Enter new balance for ${user.username}:`, user.balance || 0);
    if (newBalance === null) return;

    const balance = parseFloat(newBalance);
    if (isNaN(balance) || balance < 0) {
        showNotification('Invalid balance amount', 'error');
        return;
    }

    user.balance = balance;
    saveUsers();
    loadUsers();
    loadDashboard();

    showNotification(`Balance updated for ${user.username}`, 'success');
}

function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const statusFilter = document.getElementById('userStatusFilter').value;
    const rows = document.querySelectorAll('#usersTable tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const statusMatch = statusFilter === 'all' || text.includes(statusFilter);
        const searchMatch = text.includes(searchTerm);
        row.style.display = statusMatch && searchMatch ? '' : 'none';
    });
}

// Deposits
function loadDeposits() {
    const tbody = document.getElementById('depositsTable');
    tbody.innerHTML = '';

    if (deposits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 40px;">No deposits found</td></tr>';
        return;
    }

    deposits.forEach(deposit => {
        const user = users.find(u => u.id === deposit.userId);
        let paymentDetails = '';

        if (deposit.method === 'upi') {
            paymentDetails = `UPI ID: ${deposit.paymentDetails.upiId || 'N/A'}`;
        } else if (deposit.method === 'bank') {
            paymentDetails = `Bank: ${deposit.paymentDetails.bankName || 'N/A'}`;
        } else if (deposit.method === 'usdt') {
            paymentDetails = `USDT Address: ${deposit.paymentDetails.walletAddress?.substring(0, 10) || 'N/A'}...`;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${deposit.id}</code></td>
            <td>${user ? user.username : 'Unknown'}</td>
            <td><span class="badge badge-info">${deposit.method.toUpperCase()}</span></td>
            <td style="color: #10b981; font-weight: 600;">₹${deposit.amount.toLocaleString()}</td>
            <td><small>${paymentDetails}</small></td>
            <td><span class="status-badge ${deposit.status}">${deposit.status}</span></td>
            <td>
                ${deposit.status === 'pending' ? `
                    <div class="action-buttons">
                        <button class="action-btn approve" onclick="approveDeposit('${deposit.id}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="action-btn reject" onclick="rejectDeposit('${deposit.id}')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                ` : '<span style="color: #94a3b8;">-</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function approveDeposit(id) {
    const deposit = deposits.find(d => d.id === id);
    if (!deposit) return;

    const user = users.find(u => u.id === deposit.userId);
    if (!user) {
        showNotification('User not found', 'error');
        return;
    }

    // Update deposit status
    deposit.status = 'completed';
    deposit.completedAt = new Date().toISOString();

    // Add to user balance
    user.balance = (user.balance || 0) + deposit.amount;

    saveDeposits();
    saveUsers();
    loadDeposits();
    loadDashboard();

    showNotification(`Deposit of ₹${deposit.amount.toLocaleString()} approved for ${user.username}`, 'success');
}

function rejectDeposit(id) {
    if (!confirm('Are you sure you want to reject this deposit?')) return;

    const deposit = deposits.find(d => d.id === id);
    if (!deposit) return;

    deposit.status = 'rejected';
    deposit.completedAt = new Date().toISOString();

    saveDeposits();
    loadDeposits();
    loadDashboard();

    showNotification(`Deposit rejected`, 'warning');
}

function filterDeposits() {
    const searchTerm = document.getElementById('searchDeposits').value.toLowerCase();
    const statusFilter = document.getElementById('depositStatusFilter').value;
    const rows = document.querySelectorAll('#depositsTable tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const statusMatch = statusFilter === 'all' || text.includes(statusFilter);
        const searchMatch = text.includes(searchTerm);
        row.style.display = statusMatch && searchMatch ? '' : 'none';
    });
}

// Withdrawals
function loadWithdrawals() {
    const tbody = document.getElementById('withdrawalsTable');
    tbody.innerHTML = '';

    if (withdrawals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 40px;">No withdrawals found</td></tr>';
        return;
    }

    withdrawals.forEach(withdrawal => {
        const user = users.find(u => u.id === withdrawal.userId);
        let paymentDetails = '';

        if (withdrawal.method === 'bank') {
            paymentDetails = `
                Account: ${withdrawal.paymentDetails.accountNumber || 'N/A'}<br>
                IFSC: ${withdrawal.paymentDetails.ifsc || 'N/A'}<br>
                Bank: ${withdrawal.paymentDetails.bankName || 'N/A'}
            `;
        } else if (withdrawal.method === 'usdt') {
            paymentDetails = `USDT Address: ${withdrawal.paymentDetails.walletAddress || 'N/A'}`;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><code>${withdrawal.id}</code></td>
            <td>${user ? user.username : 'Unknown'}</td>
            <td><span class="badge badge-danger">${withdrawal.method.toUpperCase()}</span></td>
            <td style="color: #ef4444; font-weight: 600;">₹${withdrawal.amount.toLocaleString()}</td>
            <td><small>${paymentDetails}</small></td>
            <td><span class="status-badge ${withdrawal.status}">${withdrawal.status}</span></td>
            <td>
                ${withdrawal.status === 'pending' ? `
                    <div class="action-buttons">
                        <button class="action-btn approve" onclick="approveWithdrawal('${withdrawal.id}')">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button class="action-btn reject" onclick="rejectWithdrawal('${withdrawal.id}')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                ` : '<span style="color: #94a3b8;">-</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function approveWithdrawal(id) {
    const withdrawal = withdrawals.find(w => w.id === id);
    if (!withdrawal) return;

    const user = users.find(u => u.id === withdrawal.userId);
    if (!user) {
        showNotification('User not found', 'error');
        return;
    }

    // Update withdrawal status
    withdrawal.status = 'completed';
    withdrawal.completedAt = new Date().toISOString();

    // Deduct from user balance
    user.balance = (user.balance || 0) - withdrawal.amount;

    saveWithdrawals();
    saveUsers();
    loadWithdrawals();
    loadDashboard();

    showNotification(`Withdrawal of ₹${withdrawal.amount.toLocaleString()} approved for ${user.username}`, 'success');
}

function rejectWithdrawal(id) {
    if (!confirm('Are you sure you want to reject this withdrawal?')) return;

    const withdrawal = withdrawals.find(w => w.id === id);
    if (!withdrawal) return;

    withdrawal.status = 'rejected';
    withdrawal.completedAt = new Date().toISOString();

    saveWithdrawals();
    loadWithdrawals();
    loadDashboard();

    showNotification(`Withdrawal rejected`, 'warning');
}

function filterWithdrawals() {
    const searchTerm = document.getElementById('searchWithdrawals').value.toLowerCase();
    const statusFilter = document.getElementById('withdrawalStatusFilter').value;
    const rows = document.querySelectorAll('#withdrawalsTable tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const statusMatch = statusFilter === 'all' || text.includes(statusFilter);
        const searchMatch = text.includes(searchTerm);
        row.style.display = statusMatch && searchMatch ? '' : 'none';
    });
}

// Games & Win Ratio
function loadGames() {
    const tbody = document.getElementById('gamesTable');
    tbody.innerHTML = '';

    games.forEach(game => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${game.name}</strong></td>
            <td><span class="badge badge-primary">${game.category}</span></td>
            <td>${game.provider}</td>
            <td>₹${game.minBet.toLocaleString()}</td>
            <td>₹${game.maxBet.toLocaleString()}</td>
            <td>
                <div class="win-ratio-container">
                    <div class="win-ratio-header">
                        <input type="range" min="0" max="100" value="${game.winRatio}" 
                               onchange="updateWinRatio(${game.id}, this.value)">
                        <span class="win-ratio-value" id="winRatio-${game.id}">${game.winRatio}%</span>
                    </div>
                </div>
            </td>
            <td><span class="status-badge ${game.status}">${game.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn ${game.status === 'active' ? 'delete' : 'approve'}" onclick="toggleGameStatus(${game.id})">
                        <i class="fas ${game.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateWinRatio(gameId, value) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    game.winRatio = parseInt(value);
    document.getElementById(`winRatio-${gameId}`).textContent = value + '%';
    saveGames();

    showNotification(`Win ratio updated for ${game.name}`, 'success');
}

function toggleGameStatus(gameId) {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    game.status = game.status === 'active' ? 'inactive' : 'active';
    saveGames();
    loadGames();

    showNotification(`Game ${game.name} ${game.status}`, 'info');
}

// Payment Settings
function loadPaymentSettings() {
    document.getElementById('upiEnabled').checked = paymentSettings.upi.enabled;
    document.getElementById('upiQrUrl').value = paymentSettings.upi.qrUrl || '';
    document.getElementById('upiId').value = paymentSettings.upi.upiId || '';

    document.getElementById('bankEnabled').checked = paymentSettings.bank.enabled;
    document.getElementById('bankHolderName').value = paymentSettings.bank.holderName || '';
    document.getElementById('bankAccountNumber').value = paymentSettings.bank.accountNumber || '';
    document.getElementById('bankIfsc').value = paymentSettings.bank.ifsc || '';
    document.getElementById('bankName').value = paymentSettings.bank.bankName || '';

    document.getElementById('usdtEnabled').checked = paymentSettings.usdt.enabled;
    document.getElementById('usdtQrUrl').value = paymentSettings.usdt.qrUrl || '';
    document.getElementById('usdtWalletAddress').value = paymentSettings.usdt.walletAddress || '';
}

function savePaymentSettings() {
    paymentSettings.upi = {
        enabled: document.getElementById('upiEnabled').checked,
        qrUrl: document.getElementById('upiQrUrl').value,
        upiId: document.getElementById('upiId').value
    };

    paymentSettings.bank = {
        enabled: document.getElementById('bankEnabled').checked,
        holderName: document.getElementById('bankHolderName').value,
        accountNumber: document.getElementById('bankAccountNumber').value,
        ifsc: document.getElementById('bankIfsc').value,
        bankName: document.getElementById('bankName').value
    };

    paymentSettings.usdt = {
        enabled: document.getElementById('usdtEnabled').checked,
        qrUrl: document.getElementById('usdtQrUrl').value,
        walletAddress: document.getElementById('usdtWalletAddress').value
    };

    localStorage.setItem('ravan365_payment_settings', JSON.stringify(paymentSettings));
    showNotification('Payment settings saved successfully!', 'success');
}

// Platform Settings
function loadPlatformSettings() {
    document.getElementById('platformName').value = platformSettings.platformName || 'Ravan365';
    document.getElementById('whatsappNumber').value = platformSettings.whatsappNumber || '1234567890';
    document.getElementById('minDeposit').value = platformSettings.minDeposit || 100;
    document.getElementById('maxWithdraw').value = platformSettings.maxWithdraw || 50000;
    document.getElementById('withdrawalTime').value = platformSettings.withdrawalTime || 24;
}

function saveSettings() {
    platformSettings.platformName = document.getElementById('platformName').value;
    platformSettings.whatsappNumber = document.getElementById('whatsappNumber').value;
    platformSettings.minDeposit = parseInt(document.getElementById('minDeposit').value);
    platformSettings.maxWithdraw = parseInt(document.getElementById('maxWithdraw').value);
    platformSettings.withdrawalTime = parseInt(document.getElementById('withdrawalTime').value);

    localStorage.setItem('ravan365_platform_settings', JSON.stringify(platformSettings));
    showNotification('Platform settings saved successfully!', 'success');
}

// Notification Count
function updateNotificationCount() {
    const count = registrations.length + deposits.filter(d => d.status === 'pending').length + withdrawals.filter(w => w.status === 'pending').length;
    document.getElementById('notificationCount').textContent = count;
}

// Save functions
function saveUsers() {
    localStorage.setItem('ravan365_users', JSON.stringify(users));
}

function saveDeposits() {
    localStorage.setItem('ravan365_deposits', JSON.stringify(deposits));
}

function saveWithdrawals() {
    localStorage.setItem('ravan365_withdrawals', JSON.stringify(withdrawals));
}

function saveGames() {
    localStorage.setItem('ravan365_games', JSON.stringify(games));
}

function saveRegistrations() {
    localStorage.setItem('ravan365_pending_registrations', JSON.stringify(registrations));
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = '';
    if (type === 'success') icon = '<i class="fas fa-check-circle" style="color: #10b981; font-size: 20px;"></i>';
    else if (type === 'error') icon = '<i class="fas fa-exclamation-circle" style="color: #ef4444; font-size: 20px;"></i>';
    else if (type === 'warning') icon = '<i class="fas fa-exclamation-triangle" style="color: #f59e0b; font-size: 20px;"></i>';
    else icon = '<i class="fas fa-info-circle" style="color: #00d9ff; font-size: 20px;"></i>';

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; padding: 16px 20px;">
            ${icon}
            <span style="font-size: 14px; font-weight: 500;">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize localStorage if empty
if (!localStorage.getItem('ravan365_users')) {
    localStorage.setItem('ravan365_users', '[]');
}
if (!localStorage.getItem('ravan365_deposits')) {
    localStorage.setItem('ravan365_deposits', '[]');
}
if (!localStorage.getItem('ravan365_withdrawals')) {
    localStorage.setItem('ravan365_withdrawals', '[]');
}
if (!localStorage.getItem('ravan365_pending_registrations')) {
    localStorage.setItem('ravan365_pending_registrations', '[]');
}
