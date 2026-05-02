// utils/localStorage.ts

export const setLocalStorage = (key: string, value: any): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  export const getLocalStorage = <T = any>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  };
  
  export const removeLocalStorage = (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };
  
  export const clearLocalStorage = (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
    }
  };