import apiClient from './api.client';

export interface PatientWithVisit {
  id: string;
  patientNumber: string;
  medicalRecordNumber?: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
  lastVisit?: string;
  lastVisitId?: string;
  lastVisitNumber?: string;
  chiefComplaint?: string;
  lastDiagnosis?: string;
  lastServiceName?: string;
}

export const patientService = {
  async getPatients(page: number = 1, limit: number = 100, search?: string) {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      
      const response = await apiClient.get('/doctor/patients', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  async updateMedicalHistory(patientId: string, medicalHistory: string) {
    const response = await apiClient.put(`/doctor/patients/${patientId}/medical-history`, {
      medicalHistory
    });
    return response.data;
  },

  async getPatientById(id: string) {
    const response = await apiClient.get(`/doctor/patients/${id}`);
    return response.data;
  },

  async createPatient(data: any) {
    const response = await apiClient.post('/doctor/patients', data);
    return response.data;
  }
};