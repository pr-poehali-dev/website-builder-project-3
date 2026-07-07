import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Navbar from '@/components/layout/Navbar';

const features = [
  { icon: 'Sparkles', title: 'AI-генерация', text: 'Опишите идею словами — нейросеть соберёт текст, картинки и дизайн за секунды.', color: 'from-fuchsia-500 to-purple-600' },
  { icon: 'MousePointerClick', title: 'Без кода', text: 'Перетаскивайте блоки мышкой. Никакого программирования — только ваша фантазия.', color: 'from-cyan-400 to-blue-500' },
  { icon: 'Palette', title: 'Умный дизайн', text: 'AI подбирает шрифты, цвета и анимации, которые работают и продают.', color: 'from-pink-500 to-rose-500' },
  { icon: 'Rocket', title: 'Мгновенный запуск', text: 'Один клик — и сайт онлайн с SSL, своим доменом и хостингом.', color: 'from-violet-500 to-indigo-600' },
  { icon: 'BarChart3', title: 'Аналитика', text: 'Следите за посетителями и конверсиями прямо в панели управления.', color: 'from-emerald-400 to-teal-500' },
  { icon: 'LayoutTemplate', title: 'Шаблоны', text: 'Сотни готовых заготовок для бизнеса, портфолио и магазинов.', color: 'from-amber-400 to-orange-500' },
];

const steps = [
  { n: '01', t: 'Опишите идею', d: 'Расскажите AI, какой сайт хотите' },
  { n: '02', t: 'Выберите стиль', d: 'Стиль дизайна за один клик' },
  { n: '03', t: 'Настройте под себя', d: 'Меняйте блоки в чате с AI' },
  { n: '04', t: 'Опубликуйте', d: 'Сайт онлайн за один клик' },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
      {/* Floating blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-blob absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="animate-blob absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl" style={{ animationDelay: '4s' }} />
      </div>

      <Navbar />

      {/* Hero */}
      <section className="container relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2">
        <div>
          <div className="animate-float-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm">
            <Icon name="Sparkles" size={14} className="text-secondary" />
            <span className="text-muted-foreground">Конструктор с искусственным интеллектом</span>
          </div>
          <h1 className="animate-float-up font-display text-5xl font-black leading-[1.05] md:text-7xl" style={{ animationDelay: '0.1s' }}>
            Сайты, которые <span className="text-gradient">создаёт AI</span>
          </h1>
          <p className="animate-float-up mt-6 max-w-md text-lg text-muted-foreground" style={{ animationDelay: '0.2s' }}>
            Платформа для создания сайтов без кода. Опишите идею — нейросеть соберёт дизайн, контент и запустит проект.
          </p>
          <div className="animate-float-up mt-9 flex flex-wrap gap-4" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => navigate('/generate')}
              className="rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-7 py-3.5 font-semibold text-white transition-transform hover:scale-105 glow"
            >
              Начать бесплатно
            </button>
            <button className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition-colors hover:bg-white/10">
              <Icon name="Play" size={16} className="mr-2 inline" />
              Смотреть демо
            </button>
          </div>
          <div className="animate-float-up mt-10 flex items-center gap-8 text-sm text-muted-foreground" style={{ animationDelay: '0.4s' }}>
            <div><span className="font-display text-2xl font-bold text-white">50k+</span><br />сайтов создано</div>
            <div><span className="font-display text-2xl font-bold text-white">4.9</span><br />рейтинг</div>
            <div><span className="font-display text-2xl font-bold text-white">2 мин</span><br />до запуска</div>
          </div>
        </div>

        <button
          onClick={() => navigate('/generate')}
          className="animate-float-up relative block w-full text-left"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-fuchsia-500/40 to-cyan-400/40 blur-2xl" />
          <div className="glass overflow-hidden rounded-[2rem] p-6 shadow-2xl transition-transform hover:-translate-y-1">
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-3 text-xs text-muted-foreground">AI-конструктор</span>
            </div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <Icon name="Wand2" size={16} className="text-secondary" /> Опишите сайт, который хотите создать
            </label>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground">
              Например: кофейня в центре города, тёплая атмосфера, авторские десерты…
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-3 text-sm font-semibold text-white">
              Начать <Icon name="ArrowRight" size={16} />
            </div>
          </div>
        </button>
      </section>

      {/* Features */}
      <section className="container py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Всё для <span className="text-gradient">вашего сайта</span></h2>
          <p className="mt-4 text-muted-foreground">Мощные инструменты, которые раньше требовали целую команду разработчиков.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group glass rounded-3xl p-7 transition-transform hover:-translate-y-1.5">
              <span className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.color}`}>
                <Icon name={f.icon} size={24} className="text-white" />
              </span>
              <h3 className="font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="container py-20">
        <h2 className="mb-14 text-center font-display text-4xl font-bold md:text-5xl">Как это <span className="text-gradient">работает</span></h2>
        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div className="font-display text-5xl font-black text-gradient">{s.n}</div>
              <h3 className="mt-4 font-semibold text-white">{s.t}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20">
        <div className="glass relative overflow-hidden rounded-[2.5rem] px-8 py-16 text-center md:py-24">
          <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
          <h2 className="relative font-display text-4xl font-black md:text-6xl">Запустите сайт <span className="text-gradient">сегодня</span></h2>
          <p className="relative mx-auto mt-5 max-w-md text-muted-foreground">Никакого кода. Только идея и AI, который воплотит её в жизнь.</p>
          <button
            onClick={() => navigate('/generate')}
            className="relative mt-9 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-10 py-4 font-semibold text-white transition-transform hover:scale-105 glow"
          >
            Создать сайт бесплатно
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2 font-display font-bold text-white">
            <Icon name="Boxes" size={18} className="text-secondary" /> EasySait
          </div>
          <p>© 2026 EasySait. Конструктор сайтов на базе AI.</p>
          <div className="flex gap-4">
            <Icon name="Send" size={18} className="cursor-pointer transition-colors hover:text-white" />
            <Icon name="Github" size={18} className="cursor-pointer transition-colors hover:text-white" />
            <Icon name="Mail" size={18} className="cursor-pointer transition-colors hover:text-white" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;