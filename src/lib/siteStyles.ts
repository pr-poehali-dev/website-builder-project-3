export type HeroLayout = 'split-right' | 'split-left' | 'center' | 'overlay';

export type SiteStyle = {
  key: string;
  label: string;
  hint: string;
  accent: string;
  heroLayout: HeroLayout;
  swatch: string;
};

export const siteStyles: SiteStyle[] = [
  {
    key: 'bold',
    label: 'Яркий и смелый',
    hint: 'Контрастные градиенты, энергичный акцент',
    accent: 'from-fuchsia-500 to-cyan-400',
    heroLayout: 'split-right',
    swatch: 'bg-gradient-to-br from-fuchsia-500 to-cyan-400',
  },
  {
    key: 'minimal',
    label: 'Минимализм',
    hint: 'Сдержанные тона, много воздуха',
    accent: 'from-slate-300 to-slate-500',
    heroLayout: 'center',
    swatch: 'bg-gradient-to-br from-slate-300 to-slate-500',
  },
  {
    key: 'premium',
    label: 'Премиум тёмный',
    hint: 'Чёрный фон, золотые акценты',
    accent: 'from-amber-300 to-yellow-500',
    heroLayout: 'split-left',
    swatch: 'bg-gradient-to-br from-amber-300 to-yellow-500',
  },
  {
    key: 'cozy',
    label: 'Тёплый уют',
    hint: 'Оранжевые и терракотовые оттенки',
    accent: 'from-orange-400 to-amber-500',
    heroLayout: 'split-right',
    swatch: 'bg-gradient-to-br from-orange-400 to-amber-500',
  },
  {
    key: 'corporate',
    label: 'Корпоративный',
    hint: 'Синий и индиго, строгая структура',
    accent: 'from-blue-500 to-indigo-600',
    heroLayout: 'center',
    swatch: 'bg-gradient-to-br from-blue-500 to-indigo-600',
  },
  {
    key: 'neon',
    label: 'Неон',
    hint: 'Яркое свечение, ночная эстетика',
    accent: 'from-purple-500 to-pink-500',
    heroLayout: 'overlay',
    swatch: 'bg-gradient-to-br from-purple-500 to-pink-500',
  },
  {
    key: 'pastel',
    label: 'Пастель',
    hint: 'Нежные розово-сиреневые тона',
    accent: 'from-pink-300 to-violet-400',
    heroLayout: 'split-left',
    swatch: 'bg-gradient-to-br from-pink-300 to-violet-400',
  },
  {
    key: 'eco',
    label: 'Эко',
    hint: 'Зелёный и мятный, натуральность',
    accent: 'from-emerald-400 to-teal-500',
    heroLayout: 'overlay',
    swatch: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
];

export const getSiteStyle = (key?: string): SiteStyle =>
  siteStyles.find((s) => s.key === key) || siteStyles[0];

export type SiteType = {
  key: string;
  label: string;
  icon: string;
};

export const siteTypes: SiteType[] = [
  { key: 'business', label: 'Бизнес и услуги', icon: 'Briefcase' },
  { key: 'shop', label: 'Интернет-магазин', icon: 'ShoppingBag' },
  { key: 'portfolio', label: 'Портфолио', icon: 'Image' },
  { key: 'blog', label: 'Блог и медиа', icon: 'Newspaper' },
  { key: 'startup', label: 'Стартап', icon: 'Rocket' },
  { key: 'food', label: 'Кафе и рестораны', icon: 'Coffee' },
  { key: 'nonprofit', label: 'Некоммерческий проект', icon: 'Heart' },
];
