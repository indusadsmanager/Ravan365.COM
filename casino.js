// Initialize data
let currentUser = null;
let currentBalance = 0;
let games = [];
let paymentSettings = {};

// Platform Settings
let platformSettings = JSON.parse(localStorage.getItem('ravan365_platform_settings') || JSON.stringify({
    platformName: 'Ravan365',
    whatsappNumber: '1234567890',
    minDeposit: 100,
    maxWithdraw: 50000,
    withdrawalTime: 24
}));

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadGames();
    loadPaymentSettings();
    loadDepositPaymentMethods();
    loadWithdrawPaymentMethods();
    updateBalanceDisplay();
    loadAllGames('all');
});

// Load User Data
function loadUserData() {
    const userId = sessionStorage.getItem('userId');
    const users = JSON.parse(localStorage.getItem('ravan365_users') || '[]');
    
    currentUser = users.find(u => u.id === parseInt(userId));
    
    if (currentUser) {
        currentBalance = currentUser.balance || 0;
        
        // Update profile information
        document.getElementById('profileUsername').textContent = currentUser.username;
        document.getElementById('profileEmail').textContent = currentUser.email;
        document.getElementById('profileStatus').textContent = currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1);
        document.getElementById('profileStatus').style.color = currentUser.status === 'active' ? '#10b981' : '#ef4444';
    }
}

// Load Games from Admin Settings
function loadGames() {
    games = JSON.parse(localStorage.getItem('ravan365_games') || '[]');
}

// Load Payment Settings
function loadPaymentSettings() {
    paymentSettings = JSON.parse(localStorage.getItem('ravan365_payment_settings') || JSON.stringify({
        upi: { enabled: true, qrUrl: '', upiId: '' },
        bank: { enabled: true, holderName: '', accountNumber: '', ifsc: '', bankName: '' },
        usdt: { enabled: true, qrUrl: '', walletAddress: '' }
    }));
}

// Load All Games
function loadAllGames(category) {
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';

    const filteredGames = category === 'all' 
        ? games 
        : games.filter(game => game.category === category && game.status === 'active');

    if (filteredGames.length === 0) {
        gamesGrid.innerHTML = '<p style="color: #94a3b8; text-align: center; grid-column: 1/-1; padding: 40px;">No games available</p>';
        return;
    }

    filteredGames.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-image">
                <i class="fas fa-gamepad"></i>
                <button class="game-play-btn" onclick="playGame(${game.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.name}</h3>
                <p class="game-provider">${game.provider}</p>
                <div class="game-stats">
                    <div class="game-stat">
                        <div class="game-stat-value">${game.winRatio}%</div>
                        <div class="game-stat-label">Win Ratio</div>
                    </div>
                    <div class="game-stat">
                        <div class="game-stat-value">₹${game.minBet}</div>
                        <div class="game-stat-label">Min Bet</div>
                    </div>
                    <div class="game-stat">
                        <div class="game-stat-value">₹${game.maxBet}</div>
                        <div class="game-stat-label">Max Bet</div>
                    </div>
                </div>
            </div>
        `;
        gamesGrid.appendChild(gameCard);
    });
}

// Filter Games
function filterGames(category) {
    // Update active tab
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Load games
    loadAllGames(category);
}

// Play Game
function playGame(gameId) {
    const game = games.find(g => g.id === gameId);
    showNotification(`Loading ${game.name}...`, 'info');
    
    setTimeout(() => {
        showNotification(`${game.name} is ready to play! (API Integration)`, 'success');
    }, 1500);
}

// Load Deposit Payment Methods
function loadDepositPaymentMethods() {
    const container = document.getElementById('depositPaymentMethods');
    container.innerHTML = '';

    if (paymentSettings.upi.enabled) {
        const card = document.createElement('div');
        card.className = 'payment-method-card';
        card.onclick = () => selectDepositMethod('upi', card);
        card.innerHTML = `
            <div class="payment-header">
                <div class="payment-icon"><i class="fas fa-qrcode"></i></div>
                <div class="payment-info">
                    <h3>UPI Payment</h3>
                    <p>Instant transfer via UPI QR or ID</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    }

    if (paymentSettings.bank.enabled) {
        const card = document.createElement('div');
        card.className = 'payment-method-card';
        card.onclick = () => selectDepositMethod('bank', card);
        card.innerHTML = `
            <div class="payment-header">
                <div class="payment-icon"><i class="fas fa-university"></i></div>
                <div class="payment-info">
                    <h3>Bank Transfer</h3>
                    <p>Direct bank transfer</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    }

    if (paymentSettings.usdt.enabled) {
        const card = document.createElement('div');
        card.className = 'payment-method-card';
        card.onclick = () => selectDepositMethod('usdt', card);
        card.innerHTML = `
            <div class="payment-header">
                <div class="payment-icon"><i class="fab fa-bitcoin"></i></div>
                <div class="payment-info">
                    <h3>USDT (TRC20)</h3>
                    <p>Cryptocurrency payment</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    }
}

