import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { createSiteId, saveSite } from '@/lib/sites';
import { siteStyles } from '@/lib/siteStyles';

const GENERATE_URL = 'https://functions.poehali.dev/b374dc4b-ef26-4b6e-8152-1e0c95fe8081';
const IDEA_REPLY_URL = 'https://functions.poehali.dev/1d1f4140-d5f7-44bb-b10c-688516703e5a';
const genStages = ['Анализирую идею…', 'Подбираю стиль и структуру…', 'Генерирую секции и тексты…', 'Собираю макет…'];

type Step = 'prompt' | 'thinking' | 'style' | 'loading' | 'error';
type Msg = { role: 'user' | 'assistant'; text: string };

const Bubble = ({ role, text }: Msg) => {
  if (role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-2.5 text-sm text-white">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400">
          <Icon name="Sparkles" size={12} className="text-white" />
        </span>
        <span className="text-sm font-semibold text-white">EasySait</span>
      </div>
      <p className="pl-8 text-sm text-white/80">{text}</p>
    </div>
  );
};

const Generate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('prompt');
  const [styleKey, setStyleKey] = useState('');
  const [promptText, setPromptText] = useState('');
  const [ideaText, setIdeaText] = useState('');
  const [stage, setStage] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', text: 'Привет! Опишите сайт, который хотите создать — для кого он и что должно быть на нём.' },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step]);

  const submitIdea = async () => {
    if (!promptText.trim() || step !== 'prompt') return;
    const text = promptText.trim();
    setIdeaText(text);
    setMessages((m) => [...m, { role: 'user', text }]);
    setPromptText('');
    setStep('thinking');

    try {
      const resp = await fetch(IDEA_REPLY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await resp.json();
      const reply = resp.ok && data.reply ? data.reply : 'Отличная идея! Давайте подберём для неё стиль оформления.';
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: `${reply} Теперь выберите стиль дизайна для сайта.` },
      ]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Отличная идея! Теперь выберите стиль дизайна для сайта.' }]);
    }
    setStep('style');
  };

  const selectStyle = (s: (typeof siteStyles)[number]) => {
    setStyleKey(s.key);
    setMessages((m) => [...m, { role: 'user', text: s.label }]);
    setStep('loading');
    generate(ideaText, s);
  };

  const generate = async (text: string, style: (typeof siteStyles)[number]) => {
    setStage(0);
    const timers = genStages.map((_, i) => setTimeout(() => setStage(i), i * 900));

    try {
      const resp = await fetch(GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          typeLabel: '',
          styleLabel: style.label,
          styleHint: style.hint,
        }),
      });
      const data = await resp.json();
      timers.forEach(clearTimeout);

      if (!resp.ok || data.error || !Array.isArray(data.sections)) {
        setErrorMsg(data.error || 'Не удалось сгенерировать сайт. Попробуйте ещё раз.');
        setStep('error');
        return;
      }

      const now = Date.now();
      const site = {
        id: createSiteId(),
        name: data.name,
        tagline: data.tagline,
        palette: data.palette,
        styleKey: style.key,
        sections: data.sections,
        createdAt: now,
        updatedAt: now,
        published: false,
      };
      saveSite(site);
      setMessages((m) => [...m, { role: 'assistant', text: `Готово! Открываю сайт «${site.name}»…` }]);
      setTimeout(() => navigate(`/editor/${site.id}`), 600);
    } catch {
      timers.forEach(clearTimeout);
      setErrorMsg('Не удалось связаться с сервером. Попробуйте ещё раз.');
      setStep('error');
    }
  };

  const retry = () => setStep('style');

  return (
    <div className="flex h-screen flex-col overflow-hidden mesh-bg text-foreground">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400">
            <Icon name="Boxes" size={16} className="text-white" />
          </span>
          Easy<span className="text-gradient">Sait</span>
        </Link>
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-white">
          <Icon name="X" size={16} /> Закрыть
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 px-6 py-10">
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} text={m.text} />
          ))}

          {step === 'prompt' && (
            <div className="pl-8">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      submitIdea();
                    }
                  }}
                  placeholder="Например: кофейня в центре города, тёплая атмосфера, авторские десерты…"
                  rows={8}
                  autoFocus
                  className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-muted-foreground"
                />
                <div className="mt-3 flex items-center justify-end gap-3 border-t border-white/10 pt-3">
                  <span className="text-xs text-muted-foreground">Ctrl+Enter, чтобы отправить</span>
                  <button
                    onClick={submitIdea}
                    disabled={!promptText.trim()}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-40"
                  >
                    Создать <Icon name="Send" size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'thinking' && (
            <div className="flex items-center gap-2 pl-8">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400">
                <Icon name="Sparkles" size={12} className="text-white" />
              </span>
              <Icon name="Loader2" size={14} className="animate-spin text-secondary" />
              <span className="text-sm text-muted-foreground">Обдумываю идею…</span>
            </div>
          )}

          {step === 'style' && (
            <div className="grid grid-cols-2 gap-2 pl-8">
              {siteStyles.map((s) => (
                <button
                  key={s.key}
                  onClick={() => selectStyle(s)}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-left transition-colors hover:border-white/30 hover:bg-white/[0.06]"
                >
                  <span className={`h-6 w-6 shrink-0 rounded-full ${s.swatch}`} />
                  <span>
                    <span className="block text-sm font-medium text-white">{s.label}</span>
                    <span className="block text-[11px] text-muted-foreground">{s.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {step === 'loading' && (
            <div className="space-y-1.5 pl-8">
              {genStages.map((s, i) => (
                <div key={s} className={`flex items-center gap-2 text-sm transition-colors ${i <= stage ? 'text-white' : 'text-muted-foreground/40'}`}>
                  {i < stage ? (
                    <Icon name="Check" size={14} className="text-emerald-400" />
                  ) : i === stage ? (
                    <Icon name="Loader2" size={14} className="animate-spin text-secondary" />
                  ) : (
                    <span className="h-3.5 w-3.5" />
                  )}
                  {s}
                </div>
              ))}
            </div>
          )}

          {step === 'error' && (
            <div className="pl-8">
              <p className="text-sm text-rose-400">{errorMsg}</p>
              <button onClick={retry} className="mt-2 text-sm text-white underline">
                Попробовать снова
              </button>
            </div>
          )}

          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
};

export default Generate;