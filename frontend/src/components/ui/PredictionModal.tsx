"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Users, X, AlertTriangle, Activity, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { aiService, PredictionData } from "@/services/ai.service";

interface Props {
  onClose: () => void;
}

export default function PredictionModal({ onClose }: Props) {
  const [data, setData] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    try {
      const response = await aiService.getPrediction();
      
      if (response.status === "success" || response.status === "warning") {
        setData(response.data);
        if (response.data.length === 0 && response.message) {
          setError(response.message);
        }
      } else {
        setError(response.message || "Gagal memuat prediksi");
      }
    } catch (err: any) {
      console.error('Prediction fetch error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Tidak dapat terhubung ke layanan prediksi"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  if (loading) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-brrom-black/60 via-purple-900/20 to-pink-900/20 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white/95 backdrop-blur-xl px-10 py-8 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-600 absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <span className="text-gray-800 font-semibold text-lg">Memuat prediksi...</span>
            <p className="text-gray-500 text-sm mt-1">Menganalisis data klinik Anda</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-br from-black/60 via-red-900/20 to-orange-900/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <Card className="w-full max-w-md rounded-3xl shadow-2xl border-0 overflow-hidden animate-in zoom-in duration-300">
          <CardHeader className="bg-linear-to-r from-red-500 via-red-600 to-rose-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-white/20 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              Prediksi Tidak Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 bg-linear-to-b from-white to-gray-50">
            <div className="bg-linear-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
            
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-sm">
              <p className="text-blue-900 font-bold text-sm mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Langkah Troubleshooting:
              </p>
              <ol className="text-blue-800 text-xs space-y-2 list-decimal list-inside ml-2">
                <li className="leading-relaxed">Pastikan AI Service berjalan di terminal terpisah</li>
                <li className="leading-relaxed">Jalankan: <code className="bg-blue-200/50 px-2 py-0.5 rounded font-mono text-xs">cd roxydental-ai && uvicorn api:app --reload</code></li>
                <li className="leading-relaxed">Pastikan minimal 5 minggu data transaksi tersedia</li>
                <li className="leading-relaxed">Cek koneksi database di file .env</li>
              </ol>
            </div>

            <Button 
              onClick={onClose} 
              className="w-full bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-6 rounded-xl font-semibold"
            >
              Tutup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-br from-black/60 via-yellow-900/20 to-orange-900/20 backdrop-blur-md p-4 animate-in fade-in duration-300">
        <Card className="w-full max-w-md rounded-3xl shadow-2xl border-0 overflow-hidden animate-in zoom-in duration-300">
          <CardHeader className="bg-linear-to-r from-yellow-500 via-yellow-600 to-amber-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-white/20 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              Data Belum Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 bg-linear-to-b from-white to-gray-50">
            <div className="bg-linear-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-500 rounded-lg p-4 shadow-sm">
              <p className="text-gray-800 font-medium leading-relaxed">
                Data transaksi belum mencukupi untuk membuat prediksi. 
                Minimal 5 minggu data historis diperlukan.
              </p>
            </div>
            <Button 
              onClick={onClose} 
              className="w-full bg-linear-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-6 rounded-xl font-semibold"
            >
              Tutup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRevenue = data.reduce((a, c) => a + c.revenue, 0);
  const avgRevenue = totalRevenue / data.length;
  const totalPatients = data.reduce((a, c) => a + c.patients, 0);
  const avgPatients = totalPatients / data.length;

  return (
    <div className="fixed inset-0 z-9999 bg-linear-to-br from-black/60 via-purple-900/30 to-pink-900/30 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl relative pointer-events-auto rounded-3xl shadow-2xl border-0 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in duration-300">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white hover:text-gray-200 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 backdrop-blur-md transition-all duration-200 hover:scale-110 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader className="bg-linear-to-r from-pink-500 via-pink-600 to-rose-600 text-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Prediksi Kinerja Klinik</CardTitle>
              <p className="text-white/80 text-sm mt-1">Analisis AI untuk 4 minggu ke depan</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto flex-1 bg-linear-to-b from-pink-50/30 via-rose-50/20 to-pink-50/30">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-linear-to-br from-pink-500 to-rose-600 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <Calendar className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-white/90 text-sm font-medium mb-1">Total Pendapatan</p>
              <p className="text-2xl font-bold mb-1">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-white/70">4 minggu ke depan</p>
            </div>

            <div className="bg-linear-to-br from-rose-400 to-pink-500 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Users className="w-5 h-5" />
                </div>
                <Activity className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-white/90 text-sm font-medium mb-1">Total Pasien</p>
              <p className="text-2xl font-bold mb-1">{Math.round(totalPatients)} orang</p>
              <p className="text-xs text-white/70">4 minggu ke depan</p>
            </div>

            <div className="bg-linear-to-br from-pink-600 to-rose-700 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <TrendingUp className="w-5 h-5 opacity-60" />
              </div>
              <p className="text-white/90 text-sm font-medium mb-1">Rata-rata/Minggu</p>
              <p className="text-2xl font-bold mb-1">{formatCurrency(avgRevenue)}</p>
              <p className="text-xs text-white/70">~{Math.round(avgPatients)} pasien</p>
            </div>
          </div>

          {/* Chart Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-600" />
              Grafik Prediksi
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E91E63" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#E91E63" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                      })
                    }
                    stroke="#888"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) => `${v / 1_000_000}jt`}
                    stroke="#E91E63"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#10B981"
                    style={{ fontSize: '12px' }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      padding: '12px'
                    }}
                    formatter={(value, name) => {
                      const safeValue = typeof value === "number" ? value : 0;
                      return [
                        name === "Revenue (Rp)"
                          ? formatCurrency(safeValue)
                          : safeValue,
                        name === "Revenue (Rp)" ? "Pendapatan" : "Pasien",
                      ];
                    }}
                  />

                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />

                  <Line
                    yAxisId="left"
                    dataKey="revenue"
                    stroke="#E91E63"
                    strokeWidth={3}
                    name="Revenue (Rp)"
                    dot={{ fill: '#E91E63', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                    fill="url(#colorRevenue)"
                  />
                  <Line
                    yAxisId="right"
                    dataKey="patients"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Jumlah Pasien"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                    fill="url(#colorPatients)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Breakdown */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-pink-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-600" />
              Rincian Per Minggu
            </h3>
            <div className="space-y-3">
              {data.map((week, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 bg-linear-to-r from-pink-50/50 to-rose-50/50 rounded-xl border border-pink-100 hover:border-pink-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-linear-to-br from-pink-500 to-rose-600 text-white font-bold w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {new Date(week.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                      <p className="text-sm text-gray-500">Minggu ke-{idx + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-pink-600">{formatCurrency(week.revenue)}</p>
                    <p className="text-sm text-gray-600">{Math.round(week.patients)} pasien</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-linear-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 py-6 rounded-xl font-semibold text-lg"
          >
            Tutup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}