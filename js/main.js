// ===== MAIN.JS - Common JavaScript functions =====

// ===== GLOBAL NOTIFICATION SYSTEM =====
// Inject notification container and styles on page load
(function() {
    // Add notification container to body
    if (!document.getElementById('nnb-notification-container')) {
        const container = document.createElement('div');
        container.id = 'nnb-notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 99999;
            max-width: 400px;
        `;
        document.body.appendChild(container);
    }
})();

/**
 * Show beautiful notification
 * @param {string} message - Message to display
 * @param {string} type - Type: success, error, warning, info, confirm
 * @param {function} onConfirm - Callback for confirm dialogs
 */
function showNotification(message, type = 'info', onConfirm = null) {
    const container = document.getElementById('nnb-notification-container');
    if (!container) return;

    const id = 'notif-' + Date.now();
    const notification = document.createElement('div');
    notification.id = id;
    notification.style.cssText = `
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        padding: 20px;
        margin-bottom: 15px;
        animation: slideInRight 0.3s ease-out;
        border-left: 5px solid;
        position: relative;
    `;

    let color, icon, title;
    switch(type) {
        case 'success':
            color = '#28a745';
            icon = 'bi-check-circle-fill';
            title = 'Thành công';
            break;
        case 'error':
            color = '#dc3545';
            icon = 'bi-x-circle-fill';
            title = 'Lỗi';
            break;
        case 'warning':
            color = '#ffc107';
            icon = 'bi-exclamation-triangle-fill';
            title = 'Cảnh báo';
            break;
        case 'confirm':
            color = '#17a2b8';
            icon = 'bi-question-circle-fill';
            title = 'Xác nhận';
            break;
        default:
            color = '#17a2b8';
            icon = 'bi-info-circle-fill';
            title = 'Thông báo';
    }

    notification.style.borderLeftColor = color;

    if (type === 'confirm') {
        notification.innerHTML = `
            <div style="display: flex; align-items: start;">
                <i class="bi ${icon}" style="font-size: 2rem; color: ${color}; margin-right: 15px;"></i>
                <div style="flex: 1;">
                    <h5 style="margin: 0 0 10px 0; color: #333;">${title}</h5>
                    <p style="margin: 0 0 15px 0; color: #666;">${message}</p>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="document.getElementById('${id}').remove(); ${onConfirm ? `(${onConfirm})()` : ''}" 
                                style="flex: 1; padding: 8px 16px; background: ${color}; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                            Xác nhận
                        </button>
                        <button onclick="document.getElementById('${id}').remove()" 
                                style="flex: 1; padding: 8px 16px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer;">
                            Hủy
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        notification.innerHTML = `
            <div style="display: flex; align-items: start;">
                <i class="bi ${icon}" style="font-size: 2rem; color: ${color}; margin-right: 15px;"></i>
                <div style="flex: 1;">
                    <h5 style="margin: 0 0 5px 0; color: #333;">${title}</h5>
                    <p style="margin: 0; color: #666; white-space: pre-line;">${message}</p>
                </div>
                <button onclick="document.getElementById('${id}').remove()" 
                        style="background: none; border: none; font-size: 1.5rem; color: #999; cursor: pointer; padding: 0; margin-left: 10px;">
                    ×
                </button>
            </div>
        `;

        // Auto remove after 5 seconds
        setTimeout(() => {
            const el = document.getElementById(id);
            if (el) {
                el.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => el.remove(), 300);
            }
        }, 5000);
    }

    container.appendChild(notification);

    // Add keyframe animations if not exists
    if (!document.getElementById('nnb-notif-styles')) {
        const style = document.createElement('style');
        style.id = 'nnb-notif-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Override native alert and confirm
window.alert = function(message) {
    console.warn('Alert overridden:', message);
    showNotification(String(message), 'info');
};

window.confirm = function(message) {
    console.warn('Confirm overridden:', message);
    return new Promise((resolve) => {
        showNotification(String(message), 'confirm', () => resolve(true));
    });
};

// ===== UTILITY FUNCTIONS =====

/**
 * Tạo hash mô phỏng từ chuỗi đầu vào
 */
function generateHash(input) {
    let hash = 0;
    const str = String(input);
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return '0x' + Math.abs(hash).toString(16).padStart(12, '0');
}

/**
 * Tạo Token ID mô phỏng
 */
function generateTokenId(prefix = 'BC') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
}

/**
 * Format date to Vietnamese locale
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

/**
 * Format datetime to Vietnamese locale
 */
function formatDateTime(date) {
    return new Date(date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Show notification toast
 */
function showNotification(message, type = 'success') {
    // Tạo toast element nếu chưa có
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '11';
        document.body.appendChild(toastContainer);
    }

    // Tạo toast
    const toastId = 'toast-' + Date.now();
    const bgClass = type === 'success' ? 'bg-success' : 
                    type === 'error' ? 'bg-danger' : 
                    type === 'warning' ? 'bg-warning' : 'bg-info';
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'x-circle' : 
                 type === 'warning' ? 'exclamation-triangle' : 'info-circle';

    const toastHTML = `
        <div id="${toastId}" class="toast" role="alert">
            <div class="toast-header ${bgClass} text-white">
                <i class="bi bi-${icon} me-2"></i>
                <strong class="me-auto">${type === 'success' ? 'Thành công' : 
                                        type === 'error' ? 'Lỗi' : 
                                        type === 'warning' ? 'Cảnh báo' : 'Thông tin'}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();

    // Xóa toast sau khi ẩn
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Đã sao chép vào clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

/**
 * Fallback method to copy text
 */
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Đã sao chép vào clipboard!', 'success');
    } catch (err) {
        showNotification('Không thể sao chép!', 'error');
    }
    
    document.body.removeChild(textArea);
}

// ===== LOCAL STORAGE HELPERS =====

/**
 * Lưu dữ liệu vào localStorage
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

/**
 * Lấy dữ liệu từ localStorage
 */
function getFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return defaultValue;
    }
}

/**
 * Xóa dữ liệu từ localStorage
 */
function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Error removing from localStorage:', e);
        return false;
    }
}

// ===== BATCH MANAGEMENT =====

/**
 * Thêm batch mới
 */
function addBatch(batchData) {
    const batches = getFromLocalStorage('riceBatches', []);
    batches.push({
        ...batchData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    saveToLocalStorage('riceBatches', batches);
    return batches[batches.length - 1];
}

/**
 * Lấy tất cả batches
 */
function getAllBatches() {
    return getFromLocalStorage('riceBatches', []);
}

/**
 * Lấy batch theo ID
 */
function getBatchById(tokenId) {
    const batches = getAllBatches();
    return batches.find(b => b.tokenId === tokenId);
}

/**
 * Cập nhật batch
 */
function updateBatch(tokenId, updates) {
    const batches = getAllBatches();
    const index = batches.findIndex(b => b.tokenId === tokenId);
    if (index !== -1) {
        batches[index] = {
            ...batches[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        saveToLocalStorage('riceBatches', batches);
        return batches[index];
    }
    return null;
}

// ===== EVENT MANAGEMENT =====

/**
 * Thêm event mới
 */
function addEvent(eventData) {
    const events = getFromLocalStorage('riceEvents', []);
    const newEvent = {
        ...eventData,
        id: generateHash(Date.now() + Math.random()),
        recordedAt: new Date().toISOString(),
        blockHash: generateHash(JSON.stringify(eventData))
    };
    events.unshift(newEvent); // Thêm vào đầu mảng
    saveToLocalStorage('riceEvents', events);
    
    // Cập nhật batch status nếu cần
    updateBatchStatus(eventData.tokenId, eventData.type);
    
    return newEvent;
}

/**
 * Lấy tất cả events
 */
function getAllEvents() {
    return getFromLocalStorage('riceEvents', []);
}

/**
 * Lấy events theo token ID
 */
function getEventsByTokenId(tokenId) {
    const events = getAllEvents();
    return events.filter(e => e.tokenId === tokenId);
}

/**
 * Cập nhật status của batch dựa trên event type
 */
function updateBatchStatus(tokenId, eventType) {
    const statusMap = {
        'fertilizing': 'Đang canh tác',
        'irrigation': 'Đang canh tác',
        'harvesting': 'Đã thu hoạch',
        'milling': 'Đang xay xát',
        'packaging': 'Đã đóng gói',
        'shipping': 'Đang vận chuyển',
        'warehouse_in': 'Trong kho',
        'warehouse_out': 'Đã xuất kho',
        'distribution': 'Đã phân phối'
    };
    
    if (statusMap[eventType]) {
        updateBatch(tokenId, { status: statusMap[eventType] });
    }
}

// ===== USER MANAGEMENT =====

/**
 * Lấy thông tin user hiện tại
 */
function getCurrentUser() {
    return {
        username: localStorage.getItem('username'),
        role: localStorage.getItem('userRole'),
        loginTime: localStorage.getItem('loginTime')
    };
}

/**
 * Kiểm tra đăng nhập
 */
function isLoggedIn() {
    return !!localStorage.getItem('userRole');
}

/**
 * Kiểm tra quyền admin
 */
function isAdmin() {
    return localStorage.getItem('userRole') === 'admin';
}

/**
 * Đăng xuất
 */
function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('loginTime');
    window.location.href = 'login.html';
}

// ===== BLOCKCHAIN SIMULATION =====

/**
 * Mô phỏng ghi dữ liệu lên blockchain
 */
function writeToBlockchain(data) {
    return new Promise((resolve) => {
        // Mô phỏng độ trễ network
        setTimeout(() => {
            const transaction = {
                hash: generateHash(JSON.stringify(data) + Date.now()),
                blockNumber: Math.floor(Math.random() * 10000) + 10000,
                timestamp: new Date().toISOString(),
                status: 'confirmed',
                data: data
            };
            resolve(transaction);
        }, 1000 + Math.random() * 1000); // 1-2 giây
    });
}

/**
 * Mô phỏng đọc dữ liệu từ blockchain
 */
function readFromBlockchain(hash) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                found: true,
                hash: hash,
                blockNumber: Math.floor(Math.random() * 10000) + 10000,
                timestamp: new Date().toISOString(),
                verified: true
            });
        }, 500 + Math.random() * 500); // 0.5-1 giây
    });
}

// ===== VALIDATION =====

/**
 * Validate token ID format
 */
function isValidTokenId(tokenId) {
    return /^BC[A-Z0-9]{6,}$/.test(tokenId);
}

/**
 * Validate email
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== SAMPLE DATA INITIALIZATION =====

/**
 * Khởi tạo dữ liệu mẫu nếu chưa có
 */
function initializeSampleData() {
    const batches = getAllBatches();
    
    if (batches.length === 0) {
        // Thêm một số batch mẫu
        const sampleBatches = [
            {
                tokenId: 'BC001',
                variety: 'ST25',
                location: 'Đồng Nai, Việt Nam',
                area: '2.5',
                plantDate: '2025-09-01',
                note: 'Lô thử nghiệm',
                creator: 'Admin',
                status: 'Đã phân phối'
            },
            {
                tokenId: 'BC002',
                variety: 'Jasmine 85',
                location: 'An Giang, Việt Nam',
                area: '3.0',
                plantDate: '2025-08-15',
                note: 'Lô xuất khẩu',
                creator: 'Admin',
                status: 'Đã phân phối'
            },
            {
                tokenId: 'BC003',
                variety: 'Nàng Hoa 9',
                location: 'Đồng Tháp, Việt Nam',
                area: '1.8',
                plantDate: '2025-09-05',
                note: 'Lô cao cấp',
                creator: 'Admin',
                status: 'Đã phân phối'
            }
        ];

        sampleBatches.forEach(batch => addBatch(batch));
        console.log('Sample batches initialized');
    }
}

// ===== EVENT LISTENERS =====

// Khởi tạo khi DOM loaded
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo tooltips nếu có Bootstrap
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Khởi tạo dữ liệu mẫu
    initializeSampleData();
});

// ===== EXPORT FUNCTIONS (if using modules) =====
// Nếu sử dụng ES6 modules, uncomment dòng dưới
// export { generateHash, generateTokenId, formatDate, formatDateTime, showNotification, ... };

console.log('🚀 Main.js loaded successfully - Blockchain Rice Supply Chain System');
