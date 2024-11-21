'use client';

import { useState, useEffect } from 'react';

interface CheckInSectionProps {
  date: Date;
  onCheckInOut: (time: string, isCheckedIn: boolean) => void;
  checkInStatus: {
    isCheckedIn: boolean;
    checkInTime: string;
    checkOutTime: string | null;
  };
}

export function CheckInSection({ date, onCheckInOut, checkInStatus }: CheckInSectionProps) {
  const [checkInNote, setCheckInNote] = useState('');
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const [checkInTime, setCheckInTime] = useState('00:00:00');

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isCheckedIn) {
      intervalId = setInterval(() => {
        const now = new Date();
        setCurrentTime(now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }));
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isCheckedIn]);

  const handleCheckInOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    if (!isCheckedIn) {
      setCheckInTime(timeStr);
      setCurrentTime(timeStr);
      setIsCheckedIn(true);
      onCheckInOut(timeStr, true);
    } else {
      setIsCheckedIn(false);
      onCheckInOut(timeStr, false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold whitespace-nowrap">
            General [ 12:00 AM - 12:00 AM ]
          </h2>
          <input
            type="text"
            placeholder={isCheckedIn ? "Add notes for check-out" : "Add notes for check-in"}
            className="p-2 border rounded-md w-96 text-gray-600"
            value={checkInNote}
            onChange={(e) => setCheckInNote(e.target.value)}
          />
        </div>
        <button 
          onClick={handleCheckInOut}
          className={`${
            isCheckedIn 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white px-6 py-2 rounded-md transition-colors flex flex-col items-center`}
        >
          <span>{isCheckedIn ? 'Check-out' : 'Check-in'}</span>
          <span className="text-sm">
            {isCheckedIn ? currentTime : '00:00:00'} Hrs
          </span>
        </button>
      </div>
    </div>
  );
}