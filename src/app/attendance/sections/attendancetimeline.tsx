import { useState } from 'react';

interface DayRecord {
  date: number;
  day: string;
  isToday?: boolean;
  status: 'present' | 'absent' | 'blank' | 'weekend';
  checkInTime?: string;
  checkOutTime?: string;
  hoursWorked: string;
  // lateBy?: string;
  // earlyBy?: string;
  fullDate: string;
}

interface AttendanceTimelineProps {
  currentDate: Date;
  // viewType?: 'timeline' | 'table' | 'calendar';
  days?: DayRecord[];
}

export function AttendanceTimeline({ currentDate, days = [] }: AttendanceTimelineProps) {
  const timeMarkers = [
    '12 AM', '02 AM', '04 AM', '06 AM', '08 AM', '10 AM',
    '01 PM', '03 PM', '05 PM', '07 PM', '09 PM', '11 PM'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Time markers at the top */}
      <div className="ml-[120px] mr-[100px] flex justify-between text-xs text-gray-500 mb-6">
        {timeMarkers.map((time) => (
          <span key={time}>{time}</span>
        ))}
      </div>
      
      {/* Days rows with proper spacing */}
      <div>
        {days && days.length > 0 ? (
          days.map((day, index) => (
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
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No attendance data available
          </div>
        )}
      </div>
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

  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.replace(/^0/, '').replace(/:00$/, '');
  };

  const calculateTotalHours = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(`2024 ${checkIn}`).getTime();
    const checkOutDate = new Date(`2024 ${checkOut}`).getTime();
    const hours = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60));
    const minutes = Math.floor(((checkOutDate - checkInDate) % (1000 * 60 * 60)) / (1000 * 60));
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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
