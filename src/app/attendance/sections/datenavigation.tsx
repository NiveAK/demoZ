'use client';

import { useState } from "react";
import { ViewButtons } from "../components/ViewButtons";
import { useRouter } from 'next/navigation';

interface DateNavigationProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  view: 'timeline' | 'table' | 'calendar';
  setView: (view: 'timeline' | 'table' | 'calendar') => void;
}

export function DateNavigation({ 
  currentDate, 
  setCurrentDate,
  view = 'timeline',
  setView 
}: DateNavigationProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const router = useRouter();

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const formatDateRange = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return `${startOfWeek.getDate()}-${startOfWeek.getMonth() + 1}-${startOfWeek.getFullYear()} - ${endOfWeek.getDate()}-${endOfWeek.getMonth() + 1}-${endOfWeek.getFullYear()}`;
  };

  return (
    <div className="relative flex justify-between items-center gap-2 p-4 bg-gray-50">
      <div className="flex-1 flex justify-center items-center gap-2">
        <button 
          onClick={goToPreviousWeek}
          className="text-xl text-gray-600 hover:bg-gray-200 rounded p-1"
        >
          ‹
        </button>
        
        <button 
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 px-3 py-1 bg-white rounded-md shadow-sm hover:bg-gray-50"
        >
          <span>{formatDateRange(currentDate)}</span>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="16" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
        
        <button 
          onClick={goToNextWeek}
          className="text-xl text-gray-600 hover:bg-gray-200 rounded p-1"
        >
          ›
        </button>
      </div>

      <ViewButtons view={view} setView={setView} />

      {showCalendar && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg z-50">
          <DynamicCalendar 
            currentDate={currentDate}
            onSelect={(date) => {
              setCurrentDate(date);
              setShowCalendar(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function DynamicCalendar({ currentDate, onSelect }: { currentDate: Date, onSelect: (date: Date) => void }) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const [showYearView, setShowYearView] = useState(false);
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const buildCalendarDays = () => {
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const days: (number | null)[] = Array(firstDay.getDay()).fill(null);
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  if (showYearView) {
    return (
      <div className="p-4 w-64">
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth()))}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            ‹
          </button>
          <button 
            onClick={() => setShowYearView(false)}
            className="text-base hover:bg-gray-100 px-2 py-1 rounded"
          >
            {viewDate.getFullYear()}
          </button>
          <button 
            onClick={() => setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth()))}
            className="p-1 text-gray-600 hover:text-gray-800"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {monthNames.map((month, index) => (
            <button
              key={month}
              onClick={() => {
                setViewDate(new Date(viewDate.getFullYear(), index));
                setShowYearView(false);
              }}
              className={`
                p-2 text-center rounded
                hover:bg-gray-100
                ${index === viewDate.getMonth() ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
              `}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 w-64">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))}
          className="p-1 text-gray-600 hover:text-gray-800"
        >
          ‹
        </button>
        <button 
          onClick={() => setShowYearView(true)}
          className="text-base hover:bg-gray-100 px-2 py-1 rounded"
        >
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </button>
        <button 
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))}
          className="p-1 text-gray-600 hover:text-gray-800"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {buildCalendarDays().map((day, index) => (
          <button
            key={index}
            onClick={() => {
              if (day) {
                const newDate = new Date(currentDate);
                newDate.setFullYear(viewDate.getFullYear());
                newDate.setMonth(viewDate.getMonth());
                newDate.setDate(day);
                onSelect(newDate);
              }
            }}
            className={`
              p-2 text-center rounded-full
              ${!day ? 'invisible' : 'hover:bg-gray-100'}
              ${day === currentDate.getDate() && 
                viewDate.getMonth() === currentDate.getMonth() && 
                viewDate.getFullYear() === currentDate.getFullYear()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : ''}
            `}
            disabled={!day}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
}