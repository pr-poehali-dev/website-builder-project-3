import { Link, NavLink } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const navItems = [
  { label: 'Главная', to: '/' },
  { label: 'Редактор', to: '/editor' },
  { label: 'Шаблоны', to: '/templates' },
  { label: 'Проекты', to: '/projects' },
  { label: 'Публикация', to: '/publication' },
  { label: 'Аналитика', to: '/analytics' },
  { label: 'Профиль', to: '/profile' },
  { label: 'Поддержка', to: '/support' },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 glow">
            <Icon name="Boxes" size={20} className="text-white" />
          </span>
          Konstr<span className="text-gradient">AI</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/"
          className="rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 glow"
        >
          Создать сайт
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
