import { useState } from 'react';
import { Thermometer } from 'lucide-react';
import HeatCalendar from './components/HeatCalendar';
import DayChart from './components/DayChart';
import { useFetch } from './hooks/useFetch';
import { fetchDays, fetchReadings } from './data/api';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { data: days, loading: daysLoading, error: daysError } = useFetch(fetchDays, []);
  const { data: readings, loading: readingsLoading } = useFetch(
    () => selectedDate ? fetchReadings(selectedDate) : Promise.resolve(null),
    [selectedDate]
  );

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      <header className="max-w-lg mx-auto pt-8 pb-4 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Thermometer size={24} className="text-temp" />
          <h1 className="text-xl font-bold">Temperatura i vlažnost</h1>
        </div>
        <p className="text-sm text-muted">SHT20 senzor — Raspberry Pi</p>
      </header>
      <main className="max-w-lg mx-auto px-4 pb-12 space-y-4">
        {daysLoading && <p className="text-center text-muted text-sm">Učitavanje...</p>}
        {daysError && <p className="text-center text-red-500 text-sm">{daysError}</p>}
        {days && <HeatCalendar days={days} selectedDate={selectedDate} onSelect={setSelectedDate} />}
        {selectedDate && (
          <div className="min-h-[420px]">
            {readingsLoading
              ? <p className="text-center text-muted text-sm pt-8">Učitavanje grafa...</p>
              : readings && <DayChart readings={readings} date={selectedDate} />}
          </div>
        )}
      </main>
    </div>
  );
}
