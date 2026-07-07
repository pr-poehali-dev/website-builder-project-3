import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const [name, setName] = useState('Александр Иванов');
  const [email, setEmail] = useState('alex@example.com');

  return (
    <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
      <Navbar />
      <div className="container py-10">
        <h1 className="mb-8 font-display text-3xl font-bold">Профиль</h1>

        <div className="mx-auto max-w-xl space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="mb-6 flex items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400">
                <Icon name="User" size={28} className="text-white" />
              </span>
              <div>
                <p className="font-display font-semibold">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium text-white">Имя</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mb-4" />

            <label className="mb-2 block text-sm font-medium text-white">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">Тариф</h3>
                <p className="mt-1 text-sm text-muted-foreground">Ваш текущий план подписки</p>
              </div>
              <Badge variant="outline">Бесплатный</Badge>
            </div>
            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-3 font-semibold text-white transition-transform hover:scale-[1.02] glow">
              <Icon name="Crown" size={16} /> Улучшить тариф
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
