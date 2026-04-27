import { useQuery } from '@tanstack/react-query';

// Placeholder for actual search API
// In a real app, this would call postService.search or userService.search
export const useSearchQuery = (query: string) =>
  useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      // Mock delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Return placeholder data
      return {
        people: [
          {
            name: 'Edward Ford',
            location: 'Los Angeles, CA',
            avatar: 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png',
          },
          {
            name: 'Sophia Patel',
            location: 'New York, NY',
            avatar: 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png',
          },
          {
            name: 'Marcus Lee',
            location: 'San Francisco, CA',
            avatar: 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png',
          },
          {
            name: 'Aisha Rahman',
            location: 'Chicago, IL',
            avatar: 'https://res.cloudinary.com/dogyotgp5/image/upload/v1713078910/avatar-dummy-social-app_fx9x9f.png',
          },
        ],
        posts: [],
      };
    },
    enabled: true, // For now enable so it shows results
  });
