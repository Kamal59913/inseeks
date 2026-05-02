import toast from 'react-hot-toast';

const toastStyle = {
  borderRadius: '8px',
  padding: '12px 16px',
  fontWeight: 500,
};

export const ToastService = {
  success: (message: string, id?: string) => {
    toast.success(message, {
      id: id || 'default-success',
      style: toastStyle,
      iconTheme: {
        primary: '#5a0071',
        secondary: '#FFFFFF',
      },
      
    });
  },
  error: (message: string, id?: string) => {
    toast.error(message, {
      id: id || 'default-error',
      style: {
        ...toastStyle,
        color: '#FFFFFF',
        backgroundColor: '#FF4D4F', // Normal red
      },
    });
  },
};
