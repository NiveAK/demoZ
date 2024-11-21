import { useState } from 'react'; 
import { AttendanceTable } from './attendancetable';
import { AttendanceCalendar } from './attendancecalendar';

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
  }
  
  interface AttendanceTimelineProps {
    currentDate: Date;
    viewType?: 'timeline' | 'table' | 'calendar';
  }
  
  // Add this interface above mockAttendanceData
  interface AttendanceRecord {
    checkIn: string;
    checkOut: string;
    status: string;
  }
  
  // Mock data structure - this could later come from an API
  const mockAttendanceData: Record<string, AttendanceRecord> = {
    '2024-11-11': { checkIn: '09:00', checkOut: '18:12', status: 'present' },
    '2024-11-12': { checkIn: '09:05', checkOut: '19:01', status: 'present' },
    '2024-11-13': { checkIn: '08:52', checkOut: '18:26', status: 'present' },
    '2024-11-14': { checkIn: '10:01', checkOut: '16:27', status: 'present' },
    '2024-11-15': { checkIn: '08:47', checkOut: '18:36', status: 'present' },
    '2024-11-18': { checkIn: '08:47', checkOut: '18:36', status: 'present' },
  };
  
  export function AttendanceTimeline({ currentDate, viewType = 'timeline' }: AttendanceTimelineProps) {
    const [view, setView] = useState(viewType);
    const timeMarkers = [
      '12 AM', '02 AM', '04 AM', '06 AM', '08 AM', '10 AM',
      '01 PM', '03 PM', '05 PM', '07 PM', '09 PM', '11 PM'
    ];
  
    const days = generateWeekDays(currentDate);
  
    return (
      <div>
        {/* View toggle buttons */}
        <div className="mb-4 flex justify-end space-x-2">
          <button
            onClick={() => setView('timeline')}
            className={`px-4 py-2 rounded-md ${
              view === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setView('table')}
            className={`px-4 py-2 rounded-md ${
              view === 'table' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-md ${
              view === 'calendar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Calendar
          </button>
        </div>

        {/* View content */}
        {view === 'timeline' ? (
          <div className="bg-white rounded-lg shadow p-4">
            {/* Time markers at the top */}
            <div className="ml-[120px] mr-[100px] flex justify-between text-xs text-gray-500 mb-6">
              {timeMarkers.map((time) => (
                <span key={time}>{time}</span>
              ))}
            </div>
            
            {/* Days rows with proper spacing */}
            <div>
              {days.map((day, index) => (
                <div 
                  key={day.date} 
                  className={`
                    ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    ${index === 0 ? 'rounded-t-lg' : ''}
                    ${index === days.length - 1 ? 'rounded-b-lg' : ''}
                    px-4 py-2
                  `}
                >
                  <DayRow day={day} />
                </div>
              ))}
            </div>
          </div>
        ) : view === 'table' ? (
          <AttendanceTable days={days} />
        ) : (
          <AttendanceCalendar days={days} currentDate={currentDate} />
        )}
      </div>
    );
  }
  
function DayRow({ day }: { day: DayRecord }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const dayDate = new Date(day.fullDate);
  const isPastDay = dayDate < today;
  const hasAttendance = day.checkInTime || day.checkOutTime;

  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 100;
  };

  const formatTimeWithAMPM = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${time} ${period}`;
  };

  return (
    <>
      <div 
        className={`flex items-center py-2 ${isPastDay ? 'opacity-75' : ''}`}
        onClick={() => day.status === 'present' && setIsDetailOpen(true)}
        style={{ cursor: day.status === 'present' ? 'pointer' : 'default' }}
      >
        {/* Left side with day+date and check-in time */}
        <div className="w-[120px]">
          <div className={`
            flex items-baseline gap-2
            ${day.isToday ? 'bg-blue-50 p-2 rounded-md border border-blue-500 inline-block' : ''}
          `}>
            <span className="text-gray-900 font-medium">
              {day.day}
            </span>
            <span className="text-gray-900">
              {day.date}
            </span>
          </div>
          {hasAttendance && (
            <div className="text-green-700 mt-1 ">
              {formatTimeWithAMPM(day.checkInTime?.slice(0, 5) || '')}
            </div>
          )}
        </div>

        {/* Timeline with progress line */}
        <div className="flex-1 relative mx-4">
          <div className="h-0.5 bg-gray-200 rounded-full">
            {/* Double dots on either side */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-0.5">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-0.5">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            {/* Weekend indicator */}
            {day.status === 'weekend' && (
              <>
                <div 
                  className="absolute h-[1px] bg-blue-400"
                  style={{
                    top: '0',
                    left: 'calc(1% + 4px)',
                    right: 'calc(1% + 4px)',
                    width: 'calc(98% - 8px)'
                  }}
                />
                <div 
                  className="w-2.5 h-2.5 bg-gray-300 rounded-full absolute left-0 top-1/2 -translate-y-1/2"
                />
                <div className="absolute w-full text-center" style={{ top: '-10px' }}>
                  <span className="text-blue-500 text-xs bg-white px-2 py-0.5 border border-blue-400 rounded-sm">
                    Weekend
                  </span>
                </div>
              </>
            )}

            {/* Show red line + Absent label only for past days without attendance */}
            {isPastDay && !hasAttendance && day.status === 'absent' && (
              <>
                <div 
                  className="absolute h-[1px] bg-red-400"
                  style={{
                    top: '0',
                    left: 'calc(1% + 4px)',
                    right: 'calc(1% + 4px)',
                    width: 'calc(98% - 8px)'
                  }}
                />
                <div className="absolute w-full text-center" style={{ top: '-10px' }}>
                  <span className="text-red-500 text-xs bg-white px-3 py-0.5 border border-red-400 rounded-sm">
                    Absent
                  </span>
                </div>
              </>
            )}

            {/* Present indicator */}
            {day.status === 'present' && day.checkInTime && (
              <>
                {day.checkOutTime && (
                  <div 
                    className="absolute h-[2px] bg-green-500 rounded-full"
                    style={{
                      left: `${getTimePosition(day.checkInTime)}%`,
                      width: `${getTimePosition(day.checkOutTime) - getTimePosition(day.checkInTime)}%`,
                      top: '-1px'
                    }}
                  />
                )}
                <div className="absolute w-2 h-2 bg-green-500 rounded-full top-1/2 -translate-y-1/2"
                     style={{ left: `${getTimePosition(day.checkInTime)}%` }} />
                {day.checkOutTime && (
                  <div className="absolute w-2 h-2 bg-red-500 rounded-full top-1/2 -translate-y-1/2"
                       style={{ left: `${getTimePosition(day.checkOutTime)}%` }} />
                )}
              </>
            )}
          </div>
        </div>

        {/* Right side with check-out time and hours worked */}
        <div className="w-[120px] text-right">
          {day.status === 'present' && day.checkOutTime && (
            <>
              <div className="text-red-600">
                {formatTimeWithAMPM(day.checkOutTime?.slice(0, 5) || '')}
              </div>
              <div className="text-sm mt-1">
                <span className="text-black-900 font-semibold">{day.hoursWorked}</span>
                <span className="text-gray-500 ml-1">Hrs worked</span>
              </div>
            </>
          )}
          {(day.status === 'absent' || day.status === 'weekend') && (
            <div className="text-sm">
              <span className="text-gray-900">00:00</span>
              <span className="text-gray-500 ml-1">Hrs worked</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal/Popup */}
      {isDetailOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
          <div className="bg-gray-50 h-full w-[800px] shadow-lg relative">
            {/* Header */}
            <div className="flex justify-between items-center p-6 bg-white border-b">
              <div>
                <h3 className="text-xl font-medium">Mon, 11 Nov 2024</h3>
                <p className="text-gray-500">General [12:00 AM - 12:00 AM]</p>
              </div>
              <button onClick={() => setIsDetailOpen(false)} className="text-gray-400 hover:text-gray-600">
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Time details */}
            <div className="p-6 bg-white m-6 rounded-lg">
              <div className="flex items-center justify-between gap-8">
                {/* Check-in time */}
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div>
                    <div className="text-lg font-medium text-green-500">{formatTime(day.checkInTime || '')} AM</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <span>◎</span> 
                      CHENNAI
                    </div>
                  </div>
                </div>

                {/* Dotted line connector */}
                <div className="flex-1 border-t-2 border-dotted border-gray-300 h-0 relative" />

                {/* Check-out time */}
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div>
                    <div className="text-lg font-medium text-red-500">{formatTime(day.checkOutTime || '')} PM</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <span>◎</span> 
                      CHENNAI
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary footer */}
            <div className="absolute bottom-0 w-full border-t bg-white p-2 gap-6 m-6 rounded-lg">
              <div className="flex justify-between items-start px-6 py-3">
                <div className="flex items-start gap-4">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-4 bg-green-500 mt-1"></div>
                    <div>
                      <div className="text-xs text-gray-500">First Check-In</div>
                      <div className="text-sm">{formatTime(day.checkInTime)} AM</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-1 h-4 bg-red-500 mt-1"></div>
                    <div>
                      <div className="text-xs text-gray-500">Last Check-Out</div>
                      <div className="text-sm">{formatTime(day.checkOutTime)} PM</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1 h-4 bg-blue-500 mt-1"></div>
                  <div>
                    <div className="text-xs text-gray-500">Total Hours</div>
                    <div className="text-sm">
                      {day.checkInTime && day.checkOutTime 
                        ? `${calculateTotalHours(day.checkInTime, day.checkOutTime)} Hrs`
                        : '00:00 Hrs'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
  
  function calculateHoursWorked(checkIn?: string, checkOut?: string): string {
    if (!checkIn || !checkOut) return '00:00';
    
    const [checkInHours, checkInMinutes] = checkIn.split(':').map(Number);
    const [checkOutHours, checkOutMinutes] = checkOut.split(':').map(Number);
    
    const checkInDate = new Date();
    checkInDate.setHours(checkInHours, checkInMinutes, 0);
    
    const checkOutDate = new Date();
    checkOutDate.setHours(checkOutHours, checkOutMinutes, 0);
    
    const diffInMinutes = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = Math.floor(diffInMinutes % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  function calculateLateBy(checkInTime?: string): string | undefined {
    if (!checkInTime) return undefined;
    
    const expectedCheckIn = '09:00'; // Company policy time
    const [expectedHours, expectedMinutes] = expectedCheckIn.split(':').map(Number);
    const [actualHours, actualMinutes] = checkInTime.split(':').map(Number);
    
    const expectedDate = new Date();
    expectedDate.setHours(expectedHours, expectedMinutes, 0);
    
    const actualDate = new Date();
    actualDate.setHours(actualHours, actualMinutes, 0);
    
    if (actualDate <= expectedDate) return undefined;
    
    const diffInMinutes = (actualDate.getTime() - expectedDate.getTime()) / (1000 * 60);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = Math.floor(diffInMinutes % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  function calculateEarlyBy(checkOutTime?: string): string | undefined {
    if (!checkOutTime) return undefined;
    
    const expectedCheckOut = '18:00'; // Company policy time
    const [expectedHours, expectedMinutes] = expectedCheckOut.split(':').map(Number);
    const [actualHours, actualMinutes] = checkOutTime.split(':').map(Number);
    
    const expectedDate = new Date();
    expectedDate.setHours(expectedHours, expectedMinutes, 0);
    
    const actualDate = new Date();
    actualDate.setHours(actualHours, actualMinutes, 0);
    
    if (actualDate >= expectedDate) return undefined;
    
    const diffInMinutes = (expectedDate.getTime() - actualDate.getTime()) / (1000 * 60);
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = Math.floor(diffInMinutes % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  function getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
  
  export const generateWeekDays = (currentDate: Date) => {
    const days: DayRecord[] = [];
    const startOfWeek = new Date(currentDate);
    
    // First get Monday-based week as before
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
  };

  // Helper function to create consistent day records
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
  
  // Example of how to handle check-in/check-out
  function handleCheckIn() {
    // You would typically make an API call here
    const checkInTime = getCurrentTime();
    // Update your state/database with the check-in time
  }
  
  function handleCheckOut() {
    // You would typically make an API call here
    const checkOutTime = getCurrentTime();
    // Update your state/database with the check-out time
  }

  // Helper functions
  function formatTime(time?: string) {
    if (!time) return '';
    return time.replace(/^0/, '').replace(/:00$/, '');  // Removes leading 0 and seconds
  }

  function calculateTotalHours(checkIn: string, checkOut: string) {
    const checkInDate = new Date(`2024 ${checkIn}`).getTime();
    const checkOutDate = new Date(`2024 ${checkOut}`).getTime();
    const hours = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60));
    const minutes = Math.floor(((checkOutDate - checkInDate) % (1000 * 60 * 60)) / (1000 * 60));
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }