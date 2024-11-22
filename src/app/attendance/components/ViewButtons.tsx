import { BsListUl, BsTable, BsCalendar3 } from 'react-icons/bs';

interface ViewButtonsProps {
  view: 'timeline' | 'table' | 'calendar';
  setView: (view: 'timeline' | 'table' | 'calendar') => void;
}

export function ViewButtons({ view, setView }: ViewButtonsProps) {
  return (
    <div className="flex space-x-1">
      <div className="relative group">
        <button
          onClick={() => setView('timeline')}
          className={`p-2 rounded-md transition-all duration-200 ${
            view === 'timeline' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BsListUl className="w-5 h-5" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
            Timeline View
          </div>
        </div>
      </div>

      <div className="relative group">
        <button
          onClick={() => setView('table')}
          className={`p-2 rounded-md transition-all duration-200 ${
            view === 'table' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BsTable className="w-5 h-5" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
            Tabular View
          </div>
        </div>
      </div>

      <div className="relative group">
        <button
          onClick={() => setView('calendar')}
          className={`p-2 rounded-md transition-all duration-200 ${
            view === 'calendar' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BsCalendar3 className="w-5 h-5" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
            Calendar View
          </div>
        </div>
      </div>
    </div>
  );
} 