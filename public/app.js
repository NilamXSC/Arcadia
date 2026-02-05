// Arcadia Health - Frontend JavaScript

const API_BASE = '';

// Check system status
async function checkStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusDetails = document.getElementById('statusDetails');
    const dot = statusIndicator.querySelector('.dot');
    
    statusIndicator.innerHTML = '<span class="loading"></span><span>Checking...</span>';
    statusDetails.textContent = '';
    
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        const data = await response.json();
        
        if (data.status === 'healthy') {
            dot.className = 'dot healthy';
            statusIndicator.innerHTML = '<span class="dot healthy"></span><span>System Healthy</span>';
            statusDetails.textContent = JSON.stringify(data, null, 2);
        } else {
            dot.className = 'dot unavailable';
            statusIndicator.innerHTML = '<span class="dot unavailable"></span><span>System Unavailable</span>';
            statusDetails.textContent = JSON.stringify(data, null, 2);
        }
    } catch (error) {
        dot.className = 'dot unavailable';
        statusIndicator.innerHTML = '<span class="dot unavailable"></span><span>Connection Error</span>';
        statusDetails.textContent = `Error: ${error.message}\n\nPlease make sure the server is running.`;
    }
}

// Encrypt data
async function encryptData() {
    const input = document.getElementById('encryptInput');
    const result = document.getElementById('encryptionResult');
    const data = input.value.trim();
    
    if (!data) {
        result.className = 'result-container error';
        result.textContent = 'Please enter data to encrypt.';
        return;
    }
    
    result.className = 'result-container';
    result.textContent = 'Encrypting...';
    
    try {
        const response = await fetch(`${API_BASE}/api/encrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data })
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
            result.className = 'result-container success';
            result.textContent = JSON.stringify(responseData, null, 2);
            // Store encrypted data for decryption demo
            window.lastEncrypted = responseData.encrypted;
        } else {
            result.className = 'result-container error';
            result.textContent = `Error: ${responseData.error || 'Encryption failed'}`;
        }
    } catch (error) {
        result.className = 'result-container error';
        result.textContent = `Error: ${error.message}`;
    }
}

// Decrypt data
async function decryptData() {
    const result = document.getElementById('encryptionResult');
    
    if (!window.lastEncrypted) {
        result.className = 'result-container error';
        result.textContent = 'Please encrypt some data first.';
        return;
    }
    
    result.className = 'result-container';
    result.textContent = 'Decrypting...';
    
    try {
        const response = await fetch(`${API_BASE}/api/decrypt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ encrypted: window.lastEncrypted })
        });
        
        const responseData = await response.json();
        
        if (response.ok) {
            result.className = 'result-container success';
            result.textContent = JSON.stringify(responseData, null, 2);
        } else {
            result.className = 'result-container error';
            result.textContent = `Error: ${responseData.error || 'Decryption failed'}`;
        }
    } catch (error) {
        result.className = 'result-container error';
        result.textContent = `Error: ${error.message}`;
    }
}

// Check status on page load
document.addEventListener('DOMContentLoaded', () => {
    checkStatus();
    
    // Auto-refresh status every 30 seconds
    setInterval(checkStatus, 30000);
});
