export function showSuccessToast(message: string, duration: number = 3000) {
  const toast = document.createElement("div");
  toast.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in";
  toast.textContent = `✓ ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("animate-fade-out");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function showErrorToast(message: string, duration: number = 3000) {
  const toast = document.createElement("div");
  toast.className =
    "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in";
  toast.textContent = `✕ ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("animate-fade-out");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function confirmAction(message: string): boolean {
  return window.confirm(message);
}
