import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function tempToColor(temp, min, max) {
  if (temp == null) return '';
  const ratio = max === min ? 0.5 : (temp - min) / (max - min);
  const r = ratio < 0.5 ? Math.round(107 + (255 - 107) * (ratio / 0.5)) : 255;
  const g = ratio < 0.5 ? Math.round(154 + (255 - 154) * (ratio / 0.5)) : Math.round(255 - (255 - 122) * ((ratio - 0.5) / 0.5));
  const b = ratio < 0.5 ? Math.round(196 + (255 - 196) * (ratio / 0.5)) : Math.round(255 - (255 - 95) * ((ratio - 0.5) / 0.5));
  return `rgb(${r},${g},${b})`;
}

export default function HeatCalendar({ days, selectedDate, onSelect }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const dayMap = {};
  let minTemp = Infinity, maxTemp = -Infinity;
  (days || []).forEach(d => {
    dayMap[d.date] = d;
    if (d.avg_temp < minTemp) minTemp = d.avg_temp;
    if (d.avg_temp > maxTemp) maxTemp = d.avg_temp;
  });

  const firstDay = new Date(year, month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = new Date(year, month).toLocaleDateString('hr-HR', { month: 'long', year: 'numeric' });

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-1 rounded-lg hover:bg-bg transition" aria-label="Prethodni mjesec">
          <ChevronLeft size={20} className="text-text" />
        </button>
        <h2 className="text-lg font-bold text-text capitalize">{monthName}</h2>
        <button onClick={next} className="p-1 rounded-lg hover:bg-bg transition" aria-label="Sljedeći mjesec">
          <ChevronRight size={20} className="text-text" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted mb-1">
        {['Pon','Uto','Sri','Čet','Pet','Sub','Ned'].map(d => <div key={d} className="font-semibold">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const info = dayMap[dateStr];
          const hasData = !!info;
          const isSelected = dateStr === selectedDate;
          return (
            <button
              key={dateStr}
              onClick={() => hasData && onSelect(dateStr)}
              disabled={!hasData}
              title={hasData ? `${info.avg_temp}°C / ${info.avg_humi}%` : 'Nema podataka'}
              className={`aspect-square rounded-lg text-xs font-semibold flex items-center justify-center transition-all
                ${isSelected ? 'ring-2 ring-text ring-offset-1' : ''}
                ${hasData ? 'cursor-pointer hover:scale-110' : 'text-gray-300 cursor-default'}`}
              style={hasData ? { backgroundColor: tempToColor(info.avg_temp, minTemp, maxTemp), color: '#3D2C2C' } : {}}
            >
              {d}
            </button>
          );
        })}
      </div>
      {minTemp !== Infinity && (
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted">
          <span>{minTemp}°C</span>
          <div className="h-2 w-24 rounded-full" style={{
            background: 'linear-gradient(to right, rgb(107,154,196), white, rgb(224,122,95))'
          }} />
          <span>{maxTemp}°C</span>
        </div>
      )}
    </div>
  );
}
