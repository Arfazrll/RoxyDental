import apiClient from './api.client';
import { DashboardData, ApiResponse } from '@/types/user';

export const dashboardService = {
  async getDoctorSummary(): Promise<ApiResponse<DashboardData>> {
    const response = await apiClient.get('/doctor/dashboard/summary');
    return response.data;
  }
};

