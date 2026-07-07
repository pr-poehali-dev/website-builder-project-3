import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Icon from '@/components/ui/icon';
import { createSiteId, saveSite } from '@/lib/sites';

const templates = [
  {
    name: 'Уютная кофейня',
    tagline: 'Свежий кофе и атмосфера тепла в самом центре города',
    palette: 'тёплая',
    icon: 'Coffee',
    color: 'from-amber-400 to-orange-500',
    sections: [
      { tag: 'Главная', description: 'Приветственный баннер с фото интерьера и призывом заглянуть на чашку кофе' },
      { tag: 'Меню', description: 'Каталог напитков и десертов с ценами и красивыми фотографиями' },
      { tag: 'О нас', description: 'История кофейни, философия обжарки зёрен и подход к качеству' },
      { tag: 'Отзывы', description: 'Отзывы постоянных гостей о вкусе и атмосфере заведения' },
      { tag: 'Контакты', description: 'Адрес, часы работы и карта проезда до кофейни' },
    ],
  },
  {
    name: 'Портфолио фотографа',
    tagline: 'Кадры, которые остаются в памяти навсегда',
    palette: 'нейтральная',
    icon: 'Camera',
    color: 'from-slate-400 to-zinc-600',
    sections: [
      { tag: 'Галерея', description: 'Подборка лучших работ по категориям: портрет, свадьба, репортаж' },
      { tag: 'Обо мне', description: 'Краткий рассказ о стиле съёмки и профессиональном пути' },
      { tag: 'Услуги', description: 'Пакеты услуг фотосъёмки с описанием и стоимостью' },
      { tag: 'Отзывы клиентов', description: 'Истории и впечатления клиентов от совместной съёмки' },
      { tag: 'Контакты', description: 'Форма для бронирования даты съёмки и связи с фотографом' },
    ],
  },
  {
    name: 'Магазин одежды',
    tagline: 'Стиль, который подчёркивает вашу индивидуальность',
    palette: 'яркая',
    icon: 'Shirt',
    color: 'from-pink-500 to-rose-500',
    sections: [
      { tag: 'Новинки', description: 'Витрина свежих поступлений коллекции сезона' },
      { tag: 'Каталог', description: 'Категории товаров: верхняя одежда, обувь, аксессуары' },
      { tag: 'Акции', description: 'Актуальные скидки и специальные предложения для покупателей' },
      { tag: 'О бренде', description: 'История бренда и ценности, которые он несёт' },
      { tag: 'Доставка и оплата', description: 'Условия доставки, возврата и способы оплаты заказа' },
    ],
  },
  {
    name: 'Фитнес-студия',
    tagline: 'Тренируйся с удовольствием и результатом',
    palette: 'яркая',
    icon: 'Dumbbell',
    color: 'from-emerald-400 to-teal-500',
    sections: [
      { tag: 'Программы тренировок', description: 'Групповые и персональные занятия для разных целей' },
      { tag: 'Тренеры', description: 'Команда сертифицированных тренеров студии с их специализацией' },
      { tag: 'Расписание', description: 'Актуальное расписание занятий по дням недели' },
      { tag: 'Тарифы', description: 'Абонементы и разовые посещения с указанием цен' },
      { tag: 'Записаться', description: 'Форма быстрой записи на пробное занятие' },
    ],
  },
  {
    name: 'IT-стартап',
    tagline: 'Технологии, которые меняют правила игры',
    palette: 'холодная',
    icon: 'Rocket',
    color: 'from-violet-500 to-indigo-600',
    sections: [
      { tag: 'Продукт', description: 'Описание ключевого продукта и решаемых им проблем' },
      { tag: 'Преимущества', description: 'Ключевые фичи и конкурентные преимущества сервиса' },
      { tag: 'Тарифы', description: 'Планы подписки для разных типов пользователей' },
      { tag: 'Команда', description: 'Основатели и ключевые участники команды стартапа' },
      { tag: 'Связаться', description: 'Форма для запроса демо-версии продукта' },
    ],
  },
  {
    name: 'Ресторан',
    tagline: 'Изысканная кухня и незабываемый вечер',
    palette: 'тёплая',
    icon: 'UtensilsCrossed',
    color: 'from-red-500 to-amber-500',
    sections: [
      { tag: 'Главная', description: 'Атмосферное фото зала и приглашение забронировать столик' },
      { tag: 'Меню', description: 'Фирменные блюда шеф-повара и винная карта' },
      { tag: 'Интерьер', description: 'Фотогалерея залов ресторана и банкетной зоны' },
      { tag: 'Бронирование', description: 'Форма онлайн-бронирования столика на нужную дату' },
      { tag: 'Контакты', description: 'Адрес, телефон и часы работы ресторана' },
    ],
  },
  {
    name: 'Салон красоты',
    tagline: 'Красота и уход в руках профессионалов',
    palette: 'яркая',
    icon: 'Sparkles',
    color: 'from-fuchsia-500 to-purple-600',
    sections: [
      { tag: 'Услуги', description: 'Каталог услуг: стрижки, окрашивание, маникюр, уход за кожей' },
      { tag: 'Мастера', description: 'Профили мастеров салона с портфолио работ' },
      { tag: 'Цены', description: 'Прайс-лист на все виды услуг салона' },
      { tag: 'Отзывы', description: 'Отзывы клиенток о качестве обслуживания' },
      { tag: 'Запись онлайн', description: 'Удобная форма записи к мастеру на удобное время' },
    ],
  },
  {
    name: 'Юридические услуги',
    tagline: 'Защита ваших интересов на профессиональном уровне',
    palette: 'нейтральная',
    icon: 'Scale',
    color: 'from-blue-500 to-cyan-600',
    sections: [
      { tag: 'Практики', description: 'Направления юридической помощи: бизнес, недвижимость, семейное право' },
      { tag: 'О компании', description: 'Опыт и достижения юридической фирмы' },
      { tag: 'Юристы', description: 'Команда юристов с указанием специализации и опыта' },
      { tag: 'Кейсы', description: 'Успешные судебные дела и решённые задачи клиентов' },
      { tag: 'Консультация', description: 'Форма записи на первичную бесплатную консультацию' },
    ],
  },
];

const Templates = () => {
  const navigate = useNavigate();

  const useTemplate = (template: (typeof templates)[number]) => {
    const now = Date.now();
    const site = {
      id: createSiteId(),
      name: template.name,
      tagline: template.tagline,
      palette: template.palette,
      sections: template.sections,
      createdAt: now,
      updatedAt: now,
      published: false,
    };
    saveSite(site);
    navigate(`/editor/${site.id}`);
  };

  return (
    <div className="min-h-screen mesh-bg text-foreground overflow-x-hidden">
      <Navbar />
      <div className="container py-10">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold">Готовые <span className="text-gradient">шаблоны</span></h1>
          <p className="mt-3 text-muted-foreground">Выберите заготовку под вашу нишу — доработайте её в редакторе за пару минут.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div key={t.name} className="glass flex flex-col rounded-3xl p-7 transition-transform hover:-translate-y-1.5">
              <span className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${t.color}`}>
                <Icon name={t.icon} size={24} className="text-white" />
              </span>
              <h3 className="font-display text-xl font-semibold">{t.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.tagline}</p>
              <p className="mt-3 text-xs text-muted-foreground">{t.sections.length} секций</p>
              <button
                onClick={() => useTemplate(t)}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-cyan-400 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                Использовать шаблон
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
