import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Navbar from '@/components/layout/Navbar';
import { createSiteId, saveSite } from '@/lib/sites';

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

const ideas = ['Кофейня в центре города', 'Портфолио фотографа', 'Магазин кроссовок', 'Студия йоги', 'IT-стартап'];

const genStages = ['Анализирую идею…', 'Подбираю палитру и шрифты…', 'Генерирую секции и тексты…', 'Собираю макет…'];



type SiteResult = {
  name: string;
  tagline: string;
  palette: string;
  sections: { tag: string; description: string }[];
};

const sectionColors = [
  'from-fuchsia-500/30 to-purple-600/30',
  'from-cyan-400/30 to-blue-500/30',
  'from-pink-500/30 to-rose-500/30',
  'from-emerald-400/30 to-teal-500/30',
  'from-amber-400/30 to-orange-500/30',
  'from-violet-500/30 to-indigo-600/30',
  'from-sky-400/30 to-cyan-500/30',
];

const Index = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<SiteResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const generate = async () => {
    if (!prompt.trim() || phase === 'loading') return;
    setPhase('loading');
    setStage(0);
    setResult(null);

    const stageTimer = genStages.map((_, i) =>
      setTimeout(() => setStage(i), i * 900)
    );

    try {
      const resp = await fetch('https://functions.poehali.dev/b374dc4b-ef26-4b6e-8152-1e0c95fe8081', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await resp.json();
      stageTimer.forEach(clearTimeout);
      if (!resp.ok || data.error) {
        setErrorMsg(data.error || 'Ошибка от AI. Проверьте ключ OpenAI и баланс аккаунта.');
        setPhase('error');
        return;
      }
      if (!data.sections || !Array.isArray(data.sections)) {
        setErrorMsg('AI вернул неожиданный ответ. Попробуйте ещё раз.');
        setPhase('error');
        return;
      }
      setResult(data as SiteResult);
      setPhase('done');
    } catch {
      stageTimer.forEach(clearTimeout);
      setErrorMsg('Не удалось связаться с сервером. Попробуйте ещё раз.');
      setPhase('error');
    }
  };

  const goToEditor = () => {
    if (!result) return;
    const now = Date.now();
    const site = {
      id: createSiteId(),
      name: result.name,
      tagline: result.tagline,
      palette: result.palette,
      sections: result.sections,
      createdAt: now,
      updatedAt: now,
      published: false,
    };
    saveSite(site);
    navigate(`/editor/${site.id}`);
  };

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

          <div className="glass overflow-hidden rounded-[2rem] p-6 shadow-2xl">
            {/* Window bar */}
            <div className="mb-5 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-3 text-xs text-muted-foreground">AI-конструктор</span>
            </div>

            {/* Prompt input */}
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <Icon name="Wand2" size={16} className="text-secondary" /> Опишите сайт мечты
            </label>
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:flex-row">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && generate()}
                placeholder="Например: кофейня в центре города…"
                className="w-full bg-transparent px-2 text-sm text-white outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={generate}
                disabled={phase === 'loading'}
                className="shrink-0 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60"
              >
                {phase === 'loading' ? <Icon name="Loader2" size={16} className="animate-spin" /> : 'Создать'}
              </button>
            </div>

            {/* Idea chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {ideas.map((i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(i)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-white"
                >
                  {i}
                </button>
              ))}
            </div>

            {/* Preview area */}
            <div className="mt-5 min-h-[230px] rounded-2xl border border-white/10 bg-background/40 p-4">
              {phase === 'idle' && (
                <div className="flex h-[200px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
                  <Icon name="Sparkles" size={28} className="mb-3 text-primary" />
                  Введите идею — AI соберёт макет сайта
                </div>
              )}

              {phase === 'loading' && (
                <div className="flex h-[200px] flex-col items-center justify-center gap-4">
                  <div className="relative grid h-14 w-14 place-items-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                    <Icon name="Brain" size={28} className="text-secondary" />
                  </div>
                  <div className="space-y-1.5 text-center">
                    {genStages.map((s, i) => (
                      <div key={s} className={`flex items-center justify-center gap-2 text-sm transition-colors ${i <= stage ? 'text-white' : 'text-muted-foreground/40'}`}>
                        {i < stage ? <Icon name="Check" size={14} className="text-emerald-400" /> : i === stage ? <Icon name="Loader2" size={14} className="animate-spin text-secondary" /> : <span className="h-3.5 w-3.5" />}
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {phase === 'error' && (
                <div className="flex h-[200px] flex-col items-center justify-center gap-3 text-center">
                  <Icon name="AlertCircle" size={28} className="text-rose-400" />
                  <p className="text-sm text-muted-foreground">{errorMsg}</p>
                  <button onClick={() => setPhase('idle')} className="text-sm text-white underline">Попробовать снова</button>
                </div>
              )}

              {phase === 'done' && result && (
                <div className="space-y-2">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
                        <Icon name="Check" size={14} className="text-white" />
                      </span>
                      {result.name}
                    </div>
                    {result.tagline && (
                      <p className="mt-1 pl-8 text-xs text-muted-foreground">{result.tagline}</p>
                    )}
                  </div>
                  {result.sections.map((s, i) => (
                    <div
                      key={s.tag}
                      className={`animate-float-up rounded-xl border border-white/10 bg-gradient-to-r ${sectionColors[i % sectionColors.length]} px-4 py-2.5`}
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="GripVertical" size={14} className="text-white/50" />
                        <span className="text-sm font-medium text-white">{s.tag}</span>
                      </div>
                      {s.description && (
                        <p className="mt-0.5 pl-5 text-xs text-white/60">{s.description}</p>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={goToEditor}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] glow"
                  >
                    Перейти в редактор <Icon name="ArrowRight" size={16} />
                  </button>
                  <button
                    onClick={() => { setPhase('idle'); setPrompt(''); setResult(null); }}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2 text-sm text-muted-foreground transition-colors hover:text-white"
                  >
                    <Icon name="RotateCcw" size={14} /> Сгенерировать заново
                  </button>
                </div>
              )}
            </div>
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