import { useState } from 'react';
import Icon from '@/components/ui/icon';

const navItems = ['Главная', 'Редактор', 'Шаблоны', 'Проекты', 'Публикация', 'Аналитика', 'Профиль', 'Поддержка'];

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
  { n: '02', t: 'Получите макет', d: 'Нейросеть соберёт первую версию' },
  { n: '03', t: 'Настройте под себя', d: 'Меняйте блоки в редакторе' },
  { n: '04', t: 'Опубликуйте', d: 'Сайт онлайн за один клик' },
];

const Index = () => {
  const [active, setActive] = useState('Главная');

  return (
    <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
      {/* Floating blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="animate-blob absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="animate-blob absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-accent/25 blur-3xl" style={{ animationDelay: '4s' }} />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2 font-display text-xl font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 glow">
              <Icon name="Boxes" size={20} className="text-white" />
            </span>
            Konstr<span className="text-gradient">AI</span>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active === item ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
          <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 glow">
            Создать сайт
          </button>
        </div>
      </header>

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
            <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-7 py-3.5 font-semibold text-white transition-transform hover:scale-105 glow">
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

        <div className="animate-float-up relative" style={{ animationDelay: '0.25s' }}>
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-fuchsia-500/40 to-cyan-400/40 blur-2xl" />
          <img
            src="https://cdn.poehali.dev/projects/c63e59bd-6c27-47a5-b468-4846fc27ab57/files/ac5c3fd5-8a15-49f1-8c16-1b6fa9d669e3.jpg"
            alt="AI конструктор"
            className="w-full rounded-[2rem] border border-white/10 shadow-2xl"
          />
          <div className="glass absolute -bottom-5 -left-5 flex items-center gap-3 rounded-2xl px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500">
              <Icon name="Check" size={18} className="text-white" />
            </span>
            <div className="text-sm"><div className="font-semibold text-white">Сайт готов</div><div className="text-muted-foreground">за 1 минуту 47 секунд</div></div>
          </div>
        </div>
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
          <button className="relative mt-9 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-10 py-4 font-semibold text-white transition-transform hover:scale-105 glow">
            Создать сайт бесплатно
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2 font-display font-bold text-white">
            <Icon name="Boxes" size={18} className="text-secondary" /> KonstrAI
          </div>
          <p>© 2026 KonstrAI. Конструктор сайтов на базе AI.</p>
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
