import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Navbar from '@/components/layout/Navbar';
import Icon from '@/components/ui/icon';

const visitsData = [
  { day: 'Пн', visits: 320 },
  { day: 'Вт', visits: 410 },
  { day: 'Ср', visits: 380 },
  { day: 'Чт', visits: 520 },
  { day: 'Пт', visits: 610 },
  { day: 'Сб', visits: 480 },
  { day: 'Вс', visits: 590 },
];

const sourcesData = [
  { source: 'Поиск', value: 420 },
  { source: 'Соцсети', value: 310 },
  { source: 'Прямые', value: 260 },
  { source: 'Реклама', value: 180 },
  { source: 'Реферал', value: 90 },
];

const kpis = [
  { icon: 'Users', label: 'Посетители', value: '12 480', trend: '+8.2%', color: 'from-fuchsia-500 to-purple-600' },
  { icon: 'Eye', label: 'Просмотры', value: '38 214', trend: '+12.4%', color: 'from-cyan-400 to-blue-500' },
  { icon: 'TrendingUp', label: 'Конверсия', value: '4.7%', trend: '+0.6%', color: 'from-emerald-400 to-teal-500' },
  { icon: 'Clock', label: 'Среднее время', value: '2м 41с', trend: '+14с', color: 'from-amber-400 to-orange-500' },
];

const tooltipStyle = {
  background: 'hsl(240 28% 12%)',
  border: '1px solid hsl(240 30% 30% / 0.5)',
  borderRadius: 12,
  color: '#fff',
  fontSize: 13,
};

const Analytics = () => {
  return (
    <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
      <Navbar />
      <div className="container py-10">
        <h1 className="mb-8 font-display text-3xl font-bold">Аналитика</h1>

        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="glass rounded-2xl p-5">
              <span className={`mb-4 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${k.color}`}>
                <Icon name={k.icon} size={18} className="text-white" />
              </span>
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold">{k.value}</span>
                <span className="text-xs text-emerald-400">{k.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass rounded-3xl p-6 lg:col-span-2">
            <h3 className="mb-1 font-display text-lg font-semibold">Посещения за неделю</h3>
            <p className="mb-6 text-sm text-muted-foreground">Динамика уникальных посетителей по дням</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={visitsData}>
                <defs>
                  <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(190 95% 55%)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="hsl(270 95% 65%)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 20% 25%)" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(240 12% 65%)" tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(240 12% 65%)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="visits" stroke="hsl(190 95% 55%)" strokeWidth={2} fill="url(#visitsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="mb-1 font-display text-lg font-semibold">Источники трафика</h3>
            <p className="mb-6 text-sm text-muted-foreground">Откуда приходят посетители</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sourcesData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 20% 25%)" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="source" type="category" stroke="hsl(240 12% 65%)" tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'hsl(240 20% 25% / 0.3)' }} />
                <Bar dataKey="value" fill="hsl(330 90% 60%)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
