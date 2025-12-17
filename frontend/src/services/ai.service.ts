
import apiClient from './api.client';

export interface PredictionData {
    date: string;
    revenue: number;
    patients: number;
}

export interface PredictionResponse {
    status: string;
    data: PredictionData[];
    message?: string;
}

export interface ChatResponse {
    status: string;
    reply: string;
}

export const aiService = {
    async getPrediction(): Promise<PredictionResponse> {
        const response = await apiClient.get('/ai/predict');
        return response.data;
    },

    async chatWithTika(message: string, userName: string = 'User'): Promise<ChatResponse> {
        const response = await apiClient.post('/ai/chat', { message, user_name: userName });
        return response.data;
    }
};
