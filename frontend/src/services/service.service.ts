import apiClient from './api.client';

export const serviceService = {
  async getServices(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) {
    const response = await apiClient.get('/services', { params });
    return response.data;
  },

  async getServiceById(id: string) {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  }
};