
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

    // Calculate Summary Stats
    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const avgRevenue = totalRevenue / data.length;
    const totalPatients = data.reduce((acc, curr) => acc + curr.patients, 0);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Prediksi Kinerja Klinik (4 Minggu ke Depan)</h3>

            <div className="h-[300px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(date) => new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                        />
                        <YAxis
                            yAxisId="left"
                            tickFormatter={(value) => `Rp ${value / 1000000}jt`}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                name === 'Revenue (Rp)' ? formatCurrency(value) : value,
                                name === 'Revenue (Rp)' ? 'Pendapatan' : 'Pasien'
                            ]}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#E91E63"
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                            name="Revenue (Rp)"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="patients"
                            stroke="#10B981"
                            strokeWidth={3}
                            name="Jumlah Pasien"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* AI Insights / Explanation Section */}
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🤖</span>
                    <h4 className="font-bold text-purple-900">Analisis & Prediksi AI</h4>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                    Berdasarkan tren data historis Anda, AI memprediksi bahwa dalam <strong>4 minggu ke depan</strong>:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Estimasi Total Pendapatan</p>
                        <p className="text-lg font-bold text-purple-700">{formatCurrency(totalRevenue)}</p>
                        <p className="text-xs text-gray-400 mt-1">Rata-rata {formatCurrency(avgRevenue)} / minggu</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-green-100">
                        <p className="text-xs text-gray-500 uppercase font-semibold">Estimasi Total Pasien</p>
                        <p className="text-lg font-bold text-green-700">{Math.round(totalPatients)} Orang</p>
                        <p className="text-xs text-gray-400 mt-1">~{Math.round(totalPatients / data.length)} pasien / minggu</p>
                    </div>
                </div>

                <p className="text-xs text-gray-500 italic mt-2 border-t border-purple-200 pt-2">
                    *Prediksi ini dihitung menggunakan metode <em>Holt-Winters Exponential Smoothing</em> berdasarkan pola kunjungan masa lalu.
                </p>
            </div>
        </div>
    );
}
