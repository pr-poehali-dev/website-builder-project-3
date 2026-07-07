import { useState } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'Как работает AI-генерация сайта?',
    a: 'Вы описываете идею сайта простыми словами на главной странице, а нейросеть анализирует запрос и собирает структуру: название, tagline, палитру и набор секций с текстами. Готовый макет сразу открывается в редакторе.',
  },
  {
    q: 'Можно ли редактировать текст и структуру после генерации?',
    a: 'Да, в редакторе можно менять название сайта, tagline, а также редактировать, добавлять, удалять и менять порядок секций. Все изменения сохраняются автоматически по кнопке "Сохранить изменения".',
  },
  {
    q: 'Как опубликовать готовый сайт?',
    a: 'Перейдите в раздел "Публикация", выберите проект, укажите желаемый поддомен и нажмите "Опубликовать сайт". После этого статус проекта изменится на "Опубликован".',
  },
  {
    q: 'Сколько сайтов можно создать на бесплатном тарифе?',
    a: 'На бесплатном тарифе доступно создание неограниченного числа черновиков, но для расширенных возможностей публикации и аналитики рекомендуется перейти на платный план в разделе "Профиль".',
  },
  {
    q: 'Где хранятся мои проекты?',
    a: 'Все проекты сохраняются локально в вашем браузере и доступны в разделе "Проекты", где можно посмотреть, отредактировать или удалить любой сайт.',
  },
];

const Support = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    toast.success('Сообщение отправлено');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
      <Navbar />
      <div className="container py-10">
        <h1 className="mb-8 font-display text-3xl font-bold">Поддержка</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass rounded-3xl p-6">
            <h2 className="mb-5 font-display text-xl font-semibold">Частые вопросы</h2>
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
                  <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="glass h-fit rounded-3xl p-6">
            <h2 className="mb-1 font-display text-xl font-semibold">Написать нам</h2>
            <p className="mb-5 text-sm text-muted-foreground">Опишите проблему — мы ответим в течение рабочего дня.</p>

            <label className="mb-2 block text-sm font-medium text-white">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="mb-4" />

            <label className="mb-2 block text-sm font-medium text-white">Сообщение</label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Опишите ваш вопрос" />

            <button
              onClick={handleSubmit}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-3 font-semibold text-white transition-transform hover:scale-[1.02] glow"
            >
              <Icon name="Send" size={16} /> Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
