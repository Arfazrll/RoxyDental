
'use client';

import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { aiService, PredictionData } from '../services/ai.service';

export default function PredictionChart() {
    const [data, setData] = useState<PredictionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPrediction();
    }, []);

    const fetchPrediction = async () => {
        try {
            const response = await aiService.getPrediction();
            if (response.status === 'success' || response.status === 'warning') {
                setData(response.data);
            } else {
                setError('Gagal memuat prediksi');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat memuat prediksi');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading prediction...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (data.length === 0) return <div>Data prediksi belum tersedia (butuh minimal 5 minggu data)</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Prediksi 4 Minggu ke Depan</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8884d8"
                            name="Revenue (Rp)"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="patients"
                            stroke="#82ca9d"
                            name="Jumlah Pasien"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
