import Icon from '@/components/ui/icon';
import { Site, SiteSection } from '@/lib/sites';
import { getSiteStyle, HeroLayout } from '@/lib/siteStyles';

const paletteAccent: Record<string, string> = {
  'тёплая': 'from-amber-400 to-orange-500',
  'холодная': 'from-cyan-400 to-blue-500',
  'нейтральная': 'from-slate-400 to-slate-500',
  'яркая': 'from-fuchsia-500 to-cyan-400',
};

const getAccent = (palette: string) => paletteAccent[palette] || 'from-fuchsia-500 to-cyan-400';

type BlockType =
  | 'header'
  | 'hero'
  | 'about'
  | 'services'
  | 'gallery'
  | 'testimonials'
  | 'pricing'
  | 'team'
  | 'faq'
  | 'contact'
  | 'footer'
  | 'generic';

const classify = (tag: string): BlockType => {
  const t = tag.toLowerCase();
  if (t.includes('футер') || t.includes('подвал')) return 'footer';
  if (t.includes('шапк') || t.includes('навигац')) return 'header';
  if (t.includes('баннер') || t.includes('главн') || t.includes('обложк')) return 'hero';
  if (t.includes('о нас') || t.includes('о компан') || t.includes('о себе') || t.includes('о проект')) return 'about';
  if (t.includes('отзыв')) return 'testimonials';
  if (t.includes('цен') || t.includes('тариф') || t.includes('прайс')) return 'pricing';
  if (t.includes('команд') || t.includes('сотрудник') || t.includes('мастер')) return 'team';
  if (t.includes('вопрос') || t.includes('faq')) return 'faq';
  if (t.includes('форма') || t.includes('заявк') || t.includes('контакт') || t.includes('карта')) return 'contact';
  if (t.includes('галере') || t.includes('портфолио') || t.includes('работ') || t.includes('фото')) return 'gallery';
  if (t.includes('услуг') || t.includes('катал') || t.includes('продукт') || t.includes('меню')) return 'services';
  return 'generic';
};

const shortLabel = (tag: string) => {
  const words = tag.split(' ');
  return words.length > 2 ? words.slice(0, 2).join(' ') : tag;
};

const splitParts = (text: string, count: number): string[] => {
  const parts = text.split(/[,.;]\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= count) return parts.slice(0, count);
  const result = [...parts];
  while (result.length < count) result.push(text);
  return result;
};

const ImgPlaceholder = ({ accent, className = '' }: { accent: string; className?: string }) => (
  <div className={`grid place-items-center rounded-2xl bg-gradient-to-br ${accent} opacity-30 ${className}`}>
    <Icon name="Image" size={28} className="text-white/70" />
  </div>
);

const Header = ({ site, sections, accent }: { site: Site; sections: SiteSection[]; accent: string }) => {
  const navLinks = sections
    .filter((s) => classify(s.tag) !== 'header' && classify(s.tag) !== 'footer' && classify(s.tag) !== 'hero')
    .slice(0, 5);
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-background/80 px-8 py-4 backdrop-blur">
      <div className="flex items-center gap-2 font-display text-lg font-bold text-white">
        <span className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${accent}`}>
          <Icon name="Sparkles" size={16} className="text-white" />
        </span>
        {site.name || 'Название сайта'}
      </div>
      <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
        {navLinks.length > 0 ? (
          navLinks.map((s, i) => <span key={i}>{shortLabel(s.tag)}</span>)
        ) : (
          <>
            <span>Главная</span>
            <span>О нас</span>
            <span>Контакты</span>
          </>
        )}
      </div>
      <button className={`rounded-full bg-gradient-to-r ${accent} px-4 py-2 text-xs font-semibold text-white`}>
        Связаться
      </button>
    </div>
  );
};

const Hero = ({
  heading,
  subheading,
  accent,
  layout,
}: {
  heading: string;
  subheading: string;
  accent: string;
  layout: HeroLayout;
}) => {
  const cta = (
    <div className="mt-7 flex justify-center gap-3 md:justify-start">
      <button className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${accent} px-6 py-3 text-sm font-semibold text-white`}>
        Начать <Icon name="ArrowRight" size={15} />
      </button>
      <button className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80">
        Узнать больше
      </button>
    </div>
  );

  if (layout === 'center') {
    return (
      <div className="px-8 py-20 text-center">
        <h2 className="mx-auto font-display text-4xl font-black leading-tight text-white md:text-5xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-md text-white/70">{subheading}</p>
        <div className="mt-7 flex justify-center gap-3">
          <button className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${accent} px-6 py-3 text-sm font-semibold text-white`}>
            Начать <Icon name="ArrowRight" size={15} />
          </button>
          <button className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80">
            Узнать больше
          </button>
        </div>
        <ImgPlaceholder accent={accent} className="mx-auto mt-10 h-56 w-full max-w-2xl" />
      </div>
    );
  }

  if (layout === 'overlay') {
    return (
      <div className="relative overflow-hidden px-8 py-24 text-center">
        <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${accent} opacity-20`} />
        <div className="absolute -top-16 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <h2 className="mx-auto font-display text-4xl font-black leading-tight text-white md:text-6xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-md text-white/70">{subheading}</p>
        <div className="mt-7 flex justify-center gap-3">
          <button className={`flex items-center gap-2 rounded-full bg-gradient-to-r ${accent} px-6 py-3 text-sm font-semibold text-white`}>
            Начать <Icon name="ArrowRight" size={15} />
          </button>
          <button className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white/80">
            Узнать больше
          </button>
        </div>
      </div>
    );
  }

  if (layout === 'split-left') {
    return (
      <div className="grid gap-8 px-8 py-20 md:grid-cols-2 md:items-center">
        <ImgPlaceholder accent={accent} className="order-2 h-56 w-full md:order-1 md:h-72" />
        <div className="order-1 text-center md:order-2 md:text-left">
          <h2 className="font-display text-4xl font-black leading-tight text-white md:text-5xl">{heading}</h2>
          <p className="mx-auto mt-4 max-w-md text-white/70 md:mx-0">{subheading}</p>
          {cta}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 px-8 py-20 md:grid-cols-2 md:items-center">
      <div className="text-center md:text-left">
        <h2 className="font-display text-4xl font-black leading-tight text-white md:text-5xl">{heading}</h2>
        <p className="mx-auto mt-4 max-w-md text-white/70 md:mx-0">{subheading}</p>
        {cta}
      </div>
      <ImgPlaceholder accent={accent} className="h-56 w-full md:h-72" />
    </div>
  );
};

