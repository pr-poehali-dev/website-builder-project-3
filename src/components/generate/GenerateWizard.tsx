import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { createSiteId, saveSite } from '@/lib/sites';
import { siteStyles, siteTypes } from '@/lib/siteStyles';

const genStages = ['Анализирую идею…', 'Подбираю стиль и структуру…', 'Генерирую секции и тексты…', 'Собираю макет…'];

type SiteResult = {
  name: string;
  tagline: string;
  palette: string;
  sections: { tag: string; description: string }[];
};

type WizardStep = 'type' | 'style' | 'prompt' | 'loading' | 'done' | 'error';

const sectionColors = [
  'from-fuchsia-500/30 to-purple-600/30',
  'from-cyan-400/30 to-blue-500/30',
  'from-pink-500/30 to-rose-500/30',
  'from-emerald-400/30 to-teal-500/30',
  'from-amber-400/30 to-orange-500/30',
  'from-violet-500/30 to-indigo-600/30',
  'from-sky-400/30 to-cyan-500/30',
];

const GenerateWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>('type');
  const [typeKey, setTypeKey] = useState('');
  const [styleKey, setStyleKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<SiteResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedType = siteTypes.find((t) => t.key === typeKey);
  const selectedStyle = siteStyles.find((s) => s.key === styleKey);

  const reset = () => {
    setStep('type');
    setTypeKey('');
    setStyleKey('');
    setPrompt('');
    setResult(null);
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setStep('loading');
    setStage(0);

    const stageTimer = genStages.map((_, i) => setTimeout(() => setStage(i), i * 900));

    try {
      const resp = await fetch('https://functions.poehali.dev/b374dc4b-ef26-4b6e-8152-1e0c95fe8081', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          typeLabel: selectedType?.label || '',
          styleLabel: selectedStyle?.label || '',
          styleHint: selectedStyle?.hint || '',
        }),
      });
      const data = await resp.json();
      stageTimer.forEach(clearTimeout);
      if (!resp.ok || data.error) {
        setErrorMsg(data.error || 'Ошибка от AI. Попробуйте ещё раз.');
        setStep('error');
        return;
      }
      if (!data.sections || !Array.isArray(data.sections)) {
        setErrorMsg('AI вернул неожиданный ответ. Попробуйте ещё раз.');
        setStep('error');
        return;
      }
      setResult(data as SiteResult);
      setStep('done');
    } catch {
      stageTimer.forEach(clearTimeout);
      setErrorMsg('Не удалось связаться с сервером. Попробуйте ещё раз.');
      setStep('error');
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
      styleKey,
      typeKey,
      sections: result.sections,
      createdAt: now,
      updatedAt: now,
      published: false,
    };
    saveSite(site);
    navigate(`/editor/${site.id}`);
  };

  return (
    <div className="glass overflow-hidden rounded-[2rem] p-6 shadow-2xl">
      <div className="mb-5 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-rose-500/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs text-muted-foreground">AI-конструктор</span>
        {step !== 'type' && step !== 'loading' && step !== 'done' && step !== 'error' && (
          <button
            onClick={() => setStep(step === 'style' ? 'type' : 'style')}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-white"
          >
            <Icon name="ArrowLeft" size={12} /> Назад
          </button>
        )}
      </div>

      {step === 'type' && (
        <div>
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <Icon name="LayoutGrid" size={16} className="text-secondary" /> Какой сайт хотите создать?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {siteTypes.map((t) => (
              <button
                key={t.key}
                onClick={() => { setTypeKey(t.key); setStep('style'); }}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-left text-sm text-white transition-colors hover:border-white/30 hover:bg-white/[0.06]"
              >
                <Icon name={t.icon} size={16} className="text-secondary shrink-0" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'style' && (
        <div>
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
            <Icon name="Palette" size={16} className="text-secondary" /> Выберите стиль дизайна
          </label>
          <div className="grid grid-cols-2 gap-2">
            {siteStyles.map((s) => (
              <button
                key={s.key}
                onClick={() => { setStyleKey(s.key); setStep('prompt'); }}
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
        </div>
      )}

      {step === 'prompt' && (
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <Icon name="Wand2" size={16} className="text-secondary" /> Опишите сайт мечты
          </label>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {selectedType && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground">{selectedType.label}</span>
            )}
            {selectedStyle && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground">{selectedStyle.label}</span>
            )}
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:flex-row">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && generate()}
              placeholder="Например: кофейня в центре города…"
              autoFocus
              className="w-full bg-transparent px-2 text-sm text-white outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={generate}
              disabled={!prompt.trim()}
              className="shrink-0 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-60"
            >
              Создать
            </button>
          </div>
        </div>
      )}

      {step === 'loading' && (
        <div className="flex h-[230px] flex-col items-center justify-center gap-4">
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

      {step === 'error' && (
        <div className="flex h-[230px] flex-col items-center justify-center gap-3 text-center">
          <Icon name="AlertCircle" size={28} className="text-rose-400" />
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
          <button onClick={() => setStep('prompt')} className="text-sm text-white underline">Попробовать снова</button>
        </div>
      )}

      {step === 'done' && result && (
        <div className="space-y-2">
          <div className="mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
                <Icon name="Check" size={14} className="text-white" />
              </span>
              {result.name}
            </div>
            {result.tagline && <p className="mt-1 pl-8 text-xs text-muted-foreground">{result.tagline}</p>}
          </div>
          <div className="max-h-[230px] space-y-2 overflow-y-auto pr-1">
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
                {s.description && <p className="mt-0.5 pl-5 text-xs text-white/60">{s.description}</p>}
              </div>
            ))}
          </div>
          <button
            onClick={goToEditor}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] glow"
          >
            Перейти в редактор <Icon name="ArrowRight" size={16} />
          </button>
          <button
            onClick={reset}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2 text-sm text-muted-foreground transition-colors hover:text-white"
          >
            <Icon name="RotateCcw" size={14} /> Сгенерировать заново
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateWizard;
