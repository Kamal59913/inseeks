import { useQuery } from '@tanstack/react-query';

// Placeholder for actual messages API
export const useMessagesQuery = () =>
  useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      return [
        {
          id: '1',
          sender: 'Edward Ford',
          time: '5:30 pm',
          message: 'Thank you for sharing this information',
          unreadCount: 1,
          isOnline: true,
        },
        {
          id: '2',
          sender: 'Marcus Lee',
          time: '4:15 pm',
          message: 'Did you see the new update?',
          unreadCount: 0,
          isOnline: false,
        },
      ];
    },
  });
