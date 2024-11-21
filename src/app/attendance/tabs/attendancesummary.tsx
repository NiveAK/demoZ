'use client';
import { useEffect, useState } from 'react';

interface AttendanceSummary {
  payableDays: number;
  presentDays: number;
  onDutyDays: number;
  paidLeaveDays: number;
  holidays: number;
  weekendDays: number;
}

interface DayStatus {
  date: Date;
  status: 'present' | 'absent' | 'weekend' | 'holiday' | 'leave' | 'onDuty';
}

export function AttendanceSummary() {
  const [summary, setSummary] = useState<AttendanceSummary>({
    payableDays: 0,
    presentDays: 0,
    onDutyDays: 0,
    paidLeaveDays: 0,
    holidays: 0,
    weekendDays: 0,
  });

  useEffect(() => {
    calculateWeekSummary();
  }, []);

  const calculateWeekSummary = async () => {
    // Get current week's start and end dates
    const curr = new Date();
    const first = curr.getDate() - curr.getDay();
    const firstDay = new Date(curr.setDate(first));
    const lastDay = new Date(curr.setDate(first + 6));

    // Mock attendance data - Replace this with your API call
    const weekData = await fetchWeekAttendance(firstDay, lastDay);
    
    // Calculate summary based on the week data
    const summary = calculateSummaryFromWeekData(weekData);
    setSummary(summary);
  };

  // Mock function to fetch attendance data - Replace with actual API call
  const fetchWeekAttendance = async (startDate: Date, endDate: Date): Promise<DayStatus[]> => {
    // This is mock data - replace with actual API call
    const weekData: DayStatus[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const day = currentDate.getDay();
      let status: DayStatus['status'];

      if (day === 0 || day === 6) {
        status = 'weekend';
      } else {
        // Mock logic - you should replace this with real data
        const random = Math.random();
        if (random < 0.7) status = 'present';
        else if (random < 0.8) status = 'leave';
        else if (random < 0.9) status = 'holiday';
        else status = 'onDuty';
      }

      weekData.push({
        date: new Date(currentDate),
        status
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return weekData;
  };

  const calculateSummaryFromWeekData = (weekData: DayStatus[]): AttendanceSummary => {
    const summary = {
      payableDays: 0,
      presentDays: 0,
      onDutyDays: 0,
      paidLeaveDays: 0,
      holidays: 0,
      weekendDays: 0,
    };

    weekData.forEach(day => {
      switch (day.status) {
        case 'present':
          summary.presentDays++;
          summary.payableDays++;
          break;
        case 'onDuty':
          summary.onDutyDays++;
          summary.payableDays++;
          break;
        case 'leave':
          summary.paidLeaveDays++;
          summary.payableDays++;
          break;
        case 'holiday':
          summary.holidays++;
          summary.payableDays++;
          break;
        case 'weekend':
          summary.weekendDays++;
          break;
      }
    });

    return summary;
  };

  const [viewMode, setViewMode] = useState<'days' | 'hours'>('days');

  return (
    <div className="mt-6 bg-white rounded-lg shadow">
      <div className="border-b p-2">
        <div className="flex gap-4">
          <button 
            className={`px-4 py-1 text-sm font-medium text-gray-700 rounded-md ${
              viewMode === 'days' ? 'bg-gray-100' : ''
            }`}
            onClick={() => setViewMode('days')}
          >
            Days
          </button>
          <button 
            className={`px-4 py-1 text-sm font-medium text-gray-700 rounded-md ${
              viewMode === 'hours' ? 'bg-gray-100' : ''
            }`}
            onClick={() => setViewMode('hours')}
          >
            Hours
          </button>
        </div>
      </div>
      
      <div className="flex items-center p-2 overflow-x-auto">
        <SummaryItem 
          label="Payable Days" 
          value={viewMode === 'days' ? `${summary.payableDays} Days` : `${summary.payableDays * 8} Hours`}
          borderColor="border-yellow-400" 
        />
        <SummaryItem 
          label="Present" 
          value={viewMode === 'days' ? `${summary.presentDays} Days` : `${summary.presentDays * 8} Hours`}
          borderColor="border-green-400" 
        />
        <SummaryItem 
          label="On Duty" 
          value={viewMode === 'days' ? `${summary.onDutyDays} Days` : `${summary.onDutyDays * 8} Hours`}
          borderColor="border-purple-400" 
        />
        <SummaryItem 
          label="Paid leave" 
          value={viewMode === 'days' ? `${summary.paidLeaveDays} Days` : `${summary.paidLeaveDays * 8} Hours`}
          borderColor="border-orange-400" 
        />
        <SummaryItem 
          label="Holidays" 
          value={viewMode === 'days' ? `${summary.holidays} Days` : `${summary.holidays * 8} Hours`}
          borderColor="border-blue-400" 
        />
        <SummaryItem 
          label="Weekend" 
          value={viewMode === 'days' ? `${summary.weekendDays} Days` : `${summary.weekendDays * 8} Hours`}
          borderColor="border-red-400" 
        />
      </div>
    </div>
  );
}

function SummaryItem({ 
  label, 
  value, 
  borderColor 
}: { 
  label: string; 
  value: string; 
  borderColor: string;
}) {
  return (
    <div className={`flex flex-col min-w-[120px] px-4 border-l-2 ${borderColor}`}>
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}