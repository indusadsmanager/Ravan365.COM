// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadGames();
    loadPaymentMethods();
    loadTransactionHistory();
    loadBetHistory();
    updateBalances();
});

// Load user data
function loadUserData() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    if (currentUser.username) {
        document.getElementById('profileUsername').textContent = currentUser.username;
        document.getElementById('profileEmail').textContent = currentUser.email || 'Not provided';
    }
}

// Update balances
function updateBalances() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === currentUser.id) || currentUser;
    
    const balance = user.balance || 0;
    document.getElementById('userBalance').textContent = `₹${balance}`;
    document.getElementById('depositBalance').textContent = `₹${balance}`;
    document.getElementById('withdrawBalance').textContent = `₹${balance}`;
    document.getElementById('profileBalance').textContent = `₹${balance}`;
}

// Load games
function loadGames() {
    const games = [
        { id: 1, name: 'Dragon Tiger', category: 'live', image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=300&fit=crop', provider: 'Evolution' },
        { id: 2, name: 'Roulette', category: 'table', image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop', provider: 'Evolution' },
        { id: 3, name: 'Blackjack', category: 'table', image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop', provider: 'Pragmatic' },
        { id: 4, name: 'Sweet Bonanza', category: 'slots', image: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?w=400&h=300&fit=crop', provider: 'Pragmatic' },
        { id: 5, name: 'Andar Bahar', category: 'live', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop', provider: 'Evolution' },
        { id: 6, name: 'Baccarat', category: 'table', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=400&h=300&fit=crop', provider: 'Evolution' },
        { id: 7, name: 'Starlight Princess', category: 'slots', image: 'https://images.unsplash.com/photo-1606112210939-2db9e7d93745?w=400&h=300&fit=crop', provider: 'Pragmatic' },
        { id: 8, name: 'Cricket Betting', category: 'sports', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=300&fit=crop', provider: 'Sportsbook' },
        { id: 9, name: 'Football Betting', category: 'sports', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop', provider: 'Sportsbook' },
        { id: 10, name: 'Teen Patti', category: 'live', image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=300&fit=crop', provider: 'Evolution' },
        { id: 11, name: 'Gates of Olympus', category: 'slots', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=300&fit=crop', provider: 'Pragmatic' },
        { id: 12, name: 'Poker', category: 'table', image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=300&fit=crop', provider: 'Evolution' }
    ];
    
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';
    
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.name}" class="game-image" onerror="this.src='https://via.placeholder.com/400x300/0d1333/00d9ff?text=${game.name}'">
            <div class="game-info">
                <h3 class="game-name">${game.name}</h3>
                <p class="game-category">${game.category} • ${game.provider}</p>
            </div>
            <div class="game-play-btn">PLAY NOW</div>
        `;
        gameCard.onclick = () => openGame(game);
        gamesGrid.appendChild(gameCard);
    });
}

// Filter games
function filterGames(category) {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    const gamesGrid = document.getElementById('gamesGrid');
    const gameCards = gamesGrid.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const gameCategory = card.querySelector('.game-category').textContent.toLowerCase();
        if (category === 'all' || gameCategory.includes(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Open game
function openGame(game) {
    alert(`Opening ${game.name}...`);
    // Here you would integrate with the game API
}

// Load payment methods
function loadPaymentMethods() {
    const depositMethods = [
        { id: 'upi', name: 'UPI Payment', icon: 'fas fa-qrcode', description: 'Instant transfer via UPI' },
        { id: 'bank', name: 'Bank Transfer', icon: 'fas fa-university', description: 'Direct bank transfer' },
        { id: 'usdt', name: 'USDT (TRC20)', icon: 'fab fa-bitcoin', description: 'Cryptocurrency payment' }
    ];
    
    const depositContainer = document.getElementById('depositPaymentMethods');
    depositContainer.innerHTML = '';
    
    depositMethods.forEach(method => {
        const methodCard = document.createElement('div');
        methodCard.className = 'payment-method-card';
        methodCard.innerHTML = `
            <div class="payment-header">
                <div class="payment-icon">
                    <i class="${method.icon}"></i>
                </div>
                <div class="payment-info">
                    <h3>${method.name}</h3>
                    <p>${method.description}</p>
                </div>
            </div>
        `;
        methodCard.onclick = () => selectDepositMethod(method.id);
        depositContainer.appendChild(methodCard);
    });
    
    const withdrawMethods = [
        { id: 'bank', name: 'Bank Transfer', icon: 'fas fa-university', description: 'Direct bank transfer' },
        { id: 'usdt', name: 'USDT (TRC20)', icon: 'fab fa-bitcoin', description: 'Cryptocurrency withdrawal' }
    ];
    
    const withdrawContainer = document.getElementById('withdrawPaymentMethods');
    withdrawContainer.innerHTML = '';
    
    withdrawMethods.forEach(method => {
        const methodCard = document.createElement('div');
        methodCard.className = 'payment-method-card';
        methodCard.innerHTML = `
            <div class="payment-header">
                <div class="payment-icon">
                    <i class="${method.icon}"></i>
                </div>
                <div class="payment-info">
                    <h3>${method.name}</h3>
                    <p>${method.description}</p>
                </div>
            </div>
        `;
        methodCard.onclick = () => selectWithdrawMethod(method.id);
        withdrawContainer.appendChild(methodCard);
    });
}

// Select deposit method
function selectDepositMethod(method) {
    // Remove selected class from all methods
    document.querySelectorAll('#depositPaymentMethods .payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked method
    event.currentTarget.classList.add('selected');
    
    // Hide all payment details
    document.getElementById('upiPaymentDetails').style.display = 'none';
    document.getElementById('bankPaymentDetails').style.display = 'none';
    document.getElementById('usdtPaymentDetails').style.display = 'none';
    
    // Show selected payment details
    if (method === 'upi') {
        document.getElementById('upiPaymentDetails').style.display = 'block';
        loadUpiDetails();
    } else if (method === 'bank') {
        document.getElementById('bankPaymentDetails').style.display = 'block';
        loadBankDetails();
    } else if (method === 'usdt') {
        document.getElementById('usdtPaymentDetails').style.display = 'block';
        loadUsdtDetails();
    }
}

// Select withdraw method
function selectWithdrawMethod(method) {
    // Remove selected class from all methods
    document.querySelectorAll('#withdrawPaymentMethods .payment-method-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to clicked method
    event.currentTarget.classList.add('selected');
    
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

// Load payment details from settings
function loadUpiDetails() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    document.getElementById('upiQrImage').src = settings.upiQrUrl || 'https://via.placeholder.com/200';
    const upiId = settings.upiId || 'example@upi';
    document.getElementById('upiIdDisplay').textContent = upiId;
    document.getElementById('upiIdDisplayText').textContent = upiId;
}

function loadBankDetails() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    document.getElementById('bankHolderNameDisplay').textContent = settings.bankHolderName || 'N/A';
    document.getElementById('bankAccountNumberDisplay').textContent = settings.bankAccountNumber || 'N/A';
    document.getElementById('bankIfscDisplay').textContent = settings.bankIfsc || 'N/A';
    document.getElementById('bankNameDisplay').textContent = settings.bankName || 'N/A';
}

function loadUsdtDetails() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    document.getElementById('usdtQrImage').src = settings.usdtQrUrl || 'https://via.placeholder.com/200';
    document.getElementById('usdtWalletAddressDisplay').textContent = settings.usdtWalletAddress || 'N/A';
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

function copyBankDetails() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    const bankDetails = `Account Holder: ${settings.bankHolderName}\nAccount Number: ${settings.bankAccountNumber}\nIFSC Code: ${settings.bankIfsc}\nBank Name: ${settings.bankName}`;
    navigator.clipboard.writeText(bankDetails).then(() => {
        alert('Bank details copied to clipboard!');
    });
}

// Submit deposit
function submitDeposit(method) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    let amount, transactionId, details;
    
    if (method === 'upi') {
        amount = document.getElementById('upiDepositAmount').value;
        transactionId = document.getElementById('upiTransactionId').value;
        details = `UPI ID: ${document.getElementById('upiIdDisplay').textContent}`;
    } else if (method === 'bank') {
        amount = document.getElementById('bankDepositAmount').value;
        transactionId = document.getElementById('bankTransactionId').value;
        details = `Bank Transfer`;
    } else if (method === 'usdt') {
        amount = document.getElementById('usdtDepositAmount').value;
        transactionId = document.getElementById('usdtTransactionHash').value;
        details = `USDT (TRC20)`;
    }
    
    if (!amount || !transactionId) {
        alert('Please fill in all fields!');
        return;
    }
    
    const deposit = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        method: method.toUpperCase(),
        amount: parseFloat(amount),
        transactionId,
        details,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save deposit
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    deposits.push(deposit);
    localStorage.setItem('deposits', JSON.stringify(deposits));
    
    alert('Deposit request submitted successfully! Please wait for approval.');
    closeModal('deposit');
    loadTransactionHistory();
}

// Submit withdrawal
function submitWithdrawal(method) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    let amount, details;
    
    if (method === 'bank') {
        amount = document.getElementById('withdrawAmount').value;
        details = {
            holderName: document.getElementById('withdrawHolderName').value,
            accountNumber: document.getElementById('withdrawAccountNumber').value,
            ifsc: document.getElementById('withdrawIfsc').value,
            bankName: document.getElementById('withdrawBankName').value
        };
    } else if (method === 'usdt') {
        amount = document.getElementById('withdrawUsdtAmount').value;
        details = {
            walletAddress: document.getElementById('withdrawUsdtAddress').value
        };
    }
    
    if (!amount) {
        alert('Please enter amount!');
        return;
    }
    
    if (parseFloat(amount) > (users[userIndex].balance || 0)) {
        alert('Insufficient balance!');
        return;
    }
    
    const withdrawal = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        method: method.toUpperCase(),
        amount: parseFloat(amount),
        details,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save withdrawal
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    withdrawals.push(withdrawal);
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
    
    alert('Withdrawal request submitted successfully! Please wait for approval.');
    closeModal('withdraw');
    loadTransactionHistory();
}

// Load transaction history
function loadTransactionHistory() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]').filter(d => d.userId === currentUser.id);
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]').filter(w => w.userId === currentUser.id);
    
    // Combine and sort by date
    const transactions = [...deposits, ...withdrawals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No transactions found</p>';
        return;
    }
    
    transactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const isDeposit = deposits.includes(transaction);
        const date = new Date(transaction.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        item.innerHTML = `
            <div class="transaction-info">
                <h4>${isDeposit ? 'Deposit' : 'Withdrawal'} • ${transaction.method}</h4>
                <p>${date} • ${transaction.status}</p>
            </div>
            <div class="transaction-amount ${isDeposit ? 'deposit' : 'withdrawal'}">
                ${isDeposit ? '+' : '-'}₹${transaction.amount}
            </div>
        `;
        transactionsList.appendChild(item);
    });
}

// Load bet history
function loadBetHistory() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const bets = JSON.parse(localStorage.getItem('bets') || '[]').filter(b => b.userId === currentUser.id);
    
    const betsList = document.getElementById('betsList');
    betsList.innerHTML = '';
    
    if (bets.length === 0) {
        betsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No bets found</p>';
        return;
    }
    
    // Sort by date (newest first)
    bets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    bets.forEach(bet => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const date = new Date(bet.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        item.innerHTML = `
            <div class="transaction-info">
                <h4>${bet.game}</h4>
                <p>${date} • ${bet.result}</p>
            </div>
            <div class="transaction-amount ${bet.result === 'WIN' ? 'deposit' : 'withdrawal'}">
                ${bet.result === 'WIN' ? '+' : '-'}₹${bet.amount}
            </div>
        `;
        betsList.appendChild(item);
    });
}

// Filter transactions by date
function filterTransactions() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    let transactions = [...JSON.parse(localStorage.getItem('deposits') || '[]').filter(d => d.userId === currentUser.id),
                         ...JSON.parse(localStorage.getItem('withdrawals') || '[]').filter(w => w.userId === currentUser.id)];
    
    if (startDate) {
        transactions = transactions.filter(t => new Date(t.createdAt) >= new Date(startDate));
    }
    
    if (endDate) {
        transactions = transactions.filter(t => new Date(t.createdAt) <= new Date(endDate + 'T23:59:59'));
    }
    
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No transactions found for selected period</p>';
        return;
    }
    
    transactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const isDeposit = transaction.method && !transaction.details?.holderName && !transaction.details?.walletAddress;
        const date = new Date(transaction.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        item.innerHTML = `
            <div class="transaction-info">
                <h4>${isDeposit ? 'Deposit' : 'Withdrawal'} • ${transaction.method}</h4>
                <p>${date} • ${transaction.status}</p>
            </div>
            <div class="transaction-amount ${isDeposit ? 'deposit' : 'withdrawal'}">
                ${isDeposit ? '+' : '-'}₹${transaction.amount}
            </div>
        `;
        transactionsList.appendChild(item);
    });
}

// Filter bets by date
function filterBets() {
    const startDate = document.getElementById('betStartDate').value;
    const endDate = document.getElementById('betEndDate').value;
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    let bets = JSON.parse(localStorage.getItem('bets') || '[]').filter(b => b.userId === currentUser.id);
    
    if (startDate) {
        bets = bets.filter(b => new Date(b.createdAt) >= new Date(startDate));
    }
    
    if (endDate) {
        bets = bets.filter(b => new Date(b.createdAt) <= new Date(endDate + 'T23:59:59'));
    }
    
    bets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const betsList = document.getElementById('betsList');
    betsList.innerHTML = '';
    
    if (bets.length === 0) {
        betsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No bets found for selected period</p>';
        return;
    }
    
    bets.forEach(bet => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const date = new Date(bet.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        item.innerHTML = `
            <div class="transaction-info">
                <h4>${bet.game}</h4>
                <p>${date} • ${bet.result}</p>
            </div>
            <div class="transaction-amount ${bet.result === 'WIN' ? 'deposit' : 'withdrawal'}">
                ${bet.result === 'WIN' ? '+' : '-'}₹${bet.amount}
            </div>
        `;
        betsList.appendChild(item);
    });
}

// Show history tab
function showHistoryTab(tab) {
    const tabs = document.querySelectorAll('.history-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('transactionsHistory').classList.remove('active');
    document.getElementById('betsHistory').classList.remove('active');
    
    if (tab === 'transactions') {
        document.getElementById('transactionsHistory').classList.add('active');
    } else {
        document.getElementById('betsHistory').classList.add('active');
    }
}

// Modal functions
function openModal(type) {
    document.getElementById(type + 'Modal').classList.add('active');
}

function closeModal(type) {
    document.getElementById(type + 'Modal').classList.remove('active');
}

// API Integration
function openApiIntegration() {
    openModal('api');
}

function connectApi() {
    const provider = document.getElementById('apiProvider').value;
    const apiKey = document.getElementById('apiKey').value;
    const operatorId = document.getElementById('operatorId').value;
    
    if (!apiKey || !operatorId) {
        alert('Please fill in all fields!');
        return;
    }
    
    // Save API configuration
    const apiConfig = {
        provider,
        apiKey,
        operatorId,
        connectedAt: new Date().toISOString()
    };
    
    localStorage.setItem('gameApiConfig', JSON.stringify(apiConfig));
    
    alert(`Successfully connected to ${provider} API! Games will be loaded shortly.`);
    closeModal('api');
    
    // In a real implementation, this would load games from the API
    alert('Demo mode: Games have been refreshed. In production, 1000+ games from the API would be loaded.');
}

// Mobile menu
function toggleMobileMenu() {
    // Toggle mobile nav visibility
    const mobileNav = document.querySelector('.mobile-nav');
    mobileNav.style.display = mobileNav.style.display === 'none' ? 'block' : 'none';
}

function scrollToSection(section) {
    const element = document.getElementById(section);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// WhatsApp
function openWhatsApp() {
    const whatsappNumber = localStorage.getItem('whatsappNumber') || '919876543210';
    const message = 'Hello, I need help with Ravan365 Casino.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}
