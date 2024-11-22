interface DayRecord {
  fullDate: string;
  status: 'present' | 'absent' | 'holiday' | 'wfh' | '0.5 day Present';
  hoursWorked?: string;
  holidayName?: string;
}

interface AttendanceCalendarProps {
  days: DayRecord[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function AttendanceCalendar({ days, currentDate, onDateChange }: AttendanceCalendarProps) {
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const isInSelectedWeek = (date: Date) => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return date >= startOfWeek && date <= endOfWeek;
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayIndex = firstDay.getDay();
    
    const calendarDays = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayIndex; i++) {
      calendarDays.push({ date: null, isCurrentMonth: false });
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayRecord = days.find(d => new Date(d.fullDate).toDateString() === currentDate.toDateString());
      
      calendarDays.push({
        date: currentDate,
        isCurrentMonth: true,
        record: dayRecord
      });
    }
    
    // Add empty slots to complete the last week
    while (calendarDays.length % 7 !== 0) {
      calendarDays.push({ date: null, isCurrentMonth: false });
    }
    
    return calendarDays;
  };

  const getWeekNumber = (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return Math.floor((date.getDate() + firstDayOfMonth.getDay() - 1) / 7);
  };

  const renderWeek = (weekDays: any[]) => {
    const isWeekSelected = weekDays.some(day => day.date && isInSelectedWeek(day.date));
    
    return (
      <div className="relative">
        {isWeekSelected && (
          <div className="absolute inset-0 border-2 border-blue-300 pointer-events-none z-10" />
        )}
        <div className="grid grid-cols-7">
          {weekDays.map((item, index) => {
            if (!item.date) {
              return <div key={index} className="h-24 border-r border-b" />;
            }

            const isSunday = item.date.getDay() === 0;
            const isSaturday = item.date.getDay() === 6;
            const isWeekend = isSaturday || isSunday;
            const isToday = item.date.toDateString() === new Date().toDateString();

            return (
              <div 
                key={index} 
                className={`h-24 p-2 relative border-r border-b
                  ${isWeekend ? 'bg-orange-50' : 'bg-white'}
                  ${isToday ? 'bg-blue-10' : ''}`}
                onClick={() => onDateChange(item.date)}
              >
                <div className={`text-sm ${isToday ? 'font-bold rounded-sm w-6 h-6 flex items-center justify-center bg-blue-600 text-white' : ''}`}>
                  {item.date.getDate()}
                </div>
                
                {item.record && (
                  <div className={`mt-1 p-2 rounded-md text-sm ${
                    isWeekend ? 'bg-orange-100 text-orange-800' :
                    item.record.status === 'present' ? 'bg-emerald-100/50 border border-emerald-200' :
                    (item.record.status === 'absent' && item.date.getTime() < new Date().setHours(0,0,0,0)) ? 'bg-red-100/50 border border-red-200' :
                    ''
                  }`}>
                    {isWeekend ? (
                      <div>
                        <div className="font-semibold text-orange-800">Weekend</div>
                        <div className="mt-0.5 text-xs text-black-700">{item.record.hoursWorked} Hrs</div>
                      </div>
                    ) : item.record.status === 'present' ? (
                      <div>
                        <div className="font-semibold text-emerald-800">Present</div>
                        <div className="mt-0.5 text-xs text-black-700">{item.record.hoursWorked} Hrs</div>
                      </div>
                    ) : (item.record.status === 'absent' && item.date.getTime() < new Date().setHours(0,0,0,0)) ? (
                      <div>
                        <div className="font-semibold text-red-800">Absent</div>
                        <div className="mt-0.5 text-xs text-black-700">{item.record.hoursWorked} Hrs</div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 text-center">
          <span className="text-xl font-semibold">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-sm font-medium text-gray-600 text-center border-r">
            {day}
          </div>
        ))}
      </div>

      {/* Group calendar days into weeks and render each week */}
      {chunk(getCalendarDays(), 7).map((weekDays, weekIndex) => (
        <div key={weekIndex}>
          {renderWeek(weekDays)}
        </div>
      ))}
    </div>
  );
}

// Helper function to chunk array into weeks
const chunk = (arr: any[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
}; 