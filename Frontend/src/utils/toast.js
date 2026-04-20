// Simple toast notification system
const toastContainer = document.getElementById('toast-container') || (() => {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    pointer-events: none;
  `;
  document.body.appendChild(container);
  return container;
})();

export const showToast = (message, type = 'info', duration = 3000) => {
  const toast = document.createElement('div');
  
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500',
  }[type] || 'bg-blue-500';

  toast.className = `${bgColor} text-white px-6 py-3 rounded-lg shadow-lg mb-2 pointer-events-auto animate-slideIn`;
  toast.textContent = message;
  toast.style.cssText += 'animation: slideIn 0.3s ease-out;';

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

export const toast = {
  success: (msg, duration) => showToast(msg, 'success', duration),
  error: (msg, duration) => showToast(msg, 'error', duration),
  warning: (msg, duration) => showToast(msg, 'warning', duration),
  info: (msg, duration) => showToast(msg, 'info', duration),
};

export default toast;
