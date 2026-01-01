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
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-white px-10 py-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-100"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#E91E8C] absolute top-0 left-0"></div>
          </div>
          <div className="text-center">
            <span className="text-slate-800 font-semibold text-lg">Memuat prediksi...</span>
            <p className="text-slate-500 text-sm mt-1">Menganalisis data klinik Anda</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <Card className="w-full max-w-md rounded-2xl shadow-xl border-0 overflow-hidden animate-in zoom-in duration-300">
          <CardHeader className="bg-linear-to-r from-red-600 to-red-700 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-white/20 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              Prediksi Tidak Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 bg-white">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
              <p className="text-blue-900 font-semibold text-sm mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Langkah Troubleshooting:
              </p>
              <ol className="text-blue-800 text-xs space-y-2 list-decimal list-inside ml-2">
                <li className="leading-relaxed">Pastikan AI Service berjalan di terminal terpisah</li>
                <li className="leading-relaxed">Jalankan: <code className="bg-blue-100 px-2 py-0.5 rounded font-mono text-xs">cd roxydental-ai && uvicorn api:app --reload</code></li>
                <li className="leading-relaxed">Pastikan minimal 5 minggu data transaksi tersedia</li>
                <li className="leading-relaxed">Cek koneksi database di file .env</li>
              </ol>
            </div>

            <Button 
              onClick={onClose} 
              className="w-full bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 py-6 rounded-lg font-medium"
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
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <Card className="w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in zoom-in duration-300">
          <CardHeader className="bg-linear-to-r from-amber-500 to-amber-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="bg-white/20 p-2 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              Data Belum Tersedia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 bg-white">
            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4">
              <p className="text-slate-800 font-medium leading-relaxed">
                Data transaksi belum mencukupi untuk membuat prediksi. 
                Minimal 5 minggu data historis diperlukan.
              </p>
            </div>
            <Button 
              onClick={onClose} 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md transition-all duration-200 py-6 rounded-lg font-medium"
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
    <div className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-4xl relative pointer-events-auto rounded-2xl shadow-xl border-0 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in duration-300">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-slate-200 z-10 bg-white/20 hover:bg-white/30 rounded-lg p-2 backdrop-blur-md transition-all duration-200 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader className="bg-linear-to-r from-[#E91E8C] via-[#D91A7E] to-[#C91670] text-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold text-white">Prediksi Kinerja Klinik</CardTitle>
              <p className="text-pink-100 text-sm mt-1">Analisis AI untuk 4 minggu ke depan</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6 overflow-y-auto flex-1 bg-linear-to-b from-slate-50 to-white">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-pink-50 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-[#E91E8C]" />
                </div>
                <Calendar className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Pendapatan</p>
              <p className="text-2xl font-bold text-slate-800 mb-1">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-slate-500">4 minggu ke depan</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-pink-50 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-[#E91E8C]" />
                </div>
                <Activity className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Total Pasien</p>
              <p className="text-2xl font-bold text-slate-800 mb-1">{Math.round(totalPatients)} orang</p>
              <p className="text-xs text-slate-500">4 minggu ke depan</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-pink-50 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5 text-[#E91E8C]" />
                </div>
                <TrendingUp className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1">Rata-rata/Minggu</p>
              <p className="text-2xl font-bold text-slate-800 mb-1">{formatCurrency(avgRevenue)}</p>
              <p className="text-xs text-slate-500">~{Math.round(avgPatients)} pasien</p>
            </div>
          </div>

          {/* Chart Container */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#E91E8C]" />
              Grafik Prediksi
            </h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#E91E8C" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D91A7E" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#D91A7E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                      })
                    }
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) => `${v / 1_000_000}jt`}
                    stroke="#E91E8C"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#D91A7E"
                    style={{ fontSize: '12px' }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: '1px solid #fbcfe8',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(233,30,140,0.1)',
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
                    stroke="#E91E8C"
                    strokeWidth={2.5}
                    name="Revenue (Rp)"
                    dot={{ fill: '#E91E8C', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    fill="url(#colorRevenue)"
                  />
                  <Line
                    yAxisId="right"
                    dataKey="patients"
                    stroke="#D91A7E"
                    strokeWidth={2.5}
                    name="Jumlah Pasien"
                    dot={{ fill: '#D91A7E', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    fill="url(#colorPatients)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Weekly Breakdown */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#E91E8C]" />
              Rincian Per Minggu
            </h3>
            <div className="space-y-3">
              {data.map((week, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 bg-pink-50/50 rounded-lg hover:bg-pink-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-linear-to-br from-[#E91E8C] to-[#D91A7E] text-white font-semibold w-12 h-12 rounded-lg flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {new Date(week.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </p>
                      <p className="text-sm text-slate-500">Minggu ke-{idx + 1}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-slate-800">{formatCurrency(week.revenue)}</p>
                    <p className="text-sm text-slate-600">{Math.round(week.patients)} pasien</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-linear-to-r from-[#E91E8C] to-[#D91A7E] hover:from-[#D91A7E] hover:to-[#C91670] text-white shadow-sm hover:shadow-md transition-all duration-200 py-6 rounded-lg font-medium text-base"
          >
            Tutup
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}