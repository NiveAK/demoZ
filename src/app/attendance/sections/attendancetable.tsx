interface DayRecord {
  fullDate: string;
  day: string;
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked: number;
  payableHours: number;
  status: 'present' | 'weekend' | 'absent' | 'blank';
}

interface AttendanceTableProps {
  days: DayRecord[];
}

export function AttendanceTable({ days }: AttendanceTableProps) {
  const getStatus = (day: DayRecord) => {
    const today = new Date();
    const dayDate = new Date(day.fullDate);
    
    // Compare only dates, not times
    const isToday = dayDate.toDateString() === today.toDateString();
    
    if (day.status === 'weekend') return 'weekend';
    if (day.status === 'present') return 'present';
    if (isToday) return 'blank';  // Today should be blank if not present
    
    // For future dates, return blank
    if (dayDate > today) return 'blank';
    
    // For past dates with no attendance, return absent
    if (dayDate < today && !day.checkInTime) return 'absent';
    
    return 'blank';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First In</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Out</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payable Hours</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift(s)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regularization</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {days.map((day) => {
            const isToday = new Date(day.fullDate).toDateString() === new Date().toDateString();
            const hasAttendance = day.status === 'present';
            
            return (
              <tr key={day.fullDate} className={isToday ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={isToday ? 'font-semibold text-blue-600' : ''}>
                    {`${day.day}, ${formatDate(day.fullDate)}`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {day.checkInTime ? `${day.checkInTime} AM` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {day.checkOutTime ? `${day.checkOutTime} PM` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hasAttendance ? day.hoursWorked : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {hasAttendance || day.status === 'weekend' ? '08:00' : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${getStatus(day) === 'present' ? 'bg-green-100 text-green-800' : 
                      getStatus(day) === 'weekend' ? 'bg-blue-100 text-blue-800' : 
                      getStatus(day) === 'absent' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-600'}`}>
                    {getStatus(day) === 'blank' ? '-' : 
                     getStatus(day).charAt(0).toUpperCase() + getStatus(day).slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  General
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  -
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 