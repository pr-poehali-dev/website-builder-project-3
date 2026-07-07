import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSites, saveSite, Site } from '@/lib/sites';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-я0-9\s-]/gi, '')
    .replace(/\s+/g, '-');

const Publication = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [subdomain, setSubdomain] = useState('');

  useEffect(() => {
    const all = getSites().sort((a, b) => b.updatedAt - a.updatedAt);
    setSites(all);
    if (all.length > 0) {
      setSelectedId(all[0].id);
      setSubdomain(all[0].domain || slugify(all[0].name));
    }
  }, []);

  const selected = sites.find((s) => s.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const s = sites.find((x) => x.id === id);
    if (s) setSubdomain(s.domain || slugify(s.name));
  };

  const handlePublish = () => {
    if (!selected) return;
    const updated: Site = { ...selected, published: true, domain: subdomain, updatedAt: Date.now() };
    saveSite(updated);
    setSites(getSites().sort((a, b) => b.updatedAt - a.updatedAt));
    toast.success('Сайт опубликован');
  };

  if (sites.length === 0) {
    return (
      <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
        <Navbar />
        <div className="container py-10">
          <div className="glass mx-auto mt-20 max-w-lg rounded-3xl p-10 text-center">
            <Icon name="Globe" size={40} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-2xl font-bold">Нет проектов для публикации</h2>
            <p className="mt-2 text-muted-foreground">Создайте сайт, чтобы опубликовать его онлайн.</p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 font-semibold text-white transition-transform hover:scale-105 glow"
            >
              <Icon name="Sparkles" size={16} /> Создать сайт
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
      <Navbar />
      <div className="container py-10">
        <h1 className="mb-8 font-display text-3xl font-bold">Публикация сайта</h1>

        <div className="mx-auto max-w-xl space-y-6">
          {sites.length > 1 && (
            <div className="glass rounded-2xl p-5">
              <label className="mb-2 block text-sm font-medium text-white">Выберите проект</label>
              <Select value={selectedId} onValueChange={handleSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите проект" />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selected && (
            <>
              <div className="glass rounded-2xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">{selected.name}</h3>
                  <Badge variant={selected.published ? 'default' : 'outline'}>
                    {selected.published ? 'Опубликован' : 'Не опубликован'}
                  </Badge>
                </div>
                <label className="mb-2 block text-sm font-medium text-white">Поддомен</label>
                <div className="flex items-center gap-2">
                  <Input value={subdomain} onChange={(e) => setSubdomain(slugify(e.target.value))} placeholder="mysite" />
                  <span className="whitespace-nowrap text-sm text-muted-foreground">.konstrai.app</span>
                </div>

                <button
                  onClick={handlePublish}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-3 font-semibold text-white transition-transform hover:scale-[1.02] glow"
                >
                  <Icon name="Rocket" size={16} /> Опубликовать сайт
                </button>

                {selected.published && (
                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm">
                    <p className="text-muted-foreground">Ваш сайт доступен по адресу:</p>
                    <p className="mt-1 font-medium text-gradient">https://{subdomain}.konstrai.app</p>
                  </div>
                )}
              </div>

              <div className="glass flex items-start gap-3 rounded-2xl p-5">
                <Icon name="ShieldCheck" size={20} className="mt-0.5 text-emerald-400" />
                <p className="text-sm text-muted-foreground">
                  SSL-сертификат подключается автоматически для всех опубликованных сайтов — ваш домен всегда защищён.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Publication;
