import apiClient from './api.client';

export interface LeaveRequest {
  reason: string;
  startDate: string;
  endDate: string;
  leaveType?: string;
}

export interface LeaveResponse {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: string;
  status: string;
  createdAt: string;
  rejectionReason?: string;
  requester: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  approver?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  type: string;
  status: string;
  userName?: string;
  patientName?: string;
  doctorName?: string;
  nurseName?: string;
  color: string;
}

class CalendarService {
  async getMyLeaves(): Promise<{ data: LeaveResponse[] }> {
    const response = await apiClient.get('/calendar/my-leaves');
    return response.data;
  }

  async getAllLeaves(): Promise<{ data: LeaveResponse[] }> {
    const response = await apiClient.get('/calendar/leaves');
    return response.data;
  }

  async getPendingLeaves(): Promise<{ data: LeaveResponse[] }> {
    const response = await apiClient.get('/calendar/pending-leaves');
    return response.data;
  }

  async submitLeaveRequest(data: LeaveRequest): Promise<{ data: LeaveResponse }> {
    const response = await apiClient.post('/calendar/leave', data);
    return response.data;
  }

  async updateLeave(id: string, data: Partial<LeaveRequest>): Promise<{ data: LeaveResponse }> {
    const response = await apiClient.put(`/calendar/leave/${id}`, data);
    return response.data;
  }

  async deleteLeave(id: string): Promise<void> {
    await apiClient.delete(`/calendar/leave/${id}`);
  }

  async approveLeave(id: string): Promise<{ data: LeaveResponse }> {
    const response = await apiClient.post(`/calendar/leave/${id}/approve`);
    return response.data;
  }

  async rejectLeave(id: string, rejectionReason: string): Promise<{ data: LeaveResponse }> {
    const response = await apiClient.post(`/calendar/leave/${id}/reject`, { rejectionReason });
    return response.data;
  }

  async getEvents(startDate: string, endDate: string): Promise<{ data: CalendarEvent[] }> {
    const response = await apiClient.get('/calendar/events', {
      params: { startDate, endDate }
    });
    return response.data;
  }

  async getMyEvents(startDate: string, endDate: string): Promise<{ data: CalendarEvent[] }> {
    const response = await apiClient.get('/calendar/my-events', {
      params: { startDate, endDate }
    });
    return response.data;
  }
}

export const calendarService = new CalendarService();