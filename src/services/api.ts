import axios from 'axios';
import Swal from 'sweetalert2';

export const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Bearer token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('classic_eco_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Toast notification helper with SweetAlert2
export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  Toast.fire({
    icon,
    title
  });
};

// Confirmation modal helper with SweetAlert2
export const showConfirm = async (title: string, text: string, confirmButtonText: string = 'Yes, Proceed') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#174D37',
    cancelButtonColor: '#6B7280',
    confirmButtonText
  });
};

// Alert modal helper
export const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'info' = 'success') => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonColor: '#174D37'
  });
};
