import { useState } from 'react';
import { AttendanceTable } from '../sections/attendancetable';
import { AttendanceCalendar } from '../sections/attendancecalendar';
import { AttendanceTimeline } from '../sections/attendancetimeline';

interface ViewToggleProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
  view: 'timeline' | 'table' | 'calendar';
}

interface DayRecord {
  date: number;
  day: string;
  isToday?: boolean;
  status: 'present' | 'absent' | 'blank' | 'weekend';
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked: string;
  lateBy?: string;
  earlyBy?: string;
  fullDate: string;
  payableHours?: string;
}

interface AttendanceRecord {
  checkIn: string;
  checkOut: string;
  status: string;
}

// Mock data structure
const mockAttendanceData: Record<string, AttendanceRecord> = {
  '2024-11-11': { checkIn: '09:00', checkOut: '18:12', status: 'present' },
  '2024-11-12': { checkIn: '09:05', checkOut: '19:01', status: 'present' },
  '2024-11-13': { checkIn: '08:52', checkOut: '18:26', status: 'present' },
  '2024-11-14': { checkIn: '10:01', checkOut: '16:27', status: 'present' },
  '2024-11-15': { checkIn: '08:47', checkOut: '18:36', status: 'present' },
  '2024-11-18': { checkIn: '08:47', checkOut: '18:36', status: 'present' },
  '2024-11-21': { checkIn: '09:47', checkOut: '18:36', status: 'present' },
};

export function ViewToggleButtons({ currentDate, onDateChange, view }: ViewToggleProps) {
  // Generate days data that will be passed to all views
  const days = generateWeekDays(currentDate);

  return (
    <div>
      {/* View Content */}
      {view === 'timeline' && (
        <AttendanceTimeline 
          currentDate={currentDate}
          days={days}
        />
      )}
      {view === 'table' && (
        <AttendanceTable 
          days={days}
          payableHours={days}
        />
      )}
      {view === 'calendar' && (
        <AttendanceCalendar 
          days={days}
          currentDate={currentDate}
          onDateChange={onDateChange || (() => {})}
        />
      )}
    </div>
  );
}

function createDayRecord(date: Date): DayRecord {
  const isToday = date.toDateString() === new Date().toDateString();
  const dateKey = date.toISOString().split('T')[0];
  const dayData = mockAttendanceData[dateKey];

  if (date.getDay() === 0 || date.getDay() === 6) {
    return {
      date: date.getDate(),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday,
      status: 'weekend',
      hoursWorked: '00:00',
      fullDate: date.toISOString().split('T')[0]
    };
  }

  if (!dayData) {
    return {
      date: date.getDate(),
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday,
      status: 'absent',
      hoursWorked: '00:00',
      fullDate: date.toISOString().split('T')[0]
    };
  }

  // Calculate hours worked
  const [checkInHour, checkInMin] = dayData.checkIn.split(':').map(Number);
  const [checkOutHour, checkOutMin] = dayData.checkOut.split(':').map(Number);
  const hoursWorked = `${(checkOutHour - checkInHour).toString().padStart(2, '0')}:${Math.abs(checkOutMin - checkInMin).toString().padStart(2, '0')}`;

  // Calculate late by (assuming 09:00 is start time)
  const lateBy = checkInHour >= 9 ? 
    `${(checkInHour - 9).toString().padStart(2, '0')}:${checkInMin.toString().padStart(2, '0')}` : 
    undefined;

  // Calculate early by (assuming 18:00 is end time)
  const earlyBy = checkOutHour <= 18 ? 
    `${(18 - checkOutHour).toString().padStart(2, '0')}:${checkOutMin.toString().padStart(2, '0')}` : 
    undefined;

  return {
    date: date.getDate(),
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    isToday,
    status: 'present',
    checkInTime: dayData.checkIn,
    checkOutTime: dayData.checkOut,
    hoursWorked,
    lateBy,
    earlyBy,
    fullDate: date.toISOString().split('T')[0]
  };
}

function generateWeekDays(currentDate: Date) {
  const days: DayRecord[] = [];
  const startOfWeek = new Date(currentDate);
  
  // First get Monday-based week
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  
  // Get all days Monday through Saturday
  for (let i = 0; i < 6; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push(createDayRecord(date));
  }
  
  // Get Sunday (from previous week) and insert at beginning
  const sunday = new Date(startOfWeek);
  sunday.setDate(startOfWeek.getDate() - 1);
  days.unshift(createDayRecord(sunday));
  
  return days;
}