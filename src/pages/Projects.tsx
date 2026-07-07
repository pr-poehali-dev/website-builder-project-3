import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { deleteSite, getSites, Site } from '@/lib/sites';

const Projects = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);

  useEffect(() => {
    setSites(getSites().sort((a, b) => b.updatedAt - a.updatedAt));
  }, []);

  const handleDelete = (id: string) => {
    if (!window.confirm('Удалить этот проект? Действие необратимо.')) return;
    deleteSite(id);
    setSites(getSites().sort((a, b) => b.updatedAt - a.updatedAt));
  };

  return (
    <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
      <Navbar />
      <div className="container py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-3xl font-bold">Мои проекты</h1>
          <Link
            to="/"
            className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 glow"
          >
            + Новый сайт
          </Link>
        </div>

        {sites.length === 0 ? (
          <div className="glass mx-auto mt-12 max-w-lg rounded-3xl p-10 text-center">
            <Icon name="FolderOpen" size={40} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-display text-2xl font-bold">Проектов пока нет</h2>
            <p className="mt-2 text-muted-foreground">Создайте свой первый сайт с помощью AI-конструктора.</p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-6 py-3 font-semibold text-white transition-transform hover:scale-105 glow"
            >
              <Icon name="Sparkles" size={16} /> Создать первый сайт
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((s) => (
              <div key={s.id} className="glass flex flex-col rounded-2xl p-6">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">{s.name}</h3>
                  <Badge variant={s.published ? 'default' : 'outline'}>
                    {s.published ? 'Опубликован' : 'Черновик'}
                  </Badge>
                </div>
                <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">{s.tagline}</p>
                <div className="mb-4 space-y-1 text-xs text-muted-foreground">
                  <div>Создан: {new Date(s.createdAt).toLocaleDateString('ru-RU')}</div>
                  <div>Обновлён: {new Date(s.updatedAt).toLocaleDateString('ru-RU')}</div>
                  <div>{s.sections.length} секций</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/editor/${s.id}`)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
                  >
                    <Icon name="Pencil" size={14} /> Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="flex items-center justify-center rounded-xl border border-rose-500/30 px-3 text-rose-400 transition-colors hover:bg-rose-500/10"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
