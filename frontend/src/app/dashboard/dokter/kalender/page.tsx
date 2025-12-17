"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Calendar, Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import DoctorNavbar from "@/components/ui/navbardr";
import AuthGuard from "@/components/AuthGuard";
import { calendarService, LeaveRequest, LeaveResponse, CalendarEvent } from "@/services/calendar.service";

interface DisplayEvent {
  id: string;
  doctor: string;
  reason: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  color: string;
  type: "Cuti" | "Kunjungan";
}

function CalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveResponse | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [formData, setFormData] = useState({ reason: "", startDate: "", endDate: "" });
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
  const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

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
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

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

  useEffect(() => {
    fetchEvents();
    fetchPendingLeaves();
  }, [weekDays]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = formatDate(weekDays[0]);
      const endDate = formatDate(weekDays[6]);

      const eventsRes = await calendarService.getEvents(startDate, endDate);

      const mappedEvents: DisplayEvent[] = eventsRes.data.map((event: CalendarEvent) => ({
        id: event.id,
        doctor: event.patientName || event.userName || event.title,
        reason: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime || '00:00',
        endTime: event.endTime || '23:59',
        color: event.color,
        type: event.type === 'LEAVE' ? 'Cuti' : 'Kunjungan'
      }));

      setEvents(mappedEvents);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data kalender');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingLeaves = async () => {
    try {
      const response = await calendarService.getPendingLeaves();
      setPendingLeaves(response.data);
    } catch (err: any) {
      console.error('Error fetching pending leaves:', err);
    }
  };

  const handleMiniCalendarClick = (date: Date) => {
    setCurrentDate(date);
    setWeekDays(getWeekDays(date));
    setSelectedMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const handleMainCalendarClick = (date: Date) => {
    setCurrentDate(date);
    setWeekDays(getWeekDays(date));
    setFormData({ ...formData, startDate: formatDate(date), endDate: formatDate(date) });
    setAddDialogOpen(true);
  };

  const getEventsForTimeSlot = (day: Date, timeSlot: string) => {
    const dateStr = formatDate(day);
    const [slotHour] = timeSlot.split(':').map(Number);
    
    return events.filter(event => {
      if (event.startDate !== dateStr) return false;
      
      if (event.type === 'Cuti') {
        return true;
      }
      
      const [startHour] = event.startTime.split(':').map(Number);
      return startHour === slotHour;
    });
  };

  const hasEventOnDate = (dateStr: string) => {
    return events.some(l => dateStr >= l.startDate && dateStr <= l.endDate);
  };

  const handleSaveLeave = async () => {
    if (!formData.reason || !formData.startDate || !formData.endDate) {
      setError('Mohon lengkapi semua field');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const leaveData: LeaveRequest = {
        reason: formData.reason,
        startDate: formData.startDate,
        endDate: formData.endDate,
        leaveType: 'ANNUAL'
      };

      await calendarService.submitLeaveRequest(leaveData);
      
      setAddDialogOpen(false);
      setFormData({ reason: "", startDate: "", endDate: "" });
      
      await fetchEvents();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan pengajuan cuti');
      console.error('Error submitting leave:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveLeave = async () => {
    if (!selectedLeave) return;

    try {
      setSubmitting(true);
      setError(null);

      await calendarService.approveLeave(selectedLeave.id);
      
      setApproveDialogOpen(false);
      setSelectedLeave(null);
      
      await fetchEvents();
      await fetchPendingLeaves();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyetujui pengajuan cuti');
      console.error('Error approving leave:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectLeave = async () => {
    if (!selectedLeave || !rejectionReason) {
      setError('Alasan penolakan harus diisi');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await calendarService.rejectLeave(selectedLeave.id, rejectionReason);
      
      setRejectDialogOpen(false);
      setSelectedLeave(null);
      setRejectionReason("");
      
      await fetchEvents();
      await fetchPendingLeaves();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menolak pengajuan cuti');
      console.error('Error rejecting leave:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const navigateWeek = (dir: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + dir * 7);
    setCurrentDate(newDate);
    setWeekDays(getWeekDays(newDate));
  };

  useEffect(() => {
    setWeekDays(getWeekDays(currentDate));
  }, [currentDate]);

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-pink-900">
      <DoctorNavbar />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        
        <div className="lg:col-span-3">
          <Card className="shadow-lg rounded-lg">
            <CardContent className="p-4">
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 mt-6">
                  <Button size="sm" variant="ghost" onClick={() => navigateWeek(-1)} className="hover:bg-pink-100 p-2 rounded">
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="text-lg font-semibold">
                    {weekDays[0].getDate()} {monthNames[weekDays[0].getMonth()]} - {weekDays[6].getDate()} {monthNames[weekDays[6].getMonth()]} {weekDays[0].getFullYear()}
                  </div>

                  <Button size="sm" variant="ghost" onClick={() => navigateWeek(1)} className="hover:bg-pink-100 p-2 rounded">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                <Button size="sm" variant="outline" className="gap-2 border-pink-300 text-pink-700 hover:bg-pink-50" onClick={() => setAddDialogOpen(true)}>
                  <Calendar className="w-4 h-4" /> Ajukan Cuti
                </Button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-red-600 text-sm">{error}</p>
                  <Button onClick={fetchEvents} size="sm" className="mt-4 bg-pink-600 hover:bg-pink-700">Coba Lagi</Button>
                </div>
              ) : (
                <div className="overflow-auto max-h-[640px] border border-pink-200 rounded-lg bg-white">
                  <div className="grid grid-cols-8 min-w-[980px]">

                    <div className="sticky top-0 left-0 z-30 bg-pink-50 p-3 border-r border-b border-pink-200"></div>

                    {weekDays.map((day, idx) => (
                      <div key={idx} className="sticky top-0 bg-pink-100 text-center p-3 border-r border-b border-pink-200 z-20">
                        <div className="text-xs font-medium uppercase">{dayNames[day.getDay()]}</div>
                        <div className="text-base font-bold mt-1">{day.getDate()} {monthNames[day.getMonth()].slice(0, 3)}</div>
                      </div>
                    ))}

                    {timeSlots.map((time, tIdx) => (
                      <React.Fragment key={tIdx}>
                        <div className="sticky left-0 z-20 bg-pink-50 p-2 text-xs text-right font-medium min-h-16 border-r border-b border-pink-200">
                          {time}
                        </div>

                        {weekDays.map((day, dIdx) => {
                          const dayEvents = getEventsForTimeSlot(day, time);
                          return (
                            <div key={`${tIdx}-${dIdx}`} className="border-r border-b border-pink-200 p-1.5 min-h-16 relative hover:bg-pink-50 cursor-pointer" onClick={() => handleMainCalendarClick(day)}>
                              {dayEvents.map(l => (
                                <div key={l.id} className={`${l.color} text-pink-900 text-xs p-1.5 rounded-lg shadow-md mb-1.5`}>
                                  <div className="font-semibold text-[11px]">{l.doctor}</div>
                                  <div className="text-[10px]">{l.reason}</div>
                                  <div className="text-[10px]">{l.startTime} - {l.endTime}</div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">

          <Card className="shadow-md rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3 gap-2">
                <select value={selectedMonth.getMonth()} onChange={e => { const newDate = new Date(selectedMonth); newDate.setMonth(parseInt(e.target.value)); setSelectedMonth(newDate); }} className="border border-pink-300 rounded px-2 py-1 text-sm mt-5">
                  {monthNames.map((m, idx) => (<option key={idx} value={idx}>{m}</option>))}
                </select>

                <input type="number" value={selectedMonth.getFullYear()} onChange={e => { const newDate = new Date(selectedMonth); newDate.setFullYear(parseInt(e.target.value)); setSelectedMonth(newDate); }} className="border border-pink-300 rounded px-2 py-1 text-sm w-20 mt-5" />
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs mt-2">
                {dayNames.map(d => (<div key={d} className="font-semibold py-2">{d}</div>))}

                {calendarDates.map((date, idx) => {
                  const dateStr = `${selectedMonth.getFullYear()}-${(selectedMonth.getMonth() + 1).toString().padStart(2, "0")}-${date?.toString().padStart(2, "0")}`;
                  const isSelected = currentDate.getDate() === date && selectedMonth.getMonth() === currentDate.getMonth();

                  return (
                    <div key={idx} className={`py-2 cursor-pointer rounded relative transition ${isSelected ? "bg-pink-600 text-white font-bold" : date ? "text-pink-900 hover:bg-pink-200" : "text-pink-300"}`} onClick={() => date && handleMiniCalendarClick(new Date(dateStr))}>
                      {date || ""}
                      {date && hasEventOnDate(dateStr) && (<div className="w-2 h-2 bg-pink-500 rounded-full absolute top-1 right-1"></div>)}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {pendingLeaves.length > 0 && (
            <Card className="shadow-md rounded-lg border-2 border-yellow-300">
              <CardContent className="p-4 max-h-[200px] overflow-auto space-y-2">
                <h2 className="font-semibold text-pink-900 mt-6 flex items-center gap-2 text-lg">
                  <span className="w-1.5 h-6 bg-yellow-500 rounded"></span> Pengajuan Cuti Menunggu
                </h2>

                {pendingLeaves.map(leave => (
                  <div key={leave.id} className="bg-yellow-50 border border-yellow-300 text-pink-900 p-3 rounded-lg shadow">
                    <div className="font-semibold text-sm">{leave.requester.fullName}</div>
                    <div className="text-[10px] mt-1">{leave.reason}</div>
                    <div className="text-[10px]">{leave.startDate} - {leave.endDate}</div>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs flex-1" 
                        onClick={() => {
                          setSelectedLeave(leave);
                          setApproveDialogOpen(true);
                        }}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> Setuju
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700 text-white h-7 text-xs flex-1" 
                        onClick={() => {
                          setSelectedLeave(leave);
                          setRejectDialogOpen(true);
                        }}
                      >
                        <XCircle className="w-3 h-3 mr-1" /> Tolak
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="shadow-md rounded-lg">
            <CardContent className="p-4 max-h-[300px] overflow-auto space-y-2">
              <h2 className="font-semibold text-pink-900 mt-6 flex items-center gap-2 text-lg">
                <span className="w-1.5 h-6 bg-pink-500 rounded"></span> Jadwal
              </h2>

              {events.length === 0 && (<div className="text-xs text-pink-700">Belum ada jadwal</div>)}

              {events.map(l => (
                <div key={l.id} className={`${l.color} text-pink-900 p-2 rounded-lg shadow`}>
                  <div className="font-semibold text-sm">{l.doctor}</div>
                  <div className="text-[10px]">{l.reason}</div>
                  <div className="text-[10px]">{l.type === 'Cuti' ? `${l.startDate} - ${l.endDate}` : `${l.startDate} ${l.startTime}`}</div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md bg-pink-50 rounded-lg shadow-lg p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-pink-900 font-bold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-pink-500" /> Ajukan Cuti
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-pink-900">Alasan Cuti</Label>
              <Input placeholder="Masukkan alasan cuti" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} className="border-pink-300 focus:border-pink-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-pink-900">Tanggal Mulai</Label>
                <Input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
              </div>

              <div>
                <Label className="text-pink-900">Tanggal Selesai</Label>
                <Input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50" onClick={() => setAddDialogOpen(false)} disabled={submitting}>
                Batal
              </Button>

              <Button className="bg-pink-600 text-white hover:bg-pink-700 shadow" onClick={handleSaveLeave} disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
              </Button>
            </div>
          </div>

        </DialogContent>
      </Dialog>

      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="max-w-md bg-green-50 rounded-lg shadow-lg p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-green-900 font-bold text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" /> Setujui Pengajuan Cuti
            </DialogTitle>
          </DialogHeader>

          {selectedLeave && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
                <div className="grid grid-cols-[90px_10px_1fr] items-start">
                  <span className="font-semibold text-slate-700">Perawat</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-slate-800">
                    {selectedLeave.requester.fullName}
                  </span>
                </div>

                <div className="grid grid-cols-[90px_10px_1fr] items-start">
                  <span className="font-semibold text-slate-700">Alasan</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-slate-800">
                    {selectedLeave.reason}
                  </span>
                </div>

                <div className="grid grid-cols-[90px_10px_1fr] items-start">
                  <span className="font-semibold text-slate-700">Periode</span>
                  <span className="text-slate-500">:</span>
                  <span className="text-slate-800">
                    {new Date(selectedLeave.startDate).toLocaleDateString("id-ID")} –{" "}
                    {new Date(selectedLeave.endDate).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="text-sm text-green-900">
                Apakah Anda yakin ingin menyetujui pengajuan cuti ini?
              </div>

              {error && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50" onClick={() => setApproveDialogOpen(false)} disabled={submitting}>
                  Batal
                </Button>

                <Button className="bg-green-600 text-white hover:bg-green-700 shadow" onClick={handleApproveLeave} disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Setujui'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md bg-red-50 rounded-lg shadow-lg p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-red-900 font-bold text-lg flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" /> Tolak Pengajuan Cuti
            </DialogTitle>
          </DialogHeader>

          {selectedLeave && (
            <div className="space-y-3">
              {/* Info Pengajuan */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2 text-sm">
                <div className="grid grid-cols-[90px_10px_1fr] items-start">
                  <span className="font-semibold text-red-800">Perawat</span>
                  <span className="text-red-600">:</span>
                  <span className="text-red-900">
                    {selectedLeave.requester.fullName}
                  </span>
                </div>

                <div className="grid grid-cols-[90px_10px_1fr] items-start">
                  <span className="font-semibold text-red-800">Alasan</span>
                  <span className="text-red-600">:</span>
                  <span className="text-red-900">
                    {selectedLeave.reason}
                  </span>
                </div>

                <div className="grid grid-cols-[90px_10px_1fr] items-start">
                  <span className="font-semibold text-red-800">Periode</span>
                  <span className="text-red-600">:</span>
                  <span className="text-red-900">
                    {new Date(selectedLeave.startDate).toLocaleDateString("id-ID")} –{" "}
                    {new Date(selectedLeave.endDate).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Alasan Penolakan */}
              <div className="mt-4 space-y-1">
                <Label className="text-sm font-semibold text-red-900">
                  Alasan Penolakan
                </Label>
               <Textarea
                  placeholder="Masukkan alasan penolakan..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="
                    min-h-[110px]
                    bg-white
                    border border-red-300
                    text-slate-800
                    placeholder:text-slate-400
                    focus:border-red-500
                    focus:ring-1
                    focus:ring-red-200
                  "
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50" onClick={() => setRejectDialogOpen(false)} disabled={submitting}>
                  Batal
                </Button>

                <Button className="bg-red-600 text-white hover:bg-red-700 shadow" onClick={handleRejectLeave} disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tolak'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default function CalendarDoctorView() {
  return (
    <AuthGuard requiredRole="DOKTER">
      <CalendarContent />
    </AuthGuard>
  );
}