'use client';

import { useState } from 'react';
import { DateNavigation } from './tabs/datenavigation';
import { AttendanceTimeline } from './tabs/attendancetimeline';
import { CheckInSection } from './tabs/checkinsection';
import { AttendanceSummary } from './tabs/attendancesummary';

export default function AttendancePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [checkInStatus, setCheckInStatus] = useState({
    isCheckedIn: false,
    checkInTime: '',
    checkOutTime: null as string | null
  });

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
        />
        <CheckInSection 
          date={currentDate} 
          onCheckInOut={handleCheckInOut}
          checkInStatus={checkInStatus} 
        />
        <AttendanceTimeline currentDate={currentDate} />
        <AttendanceSummary />
      </main>
    </div>
  );
}