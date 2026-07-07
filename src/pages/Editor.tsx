import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getSite, getSites, saveSite, Site, SiteSection } from '@/lib/sites';

const sectionColors = [
  'from-fuchsia-500/30 to-purple-600/30',
  'from-cyan-400/30 to-blue-500/30',
  'from-pink-500/30 to-rose-500/30',
  'from-emerald-400/30 to-teal-500/30',
  'from-amber-400/30 to-orange-500/30',
  'from-violet-500/30 to-indigo-600/30',
  'from-sky-400/30 to-cyan-500/30',
];

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState<Site | null>(null);
  const [recentSites, setRecentSites] = useState<Site[]>([]);

  useEffect(() => {
    if (id) {
      const found = getSite(id);
      setSite(found ?? null);
    } else {
      setRecentSites(getSites().sort((a, b) => b.updatedAt - a.updatedAt));
    }
  }, [id]);

  const updateField = (field: 'name' | 'tagline', value: string) => {
    if (!site) return;
    setSite({ ...site, [field]: value });
  };

  const updateSection = (index: number, field: keyof SiteSection, value: string) => {
    if (!site) return;
    const sections = site.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    setSite({ ...site, sections });
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    if (!site) return;
    const target = index + direction;
    if (target < 0 || target >= site.sections.length) return;
    const sections = [...site.sections];
    [sections[index], sections[target]] = [sections[target], sections[index]];
    setSite({ ...site, sections });
  };

  const removeSection = (index: number) => {
    if (!site) return;
    setSite({ ...site, sections: site.sections.filter((_, i) => i !== index) });
  };

  const addSection = () => {
    if (!site) return;
    setSite({ ...site, sections: [...site.sections, { tag: 'Новая секция', description: 'Описание секции' }] });
  };

  const handleSave = () => {
    if (!site) return;
    const updated = { ...site, updatedAt: Date.now() };
    saveSite(updated);
    setSite(updated);
    toast.success('Изменения сохранены');
  };

  const handlePublishClick = () => {
    if (!site) return;
    saveSite(site);
    navigate('/publication');
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
    <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
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

      <div className="container grid gap-8 py-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-5">
          <div className="glass rounded-2xl p-5">
            <label className="mb-2 block text-sm font-medium text-white">Название сайта</label>
            <Input value={site.name} onChange={(e) => updateField('name', e.target.value)} />
            <label className="mb-2 mt-4 block text-sm font-medium text-white">Tagline</label>
            <Textarea value={site.tagline} onChange={(e) => updateField('tagline', e.target.value)} rows={3} />
          </div>

          <div className="space-y-3">
            {site.sections.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">Секция {i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSection(i, -1)}
                      disabled={i === 0}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    >
                      <Icon name="ArrowUp" size={14} />
                    </button>
                    <button
                      onClick={() => moveSection(i, 1)}
                      disabled={i === site.sections.length - 1}
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    >
                      <Icon name="ArrowDown" size={14} />
                    </button>
                    <button
                      onClick={() => removeSection(i)}
                      className="rounded-lg p-1.5 text-rose-400 transition-colors hover:bg-rose-500/10"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>
                </div>
                <Input
                  value={s.tag}
                  onChange={(e) => updateSection(i, 'tag', e.target.value)}
                  className="mb-2"
                  placeholder="Название секции"
                />
                <Textarea
                  value={s.description}
                  onChange={(e) => updateSection(i, 'description', e.target.value)}
                  rows={2}
                  placeholder="Описание секции"
                />
              </div>
            ))}
            <button
              onClick={addSection}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 py-3 text-sm text-muted-foreground transition-colors hover:text-white"
            >
              <Icon name="Plus" size={16} /> Добавить секцию
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-3 font-semibold text-white transition-transform hover:scale-[1.02] glow"
          >
            <Icon name="Save" size={16} /> Сохранить изменения
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-tr from-fuchsia-500/20 to-cyan-400/20 blur-2xl" />
          <div className="glass sticky top-24 overflow-hidden rounded-[2rem] p-4 shadow-2xl">
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
            <div className="max-h-[calc(100vh-220px)] overflow-y-auto rounded-2xl bg-background/40">
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
