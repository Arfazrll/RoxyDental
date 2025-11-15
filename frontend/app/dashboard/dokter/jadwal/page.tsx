'use client';

import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import './KalenderPage.css';

type Event = {
  id: number;
  title: string;
  start: string; // hh:mm
  end: string;   // hh:mm
  day: number;   // 0 = SEN
  color?: string;
};

// Dummy events konsisten
const dummyEvents: Event[] = [
  { id: 1, title: 'Desi Andari', start: '09:00', end: '10:00', day: 0, color: '#ff4081' },
  { id: 2, title: 'Ahmad Budiman', start: '10:30', end: '11:30', day: 1, color: '#ff4081' },
  { id: 3, title: 'Siti Rahmawati', start: '13:00', end: '14:00', day: 2, color: '#ff4081' },
  { id: 4, title: 'Rudi Santoso', start: '14:30', end: '15:30', day: 3, color: '#ff4081' },
  { id: 5, title: 'Tina Marlina', start: '16:00', end: '17:00', day: 4, color: '#ff4081' },
];

const daysOfWeek = ['SEN','SEL','RAB','KAM','JUM'];

const KalenderPage: React.FC = () => {
  const [events] = useState<Event[]>(dummyEvents);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 27));

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };
  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const getWeekDates = () => {
    const start = new Date(currentDate);
    const week: Date[] = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = getWeekDates();

  const timeToTop = (time: string) => {
    const [hour, min] = time.split(':').map(Number);
    return hour * 50 + min; // 50px per jam
  };

  return (
    <div className="rosy-calendar-page">
      <Navbar />

      <div className="container-fluid calendar-container">
        {/* Sidebar kiri */}
        <div className="sidebar-left">
          <h6 className="mb-3 fw-semibold">Sozo Dental Tebet</h6>
          <div className="input-group mb-3">
            <input type="text" className="form-control form-control-sm" placeholder="Search.." />
          </div>
          <p className="small text-muted">Sozo Dental Kemang, Mampang Prapatan</p>
          <button className="btn btn-rosy w-100 mt-2">Sozo Dental Tebet</button>
        </div>

        {/* Main calendar */}
        <div className="main-calendar">
          <div className="calendar-header d-flex justify-content-between align-items-center px-2 py-1">
            <button className="btn btn-light btn-sm" onClick={prevWeek}><i className="bi bi-chevron-left"></i></button>
            <h6 className="mb-0 fw-semibold">
              {weekDates[0].toLocaleDateString('id', { day: 'numeric', month: 'short' })} - {weekDates[4].toLocaleDateString('id', { day: 'numeric', month: 'short' })}
            </h6>
            <button className="btn btn-light btn-sm" onClick={nextWeek}><i className="bi bi-chevron-right"></i></button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-days d-flex">
              <div className="time-col-header"></div>
              {weekDates.map((d,i)=>(
                <div key={i} className="day-header flex-fill text-center fw-semibold">
                  {daysOfWeek[i]}<br/><span className="text-muted">{d.getDate()}</span>
                </div>
              ))}
            </div>

            <div className="time-rows scrollable">
              {[...Array(24)].map((_,i)=>(
                <div key={i} className="time-row d-flex">
                  <div className="time-col">{i.toString().padStart(2,'0')}:00</div>
                  <div className="flex-grow-1 border-cell"></div>
                </div>
              ))}

              {events.map(e=>(
                <div
                  key={e.id}
                  className="event-card"
                  style={{
                    top: timeToTop(e.start)+'px',
                    height: (timeToTop(e.end)-timeToTop(e.start))+'px',
                    left: `${19 + e.day*17}%`,
                    width: '12%',
                    background: e.color
                  }}
                >
                  <div className="event-title">{e.title}</div>
                  <div className="event-time">{e.start} - {e.end}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar kanan */}
        <div className="sidebar-right">
          <div className="calendar-mini mb-3">
            <div className="text-center fw-semibold mb-2">
              {currentDate.toLocaleString('id', { month: 'long', year: 'numeric' })}
            </div>
            <div className="mini-grid">
              {['S','S','R','K','J','S','M'].map((d,i)=><div key={i} className="mini-day-head">{d}</div>)}
              {[...Array(35)].map((_,i)=>
                <div key={i} className={`mini-day ${weekDates.some(wd=>wd.getDate()===i+1)?'active':''}`}>
                  {i<30?i+1:''}
                </div>
              )}
            </div>
          </div>

          <div className="schedule-box">
            <h6 className="fw-semibold mb-2">
              <i className="bi bi-calendar-event me-2 text-rosy"></i>Jadwal Pertemuan
            </h6>
            <div className="schedule-list scrollable">
              {events.map(e=>(
                <ScheduleItem key={e.id} tanggal={weekDates[e.day].getDate().toString()} nama={e.title} dokter="drg. Kartika Yualya Dinarni" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="text-center text-muted py-2 small">© 2025 RoxyDental. Platform untuk ....</footer>
    </div>
  );
};

export default KalenderPage;

type ScheduleProps = { tanggal:string; nama:string; dokter:string };
const ScheduleItem: React.FC<ScheduleProps> = ({ tanggal, nama, dokter }) => (
  <div className="schedule-item mb-2 p-2 rounded d-flex align-items-start gap-2">
    <div className="date-box">{tanggal}</div>
    <div>
      <div className="fw-semibold small">{nama}</div>
      <div className="text-muted small">{dokter}</div>
    </div>
  </div>
);
