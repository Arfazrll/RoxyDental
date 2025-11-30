export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  specialization?: string;
  education?: string;
  experience?: string;
  sipNumber?: string;
  sipStartDate?: string;
  sipEndDate?: string;
  profilePhoto?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ScheduleItem {
  day: string;
  start: string;
  end: string;
  location: string;
}

export interface DashboardData {
  totalVisits: number;
  todayVisits: number;
  monthlyVisits: number;
  profile: UserProfile;
  schedules: ScheduleItem[];
  practiceStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
  sipRemaining: {
    percentage: number;
    years: number;
    months: number;
    days: number;
  } | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}