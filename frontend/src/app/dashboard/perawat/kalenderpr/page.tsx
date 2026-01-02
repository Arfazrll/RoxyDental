"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import DoctorNavbar from "@/components/ui/navbarpr";
import AuthGuard from "@/components/AuthGuard";
import {
  calendarService,
  LeaveRequest,
  LeaveResponse,
  CalendarEvent,
} from "@/services/calendar.service";

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
  status?: string;
}

function CalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<string>("ANNUAL");
  const [formData, setFormData] = useState({ reason: "", startDate: "", endDate: "" });
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [myLeaves, setMyLeaves] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const dayNames = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // ✅ Hapus jam dari ISO datetime (2025-12-23T00:00:00.000Z -> 2025-12-23)
  const formatDateOnly = (dateStr?: string) => {
    if (!dateStr) return "-";
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  };

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
    fetchMyLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        startTime: event.startTime || "00:00",
        endTime: event.endTime || "23:59",
        color: event.color,
        type: event.type === "LEAVE" ? "Cuti" : "Kunjungan",
        status: event.status,
      }));

      setEvents(mappedEvents);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data kalender");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLeaves = async () => {
    try {
      const response = await calendarService.getMyLeaves();
      setMyLeaves(response.data);
    } catch (err: any) {
      console.error("Error fetching my leaves:", err);
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
    const [slotHour] = timeSlot.split(":").map(Number);

    return events.filter((event) => {
      if (event.startDate !== dateStr) return false;

      if (event.type === "Cuti") {
        return true;
      }

      const [startHour] = event.startTime.split(":").map(Number);
      return startHour === slotHour;
    });
  };

  const hasEventOnDate = (dateStr: string) => {
    return events.some((l) => dateStr >= l.startDate && dateStr <= l.endDate);
  };

  const handleSaveLeave = async () => {
    if (!formData.reason || !formData.startDate || !formData.endDate) {
      setError("Mohon lengkapi semua field");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const leaveData: LeaveRequest = {
        reason: formData.reason,
        startDate: formData.startDate,
        endDate: formData.endDate,
        leaveType: leaveType,
      };

      await calendarService.submitLeaveRequest(leaveData);

      setAddDialogOpen(false);
      setFormData({ reason: "", startDate: "", endDate: "" });
      setLeaveType("ANNUAL");

      await fetchMyLeaves();
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan pengajuan");
      console.error("Error submitting leave:", err);
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

  const getStatusBadge = (status: string) => {
    if (status === "PENDING") {
      return (
        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
          Menunggu Persetujuan
        </span>
      );
    } else if (status === "APPROVED") {
      return (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          Disetujui
        </span>
      );
    } else if (status === "REJECTED") {
      return (
        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
          Ditolak
        </span>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-pink-900">
      <DoctorNavbar />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <div className="lg:col-span-3">
          <Card className="shadow-lg rounded-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 mt-6">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigateWeek(-1)}
                    className="hover:bg-pink-100 p-2 rounded mt-3"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="text-lg font-semibold">
                    {weekDays[0].getDate()} {monthNames[weekDays[0].getMonth()]} -{" "}
                    {weekDays[6].getDate()} {monthNames[weekDays[6].getMonth()]}{" "}
                    {weekDays[0].getFullYear()}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigateWeek(1)}
                    className="hover:bg-pink-100 p-2 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-pink-300 text-pink-700 hover:bg-pink-50"
                  onClick={() => setAddDialogOpen(true)}
                >
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
                  <Button
                    onClick={fetchEvents}
                    size="sm"
                    className="mt-4 bg-pink-600 hover:bg-pink-700"
                  >
                    Coba Lagi
                  </Button>
                </div>
              ) : (
                <div className="overflow-auto max-h-[640px] border border-pink-200 rounded-lg bg-white">
                  <div className="grid grid-cols-8 min-w-[980px]">
                    <div className="sticky top-0 left-0 z-30 border-r border-b border-pink-200 bg-pink-50 p-3" />
                    {weekDays.map((day, idx) => (
                      <div
                        key={idx}
                        className="sticky top-0 z-20 border-r border-b border-pink-200 bg-pink-100 p-3 text-center"
                      >
                        <div className="text-xs font-medium uppercase">
                          {dayNames[day.getDay()]}
                        </div>
                        <div className="text-base font-bold mt-1">
                          {day.getDate()} {monthNames[day.getMonth()].slice(0, 3)}
                        </div>
                      </div>
                    ))}

                    {timeSlots.map((time, tIdx) => (
                      <React.Fragment key={tIdx}>
                        <div className="sticky left-0 z-20 border-r border-b border-pink-200 bg-pink-50 p-2 text-xs text-right font-medium min-h-16">
                          {time}
                        </div>
                        {weekDays.map((day, dIdx) => {
                          const dayEvents = getEventsForTimeSlot(day, time);
                          return (
                            <div
                              key={`${tIdx}-${dIdx}`}
                              className="border-r border-b border-pink-200 p-1.5 min-h-16 relative hover:bg-pink-50 transition cursor-pointer"
                              onClick={() => handleMainCalendarClick(day)}
                            >
                              {dayEvents.map((l) => (
                                <div
                                  key={l.id}
                                  className={`${l.color} text-pink-900 text-xs p-1.5 rounded-lg shadow-md mb-1.5`}
                                >
                                  <div className="font-semibold text-[11px]">{l.doctor}</div>
                                  <div className="text-[10px]">{l.reason}</div>
                                  <div className="text-[10px]">
                                    {l.startTime} - {l.endTime}
                                  </div>
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
                <select
                  value={selectedMonth.getMonth()}
                  onChange={(e) => {
                    const newDate = new Date(selectedMonth);
                    newDate.setMonth(parseInt(e.target.value));
                    setSelectedMonth(newDate);
                  }}
                  className="border border-pink-300 rounded px-2 py-1 text-sm mt-5"
                >
                  {monthNames.map((m, idx) => (
                    <option key={idx} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={selectedMonth.getFullYear()}
                  onChange={(e) => {
                    const newDate = new Date(selectedMonth);
                    newDate.setFullYear(parseInt(e.target.value));
                    setSelectedMonth(newDate);
                  }}
                  className="border border-pink-300 rounded px-2 py-1 text-sm w-20 mt-5"
                />
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs mt-2">
                {dayNames.map((d) => (
                  <div key={d} className="font-semibold py-2">
                    {d}
                  </div>
                ))}
                {calendarDates.map((date, idx) => {
                  const dateStr = `${selectedMonth.getFullYear()}-${(selectedMonth.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${date?.toString().padStart(2, "0")}`;
                  const isSelected =
                    currentDate.getDate() === date && selectedMonth.getMonth() === currentDate.getMonth();
                  return (
                    <div
                      key={idx}
                      className={`py-2 cursor-pointer hover:bg-pink-200 rounded transition relative ${isSelected
                          ? "bg-pink-600 text-white font-bold"
                          : date
                            ? "text-pink-900"
                            : "text-pink-300"
                        }`}
                      onClick={() => {
                        if (date) handleMiniCalendarClick(new Date(dateStr));
                      }}
                    >
                      {date || ""}
                      {date && hasEventOnDate(dateStr) && (
                        <div className="w-2 h-2 bg-pink-500 rounded-full absolute top-1 right-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-lg">
            <CardContent className="p-4 max-h-[200px] overflow-auto space-y-2">
              <h2 className="font-semibold text-pink-900 mt-6 flex items-center gap-2 text-lg">
                <span className="w-1.5 h-6 bg-pink-500 rounded" /> Pengajuan Cuti Saya
              </h2>

              {myLeaves.length === 0 && <div className="text-xs text-pink-700">Belum ada pengajuan cuti</div>}

              {myLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className={`${leave.status === "PENDING"
                      ? "bg-yellow-50 border-yellow-300"
                      : leave.status === "APPROVED"
                        ? "bg-green-50 border-green-300"
                        : "bg-red-50 border-red-300"
                    } border text-pink-900 p-2 rounded-lg shadow`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{leave.reason}</div>

                      {/* ✅ tanggal-only */}
                      <div className="text-[10px] mt-0.5">
                        Dari: {formatDateOnly(leave.startDate)} Sampai: {formatDateOnly(leave.endDate)}
                      </div>
                    </div>
                    {getStatusBadge(leave.status)}
                  </div>

                  {leave.status === "REJECTED" && leave.rejectionReason && (
                    <div className="text-[10px] mt-2 text-red-700 bg-red-100 p-2 rounded">
                      <strong>Alasan Penolakan:</strong> {leave.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-md rounded-lg">
            <CardContent className="p-4 max-h-[300px] overflow-auto space-y-2">
              <h2 className="font-semibold text-pink-900 mt-6 flex items-center gap-2 text-lg">
                <span className="w-1.5 h-6 bg-blue-500 rounded" /> Jadwal Saya
              </h2>

              {events.length === 0 && <div className="text-xs text-pink-700">Belum ada jadwal</div>}

              {events.map((l) => (
                <div key={l.id} className={`${l.color} text-pink-900 p-2 rounded-lg shadow mb-2`}>
                  <div className="font-semibold text-sm">{l.doctor}</div>
                  <div className="text-[10px] mt-0.5">{l.reason}</div>

                  {/* ✅ tanggal-only */}
                  <div className="text-[10px] mt-0.5">
                    {l.type === "Cuti"
                      ? `${formatDateOnly(l.startDate)} - ${formatDateOnly(l.endDate)}`
                      : formatDateOnly(l.startDate)}
                  </div>
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
              <Label className="text-pink-900">Jenis Cuti</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="border-pink-300 focus:border-pink-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANNUAL">Cuti Tahunan</SelectItem>
                  <SelectItem value="SICK">Cuti Sakit</SelectItem>
                  <SelectItem value="EMERGENCY">Cuti Darurat</SelectItem>
                  <SelectItem value="UNPAID">Cuti Tanpa Gaji</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-pink-900">Alasan Cuti</Label>
              <Input
                placeholder="Masukkan alasan cuti"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="border-pink-300 focus:border-pink-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-pink-900">Tanggal Mulai</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-pink-900">Tanggal Selesai</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg flex items-start gap-2">
              <Clock className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
              <div className="text-xs text-yellow-800">
                Pengajuan cuti Anda akan menunggu persetujuan dari dokter sebelum ditampilkan di kalender.
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                className="border-pink-300 text-pink-700 hover:bg-pink-50"
                onClick={() => setAddDialogOpen(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700 text-white shadow"
                onClick={handleSaveLeave}
                disabled={submitting}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ajukan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CalendarDoctorView() {
  return (
    <AuthGuard requiredRole="PERAWAT">
      <CalendarContent />
    </AuthGuard>
  );
}
