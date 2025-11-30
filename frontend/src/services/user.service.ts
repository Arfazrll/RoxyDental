import apiClient from './api.client';
import { UserProfile, ApiResponse } from '@/types/user';

export const userService = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  }
};