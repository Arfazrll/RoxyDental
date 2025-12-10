import apiClient from './api.client';

export interface FinanceReport {
  id: string;
  tipe: string;
  nama: string;
  prosedur?: string;
  potongan: number;
  bhpHarga: number;
  bhpKomisi: number;
  farmasiHarga: number;
  farmasiKomisi: number;
  paketHarga: number;
  paketKomisi: number;
  labHarga: number;
  labKomisi: number;
}

export interface Procedure {
  id: string;
  name: string;
  code: string;
  quantity: number;
  salePrice: number;
  avgComm: number;
  totalSale: number;
  totalComm: number;
}

export interface Package {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  salePrice: number;
  avgComm: number;
  totalSale: number;
  totalComm: number;
}

export const financeService = {
  async getFinanceReports(search?: string) {
    const params = search ? { search } : {};
    const response = await apiClient.get('/doctor/finance/reports', { params });
    return response.data;
  },

  async createFinanceReport(data: any) {
    const response = await apiClient.post('/doctor/finance/reports', data);
    return response.data;
  },

  async getProcedures(search?: string) {
    const params = search ? { search } : {};
    const response = await apiClient.get('/doctor/finance/procedures', { params });
    return response.data;
  },

  async createProcedure(data: any) {
    const response = await apiClient.post('/doctor/finance/procedures', data);
    return response.data;
  },

  async getPackages(search?: string) {
    const params = search ? { search } : {};
    const response = await apiClient.get('/doctor/finance/packages', { params });
    return response.data;
  },

  async createPackage(data: any) {
    const response = await apiClient.post('/doctor/finance/packages', data);
    return response.data;
  }
};