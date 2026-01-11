// Admin Credentials (ONLY YOU HAVE ACCESS)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// WhatsApp Number for "GET NEW ID"
const WHATSAPP_NUMBER = '1234567890'; // Replace with your actual WhatsApp number

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    checkRememberMe();
});

// Create background particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Switch between Login and Register tabs
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.form-section');

    tabs.forEach(tabBtn => tabBtn.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));

    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginSection').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('registerSection').classList.add('active');
    }

    // Hide any error messages
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('registerError').style.display = 'none';
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Check Admin Login (ONLY YOU)
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('admin', 'true');
        sessionStorage.setItem('role', 'admin');
        sessionStorage.setItem('username', username);
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showNotification('Welcome Admin! Redirecting to admin panel...', 'success');
        setTimeout(() => {
            window.location.href = 'admin-panel.html';
        }, 1500);
        return;
    }

    // Check User Login
    const users = JSON.parse(localStorage.getItem('ravan365_users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Check if user is banned
        if (user.status === 'banned') {
            showNotification('Your account has been banned. Please contact support.', 'error');
            return;
        }

        sessionStorage.setItem('user', 'true');
        sessionStorage.setItem('role', 'user');
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userId', user.id);
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        showNotification('Welcome back! Redirecting to casino...', 'success');
        setTimeout(() => {
            window.location.href = 'casino.html';
        }, 1500);
    } else {
        document.getElementById('loginError').style.display = 'block';
        showNotification('Invalid credentials. Please try again.', 'error');
    }
}

// Handle Registration
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validation
    if (password !== confirmPassword) {
        document.getElementById('registerError').textContent = 'Passwords do not match!';
        document.getElementById('registerError').style.display = 'block';
        return;
    }

    if (password.length < 6) {
        document.getElementById('registerError').textContent = 'Password must be at least 6 characters!';
        document.getElementById('registerError').style.display = 'block';
        return;
    }

    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('ravan365_users') || '[]');
    if (users.find(u => u.username === username)) {
        document.getElementById('registerError').textContent = 'Username already exists!';
        document.getElementById('registerError').style.display = 'block';
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        username: username,
        email: email,
        phone: phone,
        password: password,
        balance: 0,
        status: 'active', // active, banned
        createdAt: new Date().toISOString(),
        lastLogin: null
    };

    users.push(newUser);
    localStorage.setItem('ravan365_users', JSON.stringify(users));

    // Send registration details to admin (stored in localStorage)
    const pendingRegistrations = JSON.parse(localStorage.getItem('ravan365_pending_registrations') || '[]');
    pendingRegistrations.push({
        ...newUser,
        registeredAt: new Date().toISOString()
    });
    localStorage.setItem('ravan365_pending_registrations', JSON.stringify(pendingRegistrations));

    // Auto-send registration details to admin panel
    sendRegistrationToAdmin(newUser);

    showNotification('Registration successful! Your details have been sent to admin.', 'success');

    // Clear form and switch to login
    document.getElementById('registerForm').reset();
    setTimeout(() => {
        switchTab('login');
        document.getElementById('loginUsername').value = username;
        document.getElementById('loginPassword').value = password;
    }, 2000);
}

// Send registration details to admin panel
function sendRegistrationToAdmin(user) {
    // Store in admin notifications
    const adminNotifications = JSON.parse(localStorage.getItem('ravan365_admin_notifications') || '[]');
    adminNotifications.unshift({
        id: Date.now(),
        type: 'registration',
        message: `New user registration: ${user.username}`,
        user: user,
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('ravan365_admin_notifications', JSON.stringify(adminNotifications));

    console.log('Registration sent to admin:', user);
}

// GET NEW ID via WhatsApp
function getNewIdViaWhatsApp() {
    const message = encodeURIComponent('Hello! I want to get a new gaming ID on Ravan365. Please help me create an account.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
}

// Show Forgot Password
function showForgotPassword() {
    showNotification('Please contact admin on WhatsApp to reset your password.', 'info');
    setTimeout(() => {
        getNewIdViaWhatsApp();
    }, 1500);
}

// Check Remember Me
function checkRememberMe() {
    if (localStorage.getItem('rememberMe')) {
        document.getElementById('rememberMe').checked = true;
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = '';
    if (type === 'success') icon = '<i class="fas fa-check-circle" style="color: #10b981; font-size: 20px;"></i>';
    else if (type === 'error') icon = '<i class="fas fa-exclamation-circle" style="color: #ef4444; font-size: 20px;"></i>';
    else icon = '<i class="fas fa-info-circle" style="color: #00d9ff; font-size: 20px;"></i>';

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; padding: 16px 20px;">
            ${icon}
            <span style="font-size: 14px; font-weight: 500;">${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(160deg, rgba(13, 19, 51, 0.95), rgba(9, 13, 31, 0.95));
        border: 1px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#00d9ff'};
        border-radius: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        max-width: 400px;
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

// Initialize admin notifications if not exists
if (!localStorage.getItem('ravan365_admin_notifications')) {
    localStorage.setItem('ravan365_admin_notifications', '[]');
}

// Initialize users array if not exists
if (!localStorage.getItem('ravan365_users')) {
    localStorage.setItem('ravan365_users', '[]');
}

// Initialize pending registrations if not exists
if (!localStorage.getItem('ravan365_pending_registrations')) {
    localStorage.setItem('ravan365_pending_registrations', '[]');
}
