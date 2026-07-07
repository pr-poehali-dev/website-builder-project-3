import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { getSite, getSites, saveSite, Site } from '@/lib/sites';

const sectionColors = [
  'from-fuchsia-500/30 to-purple-600/30',
  'from-cyan-400/30 to-blue-500/30',
  'from-pink-500/30 to-rose-500/30',
  'from-emerald-400/30 to-teal-500/30',
  'from-amber-400/30 to-orange-500/30',
  'from-violet-500/30 to-indigo-600/30',
  'from-sky-400/30 to-cyan-500/30',
];

type ChatMessage = { role: 'user' | 'assistant'; text: string };

const EDIT_SITE_URL = 'https://functions.poehali.dev/ae4b5be3-d49e-44ce-873b-a0dd746a4092';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [recentSites, setRecentSites] = useState<Site[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const found = getSite(id);
      setSite(found ?? null);
      setMessages(
        found
          ? [{ role: 'assistant', text: `Готово! Я собрал сайт «${found.name}». Напишите, что поправить — например: «поменяй заголовок» или «добавь секцию с отзывами».` }]
          : []
      );
    } else {
      setRecentSites(getSites().sort((a, b) => b.updatedAt - a.updatedAt));
    }
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handlePublishClick = () => {
    if (!site) return;
    saveSite(site);
    navigate('/publication');
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !site) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch(EDIT_SITE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, site }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setMessages((prev) => [...prev, { role: 'assistant', text: 'Не получилось внести правку. Попробуйте переформулировать запрос.' }]);
        setLoading(false);
        return;
      }
      const updated: Site = {
        ...site,
        name: data.name ?? site.name,
        tagline: data.tagline ?? site.tagline,
        palette: data.palette ?? site.palette,
        sections: Array.isArray(data.sections) ? data.sections : site.sections,
        updatedAt: Date.now(),
      };
      setSite(updated);
      saveSite(updated);
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Готово, обновил сайт — посмотрите превью справа.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Не удалось связаться с сервером. Попробуйте ещё раз.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
        <Navbar />
        <div className="container py-10">
          {recentSites.length === 0 ? (
            <div className="glass mx-auto mt-20 max-w-lg rounded-3xl p-10 text-center">
              <Icon name="FolderOpen" size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-display text-2xl font-bold">У вас пока нет проектов</h2>
              <p className="mt-2 text-muted-foreground">Опишите идею на главной — AI соберёт для вас первый макет.</p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 font-semibold text-white transition-transform hover:scale-105 glow"
              >
                <Icon name="Sparkles" size={16} /> Создать сайт
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="mb-6 font-display text-3xl font-bold">Выберите проект</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recentSites.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/editor/${s.id}`)}
                    className="glass rounded-2xl p-6 text-left transition-transform hover:-translate-y-1"
                  >
                    <h3 className="font-display text-lg font-semibold">{s.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.tagline}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
        <Navbar />
        <div className="container py-10">
          <div className="glass mx-auto mt-20 max-w-lg rounded-3xl p-10 text-center">
            <Icon name="AlertCircle" size={40} className="mx-auto mb-4 text-rose-400" />
            <h2 className="font-display text-2xl font-bold">Проект не найден</h2>
            <p className="mt-2 text-muted-foreground">Возможно, он был удалён.</p>
            <Link
              to="/projects"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 font-semibold text-white transition-transform hover:scale-105 glow"
            >
              Все проекты
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden mesh-bg text-foreground">
      <Navbar />

      <div className="border-b border-white/10">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="text-xs text-muted-foreground">Редактирование проекта</p>
            <h1 className="font-display text-xl font-bold">{site.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/projects')}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Все проекты
            </button>
            <button
              onClick={handlePublishClick}
              className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 glow"
            >
              Опубликовать
            </button>
          </div>
        </div>
      </div>

      <div className="container grid min-h-0 flex-1 gap-6 py-6 lg:grid-cols-[380px_1fr]">
        <div className="glass flex min-h-0 flex-col rounded-2xl">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Icon name="Sparkles" size={16} className="text-secondary" /> Чат с AI
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Опишите, что изменить в сайте — заголовок, текст, секции, палитру.</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-white'
                      : 'border border-white/10 bg-white/[0.04] text-white'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-muted-foreground">
                  <Icon name="Loader2" size={14} className="animate-spin text-secondary" /> Вношу правки…
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Например: поменяй заголовок на «Свежий кофе рядом»…"
                rows={2}
                className="w-full resize-none bg-transparent px-2 py-1.5 text-sm text-white outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="shrink-0 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 p-2.5 text-white transition-transform hover:scale-105 disabled:opacity-40"
              >
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-0">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-fuchsia-500/20 to-cyan-400/20 blur-2xl" />
          <div className="glass flex h-full flex-col overflow-hidden rounded-[2rem] p-4 shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-3 text-xs text-muted-foreground">Превью — {site.name}</span>
              <span className="ml-auto">
                <Badge variant={site.published ? 'default' : 'outline'}>
                  {site.published ? 'Опубликован' : 'Черновик'}
                </Badge>
              </span>
            </div>
            <div className="flex-1 overflow-y-auto rounded-2xl bg-background/40">
              <div className="border-b border-white/10 px-8 py-16 text-center">
                <h2 className="font-display text-4xl font-black leading-tight">{site.name || 'Название сайта'}</h2>
                <p className="mx-auto mt-4 max-w-md text-muted-foreground">{site.tagline || 'Tagline сайта появится здесь'}</p>
              </div>
              {site.sections.map((s, i) => (
                <div
                  key={i}
                  className={`border-b border-white/5 bg-gradient-to-br ${sectionColors[i % sectionColors.length]} px-8 py-14 text-center`}
                >
                  <h3 className="font-display text-2xl font-bold text-white">{s.tag || 'Название секции'}</h3>
                  <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">{s.description || 'Описание секции'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
