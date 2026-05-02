import toast, { Renderable } from "react-hot-toast";

const toastBaseStyle = {
  borderRadius: "16px",
  padding: "16px 20px",
  fontWeight: 500,
  fontSize: "14px",
  fontFamily: "var(--font-poppins)",
  backgroundColor: "#FFFFFF",
  color: "#2D3436",
  maxWidth: "400px",
  border: "none",
};

export const ToastService = {
  success: (message: Renderable, id?: string, options?: any) => {
    toast.success(message, {
      id: id || "default-success",
      ...options,
      style: {
        ...toastBaseStyle,
        background: "linear-gradient(to right, #f5ebff, #ffffff)",
        ...(options?.style || {}),
      },
      iconTheme: {
        primary: "#d16df2",
        secondary: "#FFFFFF",
        ...(options?.iconTheme || {}),
      },
      duration: options?.duration || 4000,
    });
  },
  error: (message: Renderable, id?: string, options?: any) => {
    toast.error(message, {
      id: id || "default-error",
      ...options,
      style: {
        ...toastBaseStyle,
        background: "linear-gradient(to right, #ffebeb, #ffffff)",
        ...(options?.style || {}),
      },
      iconTheme: {
        primary: "#ee5e5e",
        secondary: "#FFFFFF",
        ...(options?.iconTheme || {}),
      },
      duration: options?.duration || 4000,
    });
  },
  warning: (message: Renderable, id?: string, options?: any) => {
    toast(message, {
      id: id || "default-warning",
      ...options,
      style: {
        ...toastBaseStyle,
        background: "linear-gradient(to right, #fff9eb, #ffffff)",
        ...(options?.style || {}),
      },
      icon: options?.icon || "⚠️",
      duration: options?.duration || 4000,
    });
  },
};
