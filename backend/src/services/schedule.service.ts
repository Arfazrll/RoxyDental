import { prisma } from '../config/database';
import { ScheduleType } from '@prisma/client';

interface CreateScheduleData {
  title: string;
  description?: string;
  scheduleType: ScheduleType;
  startDatetime: string;
  endDatetime: string;
  location?: string;
  isRecurring?: boolean;
  recurrencePattern?: string;
}

export class ScheduleService {
  async getSchedules(userId: string, type?: ScheduleType) {
    const where: any = { userId };
    if (type) {
      where.scheduleType = type;
    }

    const schedules = await prisma.schedule.findMany({
      where,
      orderBy: {
        startDatetime: 'asc'
      }
    });

    return schedules;
  }

  async createSchedule(userId: string, data: CreateScheduleData) {
    const schedule = await prisma.schedule.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        scheduleType: data.scheduleType,
        startDatetime: new Date(data.startDatetime),
        endDatetime: new Date(data.endDatetime),
        location: data.location,
        isRecurring: data.isRecurring || false,
        recurrencePattern: data.recurrencePattern
      }
    });

    return schedule;
  }

  async getActivities(userId: string) {
    return this.getSchedules(userId, ScheduleType.ACTIVITY);
  }

  async getMeetings(userId: string) {
    return this.getSchedules(userId, ScheduleType.MEETING);
  }
}