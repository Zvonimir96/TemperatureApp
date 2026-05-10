import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

function formatTime(ts) {
  return ts.slice(11, 16); // "HH:MM"
}

export default function DayChart({ readings, date }) {
  if (!readings || readings.length === 0) return null;

  const data = readings.map(r => ({
    time: formatTime(r.timestamp),
    temp: r.temperature,
    humi: r.humidity,
  }));

  const formatted = new Date(date + 'T00:00').toLocaleDateString('hr-HR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm">
      <h3 className="text-base font-bold text-text mb-4 capitalize">{formatted}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E0D8" />
          <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#A89F9F' }} interval="preserveStartEnd" />
          <YAxis yAxisId="temp" tick={{ fontSize: 11, fill: '#E07A5F' }} unit="°C" domain={['auto', 'auto']} />
          <YAxis yAxisId="humi" orientation="right" tick={{ fontSize: 11, fill: '#81B29A' }} unit="%" domain={[0, 100]} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontFamily: 'Nunito' }}
            formatter={(val, name) => [name === 'temp' ? `${val}°C` : `${val}%`, name === 'temp' ? 'Temperatura' : 'Vlažnost']}
            labelFormatter={l => `Vrijeme: ${l}`}
          />
          <Legend formatter={v => v === 'temp' ? 'Temperatura' : 'Vlažnost'} />
          <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="#E07A5F" strokeWidth={2} dot={false} />
          <Line yAxisId="humi" type="monotone" dataKey="humi" stroke="#81B29A" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