// Load Withdraw Payment Methods
function loadWithdrawPaymentMethods() {
    const container = document.getElementById('withdrawPaymentMethods');
    container.innerHTML = '';

    if (paymentSettings.bank.enabled) {
        const card = document.createElement('div');
        card.className = 'payment-method-card';
        card.onclick = () => selectWithdrawMethod('bank', card);
        card.innerHTML = `
            <div class="payment-header">
                <div class="payment-icon"><i class="fas fa-university"></i></div>
                <div class="payment-info">
                    <h3>Bank Transfer</h3>
                    <p>Withdraw to your bank account</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    }

    if (paymentSettings.usdt.enabled) {
        const card = document.createElement('div');
        card.className = 'payment-method-card';
        card.onclick = () => selectWithdrawMethod('usdt', card);
        card.innerHTML = `
            <div class="payment-header">
                <div class="payment-icon"><i class="fab fa-bitcoin"></i></div>
                <div class="payment-info">
                    <h3>USDT (TRC20)</h3>
                    <p>Withdraw to USDT wallet</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    }
}

// Select Deposit Method
function selectDepositMethod(method, card) {
    // Remove selected from all cards
    document.querySelectorAll('#depositPaymentMethods .payment-method-card').forEach(c => {
        c.classList.remove('selected');
    });

    // Add selected to clicked card
    card.classList.add('selected');

    // Hide all payment details
    document.getElementById('upiPaymentDetails').style.display = 'none';
    document.getElementById('bankPaymentDetails').style.display = 'none';
    document.getElementById('usdtPaymentDetails').style.display = 'none';

    // Show selected payment details
    if (method === 'upi') {
        document.getElementById('upiPaymentDetails').style.display = 'block';
        document.getElementById('upiQrImage').src = paymentSettings.upi.qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + paymentSettings.upi.upiId;
        document.getElementById('upiIdDisplay').textContent = paymentSettings.upi.upiId || 'Contact admin for UPI ID';
    } else if (method === 'bank') {
        document.getElementById('bankPaymentDetails').style.display = 'block';
        document.getElementById('bankHolderNameDisplay').textContent = paymentSettings.bank.holderName || 'Contact admin for details';
        document.getElementById('bankAccountNumberDisplay').textContent = paymentSettings.bank.accountNumber || 'Contact admin for details';
        document.getElementById('bankIfscDisplay').textContent = paymentSettings.bank.ifsc || 'Contact admin for details';
        document.getElementById('bankNameDisplay').textContent = paymentSettings.bank.bankName || 'Contact admin for details';
    } else if (method === 'usdt') {
        document.getElementById('usdtPaymentDetails').style.display = 'block';
        document.getElementById('usdtQrImage').src = paymentSettings.usdt.qrUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + paymentSettings.usdt.walletAddress;
        document.getElementById('usdtWalletAddressDisplay').textContent = paymentSettings.usdt.walletAddress || 'Contact admin for wallet address';
    }
}

// Select Withdraw Method
function selectWithdrawMethod(method, card) {
    // Remove selected from all cards
    document.querySelectorAll('#withdrawPaymentMethods .payment-method-card').forEach(c => {
        c.classList.remove('selected');
    });

    // Add selected to clicked card
    card.classList.add('selected');

    // Hide all withdrawal details
    document.getElementById('bankWithdrawDetails').style.display = 'none';
    document.getElementById('usdtWithdrawDetails').style.display = 'none';

    // Show selected withdrawal details
    if (method === 'bank') {
        document.getElementById('bankWithdrawDetails').style.display = 'block';
    } else if (method === 'usdt') {
        document.getElementById('usdtWithdrawDetails').style.display = 'block';
    }
}

