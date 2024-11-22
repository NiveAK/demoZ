'use client';

import { useState, useEffect } from 'react';
import { DateNavigation } from './sections/datenavigation';
import { CheckInSection } from './sections/checkinsection';
import { AttendanceSummary } from './sections/attendancesummary';
import { ViewToggleButtons } from './components/ViewToggleButtons';

export default function AttendancePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<'timeline' | 'table' | 'calendar'>('timeline');
  const [checkInStatus, setCheckInStatus] = useState({
    isCheckedIn: false,
    checkInTime: '',
    checkOutTime: null as string | null
  });
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    const fetchMonthData = async () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const response = await fetch(`/api/attendance?start=${firstDay.toISOString()}&end=${lastDay.toISOString()}`);
      const data = await response.json();
      setAttendanceData(data);
    };

    fetchMonthData();
  }, [currentDate]);

  const handleCheckInOut = (time: string, isCheckedIn: boolean) => {
    if (isCheckedIn) {
      setCheckInStatus({
        isCheckedIn: true,
        checkInTime: time,
        checkOutTime: null
      });
    } else {
      setCheckInStatus(prev => ({
        isCheckedIn: false,
        checkInTime: prev.checkInTime,
        checkOutTime: time
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <h1 className="text-xl font-semibold">My Attendance</h1>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <DateNavigation 
          currentDate={currentDate} 
          setCurrentDate={setCurrentDate}
          view={view}
          setView={setView}
        />
        <CheckInSection 
          date={currentDate} 
          onCheckInOut={handleCheckInOut}
          checkInStatus={checkInStatus} 
        />
        
        <ViewToggleButtons 
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          view={view}
        />
        
        <AttendanceSummary />
      </main>
    </div>
  );
}