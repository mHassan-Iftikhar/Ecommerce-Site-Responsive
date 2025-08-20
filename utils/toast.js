export class Toast {
    static init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(this.container);
        }
    }
    static show(options) {
        this.init();
        const toast = document.createElement('div');
        const toastId = `toast-${++this.toastCount}`;
        toast.id = toastId;
        const type = options.type || 'info';
        const duration = options.duration || 3000;
        const position = options.position || 'top-right';
        // Set position
        if (position !== 'top-right') {
            this.container.style.top = position.includes('top') ? '20px' : 'auto';
            this.container.style.bottom = position.includes('bottom') ? '20px' : 'auto';
            this.container.style.left = position.includes('left') ? '20px' : 'auto';
            this.container.style.right = position.includes('right') ? '20px' : 'auto';
        }
        // Set toast styles based on type
        const typeStyles = {
            success: {
                backgroundColor: '#4caf50',
                color: 'white',
                icon: '✓'
            },
            error: {
                backgroundColor: '#f44336',
                color: 'white',
                icon: '✕'
            },
            warning: {
                backgroundColor: '#ff9800',
                color: 'white',
                icon: '⚠'
            },
            info: {
                backgroundColor: '#2196f3',
                color: 'white',
                icon: 'ℹ'
            }
        };
        const style = typeStyles[type];
        toast.style.cssText = `
            background-color: ${style.backgroundColor};
            color: ${style.color};
            padding: 12px 20px;
            margin-bottom: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 300px;
            word-wrap: break-word;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            pointer-events: auto;
            cursor: pointer;
        `;
        toast.innerHTML = `
            <span style="font-size: 16px;">${style.icon}</span>
            <span>${options.message}</span>
        `;
        this.container.appendChild(toast);
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);
        // Auto remove
        setTimeout(() => {
            this.remove(toastId);
        }, duration);
        // Click to dismiss
        toast.addEventListener('click', () => {
            this.remove(toastId);
        });
    }
    static remove(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }
    }
    // Convenience methods
    static success(message, options) {
        this.show({ ...options, message, type: 'success' });
    }
    static error(message, options) {
        this.show({ ...options, message, type: 'error' });
    }
    static warning(message, options) {
        this.show({ ...options, message, type: 'warning' });
    }
    static info(message, options) {
        this.show({ ...options, message, type: 'info' });
    }
}
Toast.container = null;
Toast.toastCount = 0;
// Initialize toast system when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        Toast.init();
    });
}
//# sourceMappingURL=toast.js.map