// Submit Deposit
function submitDeposit(method) {
    let amount = 0;
    let transactionId = '';
    let paymentDetails = {};

    if (method === 'upi') {
        amount = parseFloat(document.getElementById('upiDepositAmount').value);
        transactionId = document.getElementById('upiTransactionId').value;
        paymentDetails = {
            upiId: paymentSettings.upi.upiId
        };

        if (!amount || amount < platformSettings.minDeposit) {
            showNotification(`Minimum deposit amount is ₹${platformSettings.minDeposit}`, 'error');
            return;
        }

        if (!transactionId) {
            showNotification('Please enter transaction ID', 'error');
            return;
        }
    } else if (method === 'bank') {
        amount = parseFloat(document.getElementById('bankDepositAmount').value);
        transactionId = document.getElementById('bankTransactionId').value;
        paymentDetails = {
            holderName: paymentSettings.bank.holderName,
            accountNumber: paymentSettings.bank.accountNumber,
            ifsc: paymentSettings.bank.ifsc,
            bankName: paymentSettings.bank.bankName
        };

        if (!amount || amount < platformSettings.minDeposit) {
            showNotification(`Minimum deposit amount is ₹${platformSettings.minDeposit}`, 'error');
            return;
        }

        if (!transactionId) {
            showNotification('Please enter transaction ID', 'error');
            return;
        }
    } else if (method === 'usdt') {
        amount = parseFloat(document.getElementById('usdtDepositAmount').value);
        transactionId = document.getElementById('usdtDepositHash').value || document.getElementById('usdtTransactionHash')?.value;
        paymentDetails = {
            walletAddress: paymentSettings.usdt.walletAddress
        };

        if (!amount || amount <= 0) {
            showNotification('Please enter valid amount', 'error');
            return;
        }

        if (!transactionId) {
            showNotification('Please enter transaction hash', 'error');
            return;
        }
    }

    // Create deposit request
    const deposit = {
        id: 'DEP' + Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        method: method,
        amount: amount,
        transactionId: transactionId,
        paymentDetails: paymentDetails,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const deposits = JSON.parse(localStorage.getItem('ravan365_deposits') || '[]');
    deposits.unshift(deposit);
    localStorage.setItem('ravan365_deposits', JSON.stringify(deposits));

    // Send notification to admin
    const adminNotifications = JSON.parse(localStorage.getItem('ravan365_admin_notifications') || '[]');
    adminNotifications.unshift({
        id: Date.now(),
        type: 'deposit',
        message: `New deposit request: ₹${amount.toLocaleString()} from ${currentUser.username}`,
        deposit: deposit,
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('ravan365_admin_notifications', JSON.stringify(adminNotifications));

    // Clear form and close modal
    if (method === 'upi') {
        document.getElementById('upiDepositAmount').value = '';
        document.getElementById('upiTransactionId').value = '';
    } else if (method === 'bank') {
        document.getElementById('bankDepositAmount').value = '';
        document.getElementById('bankTransactionId').value = '';
    } else if (method === 'usdt') {
        document.getElementById('usdtDepositAmount').value = '';
        document.getElementById('usdtTransactionHash').value = '';
    }

    closeModal('deposit');
    showNotification(`Deposit request of ₹${amount.toLocaleString()} submitted! Waiting for admin approval.`, 'success');
}

// Submit Withdrawal
function submitWithdrawal(method) {
    let amount = 0;
    let paymentDetails = {};

    if (method === 'bank') {
        const holderName = document.getElementById('withdrawHolderName').value;
        const accountNumber = document.getElementById('withdrawAccountNumber').value;
        const ifsc = document.getElementById('withdrawIfsc').value;
        const bankName = document.getElementById('withdrawBankName').value;
        amount = parseFloat(document.getElementById('withdrawAmount').value);

        if (!holderName || !accountNumber || !ifsc || !bankName) {
            showNotification('Please fill all bank details', 'error');
            return;
        }

        if (!amount || amount < platformSettings.minDeposit) {
            showNotification(`Minimum withdrawal amount is ₹${platformSettings.minDeposit}`, 'error');
            return;
        }

        if (amount > currentBalance) {
            showNotification('Insufficient balance', 'error');
            return;
        }

        paymentDetails = {
            holderName: holderName,
            accountNumber: accountNumber,
            ifsc: ifsc,
            bankName: bankName
        };
    } else if (method === 'usdt') {
        const walletAddress = document.getElementById('withdrawUsdtAddress').value;
        amount = parseFloat(document.getElementById('withdrawUsdtAmount').value);

        if (!walletAddress) {
            showNotification('Please enter wallet address', 'error');
            return;
        }

        if (!amount || amount <= 0) {
            showNotification('Please enter valid amount', 'error');
            return;
        }

        paymentDetails = {
            walletAddress: walletAddress
        };
    }

    // Create withdrawal request
    const withdrawal = {
        id: 'WDR' + Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        method: method,
        amount: amount,
        paymentDetails: paymentDetails,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const withdrawals = JSON.parse(localStorage.getItem('ravan365_withdrawals') || '[]');
    withdrawals.unshift(withdrawal);
    localStorage.setItem('ravan365_withdrawals', JSON.stringify(withdrawals));

    // Send notification to admin
    const adminNotifications = JSON.parse(localStorage.getItem('ravan365_admin_notifications') || '[]');
    adminNotifications.unshift({
        id: Date.now(),
        type: 'withdrawal',
        message: `New withdrawal request: ₹${amount.toLocaleString()} from ${currentUser.username}`,
        withdrawal: withdrawal,
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('ravan365_admin_notifications', JSON.stringify(adminNotifications));

    // Clear form and close modal
    if (method === 'bank') {
        document.getElementById('withdrawHolderName').value = '';
        document.getElementById('withdrawAccountNumber').value = '';
        document.getElementById('withdrawIfsc').value = '';
        document.getElementById('withdrawBankName').value = '';
        document.getElementById('withdrawAmount').value = '';
    } else if (method === 'usdt') {
        document.getElementById('withdrawUsdtAddress').value = '';
        document.getElementById('withdrawUsdtAmount').value = '';
    }

    closeModal('withdraw');
    showNotification(`Withdrawal request of ₹${amount.toLocaleString()} submitted! Waiting for admin approval.`, 'success');
}

// Update Balance Display
function updateBalanceDisplay() {
    const balance = '₹' + (currentBalance || 0).toLocaleString();
    document.getElementById('userBalance').textContent = balance;
    document.getElementById('depositBalance').textContent = balance;
    document.getElementById('withdrawBalance').textContent = balance;
    document.getElementById('profileBalance').textContent = balance;
}

// Modal Functions
function openModal(type) {
    const modalId = type + 'Modal';
    document.getElementById(modalId).classList.add('active');
    
    // Reload user data and payment methods when opening modals
    if (type === 'deposit' || type === 'withdraw') {
        loadUserData();
        loadPaymentSettings();
        updateBalanceDisplay();
        
        if (type === 'deposit') {
            loadDepositPaymentMethods();
        } else {
            loadWithdrawPaymentMethods();
        }
    }
    
    if (type === 'profile') {
        loadUserData();
        updateBalanceDisplay();
        document.getElementById('transactionHistory').style.display = 'none';
    }
}

function closeModal(type) {
    const modalId = type + 'Modal';
    document.getElementById(modalId).classList.remove('active');
}

// Copy to Clipboard
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    });
}

function copyBankDetails() {
    const details = `
        Account Holder: ${paymentSettings.bank.holderName}
        Account Number: ${paymentSettings.bank.accountNumber}
        IFSC Code: ${paymentSettings.bank.ifsc}
        Bank Name: ${paymentSettings.bank.bankName}
    `;
    navigator.clipboard.writeText(details.trim()).then(() => {
        showNotification('Bank details copied!', 'success');
    });
}

// Load Transaction History
function loadTransactionHistory() {
    const transactionsDiv = document.getElementById('transactionsList');
    const deposits = JSON.parse(localStorage.getItem('ravan365_deposits') || '[]');
    const withdrawals = JSON.parse(localStorage.getItem('ravan365_withdrawals') || '[]');

    // Filter transactions for current user
    const userDeposits = deposits.filter(d => d.userId === currentUser.id);
    const userWithdrawals = withdrawals.filter(w => w.userId === currentUser.id);

    // Combine and sort
    const allTransactions = [
        ...userDeposits.map(d => ({ ...d, type: 'deposit' })),
        ...userWithdrawals.map(w => ({ ...w, type: 'withdrawal' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (allTransactions.length === 0) {
        transactionsDiv.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 40px;">No transactions yet</p>';
        document.getElementById('transactionHistory').style.display = 'block';
        return;
    }

    let html = '<div class="transactions-list">';
    
    allTransactions.forEach(transaction => {
        const typeClass = transaction.type === 'deposit' ? 'deposit' : 'withdrawal';
        const typeText = transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal';
        const statusClass = transaction.status === 'completed' ? 'badge-success' : transaction.status === 'pending' ? 'badge-warning' : 'badge-danger';
        const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);

        html += `
            <div class="transaction-item">
                <div class="transaction-info">
                    <h4>${typeText} - ${transaction.method.toUpperCase()}</h4>
                    <p>${new Date(transaction.createdAt).toLocaleString()}</p>
                    <p><span class="status-badge ${transaction.status}">${statusText}</span></p>
                </div>
                <div class="transaction-amount ${typeClass}">
                    ${transaction.type === 'deposit' ? '+' : '-'}₹${transaction.amount.toLocaleString()}
                </div>
            </div>
        `;
    });

    html += '</div>';
    transactionsDiv.innerHTML = html;
    document.getElementById('transactionHistory').style.display = 'block';
}

// WhatsApp Support
function openWhatsApp() {
    const phoneNumber = platformSettings.whatsappNumber || '1234567890';
    const message = encodeURIComponent('Hello, I need support with Ravan365!');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
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

// Close modal on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