const About = ({ s, accent }: { s: SiteSection; accent: string }) => (
  <div className="grid gap-8 px-8 py-16 md:grid-cols-2 md:items-center">
    <ImgPlaceholder accent={accent} className="h-48 w-full order-2 md:order-1" />
    <div className="order-1 md:order-2">
      <h3 className="font-display text-2xl font-bold text-white">{s.tag || 'О нас'}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/70">{s.description || 'Расскажите здесь о своей компании или проекте.'}</p>
    </div>
  </div>
);

const Services = ({ s, accent }: { s: SiteSection; accent: string }) => {
  const items = splitParts(s.description || 'Описание услуги', 3);
  const icons = ['Zap', 'Star', 'CheckCircle2'];
  return (
    <div className="px-8 py-16">
      <h3 className="mb-8 text-center font-display text-2xl font-bold text-white">{s.tag || 'Наши услуги'}</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((text, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${accent} mb-3`}>
              <Icon name={icons[i % icons.length]} size={18} className="text-white" />
            </span>
            <h4 className="font-semibold text-white">Услуга {i + 1}</h4>
            <p className="mt-1.5 text-sm text-white/60">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Gallery = ({ s, accent }: { s: SiteSection; accent: string }) => (
  <div className="px-8 py-16">
    <h3 className="mb-6 text-center font-display text-2xl font-bold text-white">{s.tag || 'Галерея'}</h3>
    <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ImgPlaceholder key={i} accent={accent} className="aspect-square" />
      ))}
    </div>
  </div>
);

const Testimonials = ({ s, accent }: { s: SiteSection; accent: string }) => {
  const quotes = splitParts(s.description || 'Отличный сервис, всё понравилось!', 2);
  return (
    <div className="px-8 py-16">
      <h3 className="mb-8 text-center font-display text-2xl font-bold text-white">{s.tag || 'Отзывы клиентов'}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {quotes.map((quote, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, j) => (
                <Icon key={j} name="Star" size={13} className="fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm italic text-white/70">«{quote}»</p>
            <div className="mt-4 flex items-center gap-2">
              <span className={`grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br ${accent}`}>
                <Icon name="User" size={14} className="text-white" />
              </span>
              <span className="text-sm font-medium text-white">Довольный клиент</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Pricing = ({ s, accent }: { s: SiteSection; accent: string }) => {
  const plans = [
    { name: 'Базовый', price: '990 ₽' },
    { name: 'Стандарт', price: '2 490 ₽' },
    { name: 'Премиум', price: '4 990 ₽' },
  ];
  return (
    <div className="px-8 py-16">
      <h3 className="mb-8 text-center font-display text-2xl font-bold text-white">{s.tag || 'Тарифы'}</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p, i) => (
          <div
            key={p.name}
            className={`rounded-2xl border p-5 ${i === 1 ? 'border-white/30 bg-white/[0.06]' : 'border-white/10 bg-white/[0.03]'}`}
          >
            <h4 className="font-semibold text-white">{p.name}</h4>
            <p className={`mt-2 bg-gradient-to-r ${accent} bg-clip-text text-2xl font-black text-transparent`}>{p.price}</p>
            <p className="mt-2 text-xs text-white/60">{s.description || 'Описание тарифа'}</p>
            <ul className="mt-4 space-y-1.5 text-xs text-white/70">
              {['Опция включена', 'Поддержка 24/7', 'Без ограничений'].map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <Icon name="CheckCircle2" size={13} className="text-emerald-400" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const Team = ({ s, accent }: { s: SiteSection; accent: string }) => {
  const roles = splitParts(s.description || 'Специалист команды', 3);
  return (
    <div className="px-8 py-16">
      <h3 className="mb-8 text-center font-display text-2xl font-bold text-white">{s.tag || 'Наша команда'}</h3>
      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center">
            <span className={`mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${accent}`}>
              <Icon name="User" size={24} className="text-white" />
            </span>
            <h4 className="mt-3 font-semibold text-white">Имя Фамилия</h4>
            <p className="mt-1 text-xs text-white/60">{role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Faq = ({ s, accent }: { s: SiteSection; accent: string }) => {
  const questions = splitParts(s.description || 'Часто задаваемый вопрос', 3);
  return (
    <div className="px-8 py-16">
      <h3 className="mb-6 text-center font-display text-2xl font-bold text-white">{s.tag || 'Вопросы и ответы'}</h3>
      <div className="mx-auto max-w-xl space-y-2">
        {questions.map((q, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br ${accent}`}>
              <Icon name="HelpCircle" size={13} className="text-white" />
            </span>
            <p className="text-sm text-white/75">{q}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Contact = ({ s, accent }: { s: SiteSection; accent: string }) => (
  <div className="grid gap-8 px-8 py-16 md:grid-cols-2">
    <div>
      <h3 className="font-display text-2xl font-bold text-white">{s.tag || 'Свяжитесь с нами'}</h3>
      <p className="mt-2 text-sm text-white/60">{s.description || 'Оставьте заявку — мы свяжемся с вами в ближайшее время.'}</p>
      <div className="mt-6 space-y-3 text-sm text-white/70">
        <div className="flex items-center gap-2"><Icon name="Phone" size={15} /> +7 (000) 000-00-00</div>
        <div className="flex items-center gap-2"><Icon name="Mail" size={15} /> info@example.com</div>
        <div className="flex items-center gap-2"><Icon name="MapPin" size={15} /> г. Москва, ул. Примерная, 1</div>
      </div>
    </div>
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/40">Ваше имя</div>
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/40">Email</div>
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/40">Сообщение</div>
      <button className={`w-full rounded-xl bg-gradient-to-r ${accent} py-2.5 text-sm font-semibold text-white`}>
        Отправить
      </button>
    </div>
  </div>
);

const Generic = ({ s, accent }: { s: SiteSection; accent: string }) => (
  <div className="px-8 py-14 text-center">
    <span className={`mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${accent}`}>
      <Icon name="Sparkles" size={16} className="text-white" />
    </span>
    <h3 className="font-display text-2xl font-bold text-white">{s.tag || 'Название секции'}</h3>
    <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">{s.description || 'Описание секции'}</p>
  </div>
);

const Footer = ({ site, accent }: { site: Site; accent: string }) => (
  <div className="border-t border-white/10 px-8 py-10 text-center">
    <div className="flex items-center justify-center gap-2 font-display font-bold text-white">
      <span className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br ${accent}`}>
        <Icon name="Sparkles" size={14} className="text-white" />
      </span>
      {site.name || 'Название сайта'}
    </div>
    <p className="mt-2 text-xs text-white/50">© {new Date().getFullYear()} {site.name || 'Сайт'}. Все права защищены.</p>
  </div>
);

const LivePreview = ({ site }: { site: Site }) => {
  const style = getSiteStyle(site.styleKey);
  const accent = site.styleKey ? style.accent : getAccent(site.palette);
  const heroSection = site.sections.find((s) => classify(s.tag) === 'hero');

  return (
    <div className="text-left">
      <Header site={site} sections={site.sections} accent={accent} />
      <Hero
        heading={site.name || 'Название сайта'}
        subheading={heroSection?.description || site.tagline || 'Tagline сайта появится здесь'}
        accent={accent}
        layout={style.heroLayout}
      />
      {site.sections.map((s, i) => {
        const type = classify(s.tag);
        if (type === 'header' || type === 'hero' || type === 'footer') return null;
        const key = `${s.tag}-${i}`;
        switch (type) {
          case 'about':
            return <About key={key} s={s} accent={accent} />;
          case 'services':
            return <Services key={key} s={s} accent={accent} />;
          case 'gallery':
            return <Gallery key={key} s={s} accent={accent} />;
          case 'testimonials':
            return <Testimonials key={key} s={s} accent={accent} />;
          case 'pricing':
            return <Pricing key={key} s={s} accent={accent} />;
          case 'team':
            return <Team key={key} s={s} accent={accent} />;
          case 'faq':
            return <Faq key={key} s={s} accent={accent} />;
          case 'contact':
            return <Contact key={key} s={s} accent={accent} />;
          default:
            return <Generic key={key} s={s} accent={accent} />;
        }
      })}
      <Footer site={site} accent={accent} />
    </div>
  );
};

export default LivePreview;