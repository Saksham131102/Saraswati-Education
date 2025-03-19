import { useQuery } from "@tanstack/react-query";
import { courseAPI, announcementAPI, teamAPI, testimonialAPI, videoAPI } from "../services/api";

// Common function to extract data from different response formats
const extractData = (response: any) => {
  if (response && response.data && Array.isArray(response.data)) {
    return response.data;
  } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else if (Array.isArray(response)) {
    return response;
  }
  return [];
};

// Courses hooks
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses-list'],
    queryFn: async () => {
      const response = await courseAPI.getAll();
      return extractData(response);
    },
    staleTime: Infinity,
  });
};

export const useCourse = (id: string) => {
  return useQuery({
    queryKey: ['course-detail', id],
    queryFn: async () => {
      const response = await courseAPI.getById(id);
      return response.data || response;
    },
    enabled: !!id,
    staleTime: Infinity,
  });
};

// Announcements hooks
export const useAnnouncements = (category: string = '') => {
  return useQuery({
    queryKey: ['announcements-list', category],
    queryFn: async () => {
      const response = await announcementAPI.getAll(category);
      return extractData(response);
    },
    staleTime: 1000 * 60 * 10,
  });
};

export const useAnnouncement = (id: string) => {
  return useQuery({
    queryKey: ['announcement-detail', id],
    queryFn: async () => {
      const response = await announcementAPI.getById(id);
      return response.data || response;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

// Team members hooks
export const useTeamMembers = (type: string = 'team') => {
  return useQuery({
    queryKey: ['team-members', type],
    queryFn: async () => {
      const response = await teamAPI.getAll({ type });
      return extractData(response);
    },
    staleTime: Infinity,
  });
};

export const useTeamMember = (id: string) => {
  return useQuery({
    queryKey: ['team-member-detail', id],
    queryFn: async () => {
      const response = await teamAPI.getById(id);
      return response.data || response;
    },
    enabled: !!id,
    staleTime: Infinity,
  });
};

// Testimonials hooks
export const useTestimonials = (options: { limit?: number, sort?: string } = {}) => {
  return useQuery({
    queryKey: ['testimonials-list', JSON.stringify(options)],
    queryFn: async () => {
      const response = await testimonialAPI.getAll({
        ...options,
        filters: {
          isActive: true,
          isApproved: true
        }
      });
      return extractData(response);
    },
    staleTime: 1000 * 60 * 10,
  });
};

// Videos hooks
export const useVideos = (options: { limit?: number, featured?: boolean } = {}) => {
  return useQuery({
    queryKey: ['videos-list', JSON.stringify(options)],
    queryFn: async () => {
      const response = await videoAPI.getAll({
        limit: options.limit,
        filters: {
          isActive: true,
          ...(options.featured ? { featured: true } : {})
        }
      });
      return extractData(response);
    },
    staleTime: Infinity,
  });
}; 