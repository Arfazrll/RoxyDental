"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbarpr";

interface Leave {
  id: number;
  doctor: string;
  reason: string;
  startDate: string;
  endDate: string;
  color: string;
  type: "Cuti" | "Jadwal";
}

export default function CalendarDoctorView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formType, setFormType] = useState<"Cuti" | "Jadwal">("Cuti");
  const [formData, setFormData] = useState({ doctor: "", reason: "", startDate: "", endDate: "" });
  const [leaves, setLeaves] = useState<Leave[]>([
    { id: 1, doctor: "dr. Sarah Aminah", reason: "Libur pribadi", startDate: "2025-10-30", endDate: "2025-11-02", color: "bg-pink-200", type: "Cuti" },
  ]);

  const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
  const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  // ===== Calendar Dates =====
  const generateCalendarDates = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates: (number | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) dates.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) dates.push(i);
    return dates;
  };
  const calendarDates = generateCalendarDates();

  // ===== Weekly View =====
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2,"0")}:00`);
  const getWeekDays = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });
  };
  const [weekDays, setWeekDays] = useState(getWeekDays(currentDate));

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  // ===== Mini calendar navigation (tidak buka dialog) =====
  const handleMiniCalendarClick = (date: Date) => {
    setCurrentDate(date);
    setWeekDays(getWeekDays(date));
    setSelectedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  // ===== Main calendar click untuk pengajuan =====
  const handleMainCalendarClick = (date: Date) => {
    setCurrentDate(date);
    setWeekDays(getWeekDays(date));
    setFormData({ ...formData, startDate: formatDate(date), endDate: formatDate(date) });
    setAddDialogOpen(true);
  };

  const getLeavesForDay = (date: Date) => {
    const dateStr = formatDate(date);
    return leaves.filter(l => dateStr >= l.startDate && dateStr <= l.endDate);
  };

  const hasLeaveOnDate = (dateStr: string, type: "Cuti"|"Jadwal") => {
    return leaves.some(l => dateStr >= l.startDate && dateStr <= l.endDate && l.type === type);
  };

  const handleSaveLeave = () => {
    if (!formData.doctor || !formData.startDate || !formData.endDate) return;
    const newLeave: Leave = {
      id: leaves.length + 1,
      doctor: formData.doctor,
      reason: formData.reason,
      startDate: formData.startDate,
      endDate: formData.endDate,
      color: formType === "Cuti" ? "bg-pink-200" : "bg-green-200",
      type: formType
    };
    setLeaves(prev => [...prev, newLeave]);
    setAddDialogOpen(false);
    setFormData({ doctor: "", reason: "", startDate: "", endDate: "" });
    setFormType("Cuti");
  };

  const navigateWeek = (dir: number) => { 
    const newDate = new Date(currentDate); 
    newDate.setDate(currentDate.getDate() + dir * 7); 
    setCurrentDate(newDate); 
    setWeekDays(getWeekDays(newDate));
  };

  const navigateMonth = (dir: number) => { 
    const newDate = new Date(selectedMonth); 
    newDate.setMonth(selectedMonth.getMonth() + dir); 
    setSelectedMonth(newDate); 
  };

  useEffect(() => { setWeekDays(getWeekDays(currentDate)); }, [currentDate]);

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-pink-900">
      <DoctorNavbar />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">

        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 mt-6">
                  <Button size="sm" variant="ghost" onClick={() => navigateWeek(-1)} className="hover:bg-pink-100 p-2 rounded mt-3"><ChevronLeft className="w-5 h-5" /></Button>
                  <div className="text-lg font-semibold">
                    {weekDays[0].getDate()} {monthNames[weekDays[0].getMonth()]} - {weekDays[6].getDate()} {monthNames[weekDays[6].getMonth()]} {weekDays[0].getFullYear()}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => navigateWeek(1)} className="hover:bg-pink-100 p-2 rounded"><ChevronRight className="w-5 h-5" /></Button>
                </div>
                <Button size="sm" variant="outline" className="gap-2 border-pink-300 text-pink-700 hover:bg-pink-50" onClick={() => setAddDialogOpen(true)}>
                  <Calendar className="w-4 h-4" /> Pengajuan
                </Button>
              </div>

              <div className="overflow-auto max-h-[640px] border border-pink-200 rounded-lg bg-white">
                <div className="grid grid-cols-8 min-w-[980px]">
                  <div className="sticky top-0 left-0 z-30 border-r border-b border-pink-200 bg-pink-50 p-3"></div>
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="sticky top-0 z-20 border-r border-b border-pink-200 bg-pink-100 p-3 text-center">
                      <div className="text-xs font-medium uppercase">{dayNames[day.getDay()]}</div>
                      <div className="text-base font-bold mt-1">{day.getDate()} {monthNames[day.getMonth()].slice(0,3)}</div>
                    </div>
                  ))}

                  {timeSlots.map((time, tIdx) => (
                    <React.Fragment key={tIdx}>
                      <div className="sticky left-0 z-20 border-r border-b border-pink-200 bg-pink-50 p-2 text-xs text-right font-medium min-h-16">{time}</div>
                      {weekDays.map((day, dIdx) => {
                        const dayLeaves = getLeavesForDay(day);
                        return (
                          <div key={`${tIdx}-${dIdx}`} className="border-r border-b border-pink-200 p-1.5 min-h-16 relative hover:bg-pink-50 transition cursor-pointer" onClick={() => handleMainCalendarClick(day)}>
                            {dayLeaves.map(l => (
                              <div key={l.id} className={`${l.color} text-pink-900 text-xs p-1.5 rounded-lg shadow-md w-full max-w-[200px] mb-1.5`}>
                                <div className="font-semibold text-[11px]">{l.doctor}</div>
                                <div className="text-[10px] mt-0.5">{l.reason}</div>
                                <div className="text-[10px] mt-0.5">Dari: {l.startDate} Sampai: {l.endDate}</div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <Card className="shadow-md rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3 gap-2">
                <select value={selectedMonth.getMonth()} onChange={e => { const newDate = new Date(selectedMonth); newDate.setMonth(parseInt(e.target.value)); setSelectedMonth(newDate); }} className="border border-pink-300 rounded px-2 py-1 text-sm mt-5">
                  {monthNames.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
                </select>

                <input type="number" value={selectedMonth.getFullYear()} onChange={e => { const newDate = new Date(selectedMonth); newDate.setFullYear(parseInt(e.target.value)); setSelectedMonth(newDate); }} className="border border-pink-300 rounded px-2 py-1 text-sm w-20 mt-5" />
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs mt-2">
                {dayNames.map(d => <div key={d} className="font-semibold py-2">{d}</div>)}
                {calendarDates.map((date, idx) => {
                  const dateStr = `${selectedMonth.getFullYear()}-${(selectedMonth.getMonth()+1).toString().padStart(2,'0')}-${date?.toString().padStart(2,'0')}`;
                  const isSelected = currentDate.getDate() === date && selectedMonth.getMonth() === currentDate.getMonth();
                  return (
                    <div
                      key={idx}
                      className={`py-2 cursor-pointer hover:bg-pink-200 rounded transition relative ${isSelected ? "bg-pink-600 text-white font-bold" : date ? "text-pink-900" : "text-pink-300"}`}
                      onClick={() => { if(date) handleMiniCalendarClick(new Date(dateStr)); }}
                    >
                      {date || ""}
                      {date && hasLeaveOnDate(dateStr, "Cuti") && <div className="w-2 h-2 bg-pink-500 rounded-full absolute top-1 right-1"></div>}
                      {date && hasLeaveOnDate(dateStr, "Jadwal") && <div className="w-2 h-2 bg-green-500 rounded-full absolute top-1 left-1"></div>}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Jadwal List */}
          <Card className="shadow-md rounded-lg">
            <CardContent className="p-4 max-h-[300px] overflow-auto scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-pink-100 space-y-2">
              <h2 className="font-semibold text-pink-900 mt-6 flex items-center gap-2 text-lg">
                <span className="w-1.5 h-6 bg-pink-500 rounded"></span> Jadwal
              </h2>
              {leaves.length === 0 && <div className="text-xs text-pink-700">Belum ada jadwal</div>}
              {leaves.map(l => (
                <div key={l.id} className={`${l.color} text-pink-900 p-2 rounded-lg shadow mb-2`}>
                  <div className="font-semibold text-sm">{l.doctor}</div>
                  <div className="text-[10px] mt-0.5">{l.reason}</div>
                  <div className="text-[10px] mt-0.5">Dari: {l.startDate} Sampai: {l.endDate}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Pengajuan */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md bg-pink-50 rounded-lg shadow-lg p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-pink-900 font-bold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" /> Ajukan {formType === "Cuti" ? "Cuti" : "Jadwal"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-pink-900">Nama</Label>
              <Input placeholder="Masukkan nama dokter" value={formData.doctor} onChange={e=>setFormData({...formData, doctor:e.target.value})} className="border-pink-300 focus:border-pink-500"/>
            </div>
            <div>
              <Label className="text-pink-900">Jenis Pengajuan</Label>
              <Select value={formType} onValueChange={(v: "Cuti"|"Jadwal") => setFormType(v)}>
                <SelectTrigger className="border-pink-300 focus:border-pink-500"><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cuti">Cuti</SelectItem>
                  <SelectItem value="Jadwal">Jadwal Khusus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-pink-900">{formType === "Cuti" ? "Alasan Cuti" : "Keterangan Jadwal"}</Label>
              <Input placeholder={formType === "Cuti" ? "Masukkan alasan cuti" : "Masukkan keterangan jadwal"} value={formData.reason} onChange={e=>setFormData({...formData, reason:e.target.value})} className="border-pink-300 focus:border-pink-500"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-pink-900">Tanggal Mulai</Label>
                <Input type="date" value={formData.startDate} onChange={e=>setFormData({...formData,startDate:e.target.value})}/>
              </div>
              <div>
                <Label className="text-pink-900">Tanggal Selesai</Label>
                <Input type="date" value={formData.endDate} onChange={e=>setFormData({...formData,endDate:e.target.value})}/>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50" onClick={()=>setAddDialogOpen(false)}>Batal</Button>
              <Button className={`text-white shadow hover:scale-105 transition ${formType==="Cuti" ? "bg-linear-to-r from-pink-500 to-pink-700" : "bg-linear-to-r from-pink-500 to-pink-700"}`} onClick={handleSaveLeave}>Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
