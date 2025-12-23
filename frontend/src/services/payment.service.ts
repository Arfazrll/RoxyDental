import apiClient from './api.client';

export type PaymentMethodType = 'CASH' | 'TRANSFER' | 'CARD' | 'QRIS';
export type PaymentStatusType = 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED';

export interface CreatePaymentData {
  visitId: string;
  paymentMethod: PaymentMethodType;
  amount: number;
  paidAmount: number;
  referenceNumber?: string;
  notes?: string;
}

export interface UpdatePaymentData {
  paymentMethod?: PaymentMethodType;
  amount?: number;
  paidAmount?: number;
  referenceNumber?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  visitId: string;
  paymentNumber: string;
  paymentDate: string;
  paymentMethod: PaymentMethodType;
  amount: number;
  paidAmount: number;
  changeAmount: number;
  status: PaymentStatusType;
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  visit: {
    id: string;
    visitNumber: string;
    visitDate: string;
    patient: {
      id: string;
      patientNumber: string;
      medicalRecordNumber: string | null;
      fullName: string;
    };
  };
}

export const paymentService = {
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    const response = await apiClient.post('/payments', data);
    return response.data.data;
  },

  async updatePayment(id: string, data: UpdatePaymentData): Promise<Payment> {
    const response = await apiClient.put(`/payments/${id}`, data);
    return response.data.data;
  },

  async getAllPayments(search?: string): Promise<Payment[]> {
    const params = search ? { search } : {};
    const response = await apiClient.get('/payments', { params });
    return response.data.data;
  },

  async getPaymentsByVisit(visitId: string): Promise<Payment[]> {
    const response = await apiClient.get(`/payments/visit/${visitId}`);
    return response.data.data;
  },

  async getPaymentById(id: string): Promise<Payment> {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data.data;
  }
};