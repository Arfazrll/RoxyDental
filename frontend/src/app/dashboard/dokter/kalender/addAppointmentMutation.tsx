"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbardr";

interface Leave {
  id: number;
  title: string;
  startDate: string; // yyyy-mm-dd
  endDate: string; // yyyy-mm-dd
  color: string;
}

export default function CutiDoctorView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [leaves, setLeaves] = useState<Leave[]>([
    {
      id: 1,
      title: "Cuti dr. Sarah Aminah",
      startDate: "2025-10-30",
      endDate: "2025-11-02",
      color: "bg-pink-200",
    },
  ]);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    color: "bg-pink-200",
  });

  const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"
  ];

  const generateCalendarDates = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const dates: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) dates.push(null);
    for (let i = 1; i <= daysInMonth; i++) dates.push(i);
    return dates;
  };
  const calendarDates = generateCalendarDates();

  const navigateMonth = (dir: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() + dir);
    setSelectedMonth(newDate);
  };

  const handleSaveLeave = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) return;
    const newLeave: Leave = {
      id: leaves.length + 1,
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      color: formData.color,
    };
    setLeaves((prev) => [...prev, newLeave]);
    setAddDialogOpen(false);
    setFormData({ title: "", startDate: "", endDate: "", color: "bg-pink-200" });
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-pink-900">
      <DoctorNavbar />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Button size="sm" variant="ghost" onClick={() => navigateMonth(-1)} className="hover:bg-pink-100 p-2 rounded">
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="text-lg font-semibold">{monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}</div>
                <Button size="sm" variant="ghost" onClick={() => navigateMonth(1)} className="hover:bg-pink-100 p-2 rounded">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {dayNames.map((d) => (
                  <div key={d} className="font-semibold py-2">{d}</div>
                ))}

                {calendarDates.map((date, idx) => {
                  const dateStr = date ? `${selectedMonth.getFullYear()}-${(selectedMonth.getMonth()+1).toString().padStart(2,'0')}-${date.toString().padStart(2,'0')}` : "";
                  const leaveToday = leaves.find(l => dateStr >= l.startDate && dateStr <= l.endDate);

                  return (
                    <div
                      key={idx}
                      className={`py-2 cursor-pointer rounded transition ${leaveToday ? leaveToday.color + " text-white font-bold" : "text-pink-900"}`}
                    >
                      {date || ""}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-md rounded-lg">
            <CardContent className="p-4 max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-pink-100 space-y-3">
              <h3 className="font-semibold text-pink-900">Pengajuan Cuti</h3>
              {leaves.map(l => (
                <div key={l.id} className={`${l.color} text-pink-900 p-3 rounded-lg shadow hover:shadow-md transition cursor-pointer`}>
                  <div className="font-semibold text-sm">{l.title}</div>
                  <div className="text-[10px] mt-1">Dari: {l.startDate} Sampai: {l.endDate}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white gap-2 shadow hover:scale-105 transition flex items-center justify-center" onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-5 h-5" /> Ajukan Cuti
          </Button>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md bg-pink-50 rounded-lg shadow-lg p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-pink-900 font-bold text-lg">Form Pengajuan Cuti</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-pink-900">Judul Cuti</Label>
              <Input placeholder="Alasan cuti" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="border-pink-300 focus:border-pink-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-pink-900">Tanggal Mulai</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div>
                <Label className="text-pink-900">Tanggal Selesai</Label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50" onClick={() => setAddDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-gradient-to-r from-pink-500 to-pink-700 text-white shadow hover:scale-105 transition" onClick={handleSaveLeave}>
                Ajukan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
