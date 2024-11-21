interface DayRecord {
  fullDate: string;
  status: 'present' | 'absent' | 'holiday' | 'wfh' | '0.5 day Present';
  hoursWorked?: string;
  holidayName?: string;
}

interface AttendanceCalendarProps {
  days: DayRecord[];
  currentDate: Date;
}

export function AttendanceCalendar({ days, currentDate }: AttendanceCalendarProps) {
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
      calendarDays.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // Add empty slots to complete the last week
    while (calendarDays.length % 7 !== 0) {
      calendarDays.push({ date: null, isCurrentMonth: false });
    }
    
    return calendarDays;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const shouldShowAbsent = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    // Only show absent for past dates
    return checkDate < today;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      <div className="grid grid-cols-7">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center border-b text-gray-600">
            {day}
          </div>
        ))}

        {getCalendarDays().map((item, index) => {
          const { date, isCurrentMonth } = item;
          if (!date) {
            return <div key={index} className="min-h-[120px] p-2 border" />;
          }

          const dayRecord = days.find(d => new Date(d.fullDate).toDateString() === date.toDateString());
          const isSunday = date.getDay() === 0;
          const isSaturday = date.getDay() === 6;
          const todayHighlight = isToday(date);

          // Only show status if there's a record or if it's a past date with no attendance
          const showAbsent = !dayRecord && shouldShowAbsent(date);

          return (
            <div 
              key={index} 
              className={`min-h-[120px] p-2 border relative
                ${(isSunday || isSaturday) ? 'bg-orange-50' : 'bg-white'}`}
            >
              <div className={`text-sm ${todayHighlight ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>
                {date.getDate()}
              </div>
              
              {(dayRecord || showAbsent) && (
                <div className={`mt-1 p-2 rounded-md border text-sm ${
                  dayRecord?.status === 'present' ? 'bg-green-100 border-green-300' :
                  dayRecord?.status === 'holiday' ? 'bg-blue-100 border-blue-300' :
                  dayRecord?.status === 'wfh' ? 'bg-cyan-100 border-cyan-300' :
                  dayRecord?.status === '0.5 day Present' ? 'bg-green-100 border-green-300' :
                  showAbsent ? 'bg-red-100 border-red-300' : ''
                }`}>
                  <div className="font-medium">
                    {dayRecord?.status === 'holiday' ? `${dayRecord.holidayName}(Holiday)` :
                     dayRecord?.status === 'wfh' ? 'Work From Home' :
                     dayRecord?.status === '0.5 day Present' ? '0.5 day Present' :
                     dayRecord?.status === 'present' ? 'Present' :
                     showAbsent ? 'Absent' : ''}
                  </div>
                  {(dayRecord?.status === 'present' || 
                    dayRecord?.status === '0.5 day Present' || 
                    dayRecord?.status === 'wfh') && (
                    <div className="text-xs text-gray-600 mt-1">
                      {dayRecord.hoursWorked} Hrs
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 