import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '../utils/tokenStorage';

let socketInstance: Socket | null = null;

const getSocketUrl = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  if (apiUrl) {
    try {
      return new URL(apiUrl).origin;
    } catch (_error) {
      return apiUrl.replace(/\/api\/v\d+\/?$/, '');
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:8000';
};

export const getDiscussionSocket = () => {
  if (socketInstance) return socketInstance;

  socketInstance = io(getSocketUrl(), {
    transports: ['websocket'],
    withCredentials: true,
    auth: {
      token: getAccessToken(),
    },
  });

  return socketInstance;
};
