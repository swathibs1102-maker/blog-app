import { NavLink, Link } from 'react-router-dom'

function Header({ blogName = 'DevDiary', links = ['Home', 'Write', 'About'] }) {
  const paths = { Home: '/', Write: '/write', About: '/about' }

  return (
    <header className="flex items-center justify-between border-b border-line px-16 py-[18px] max-[1100px]:px-8 max-[700px]:px-5 max-[700px]:py-4">
      <Link to="/" className="p-0 font-serif text-[28px] font-bold" aria-label={`${blogName} home`}>
        Dev<span className="text-accent">Diary</span>
      </Link>
      <nav className="flex gap-9 max-[700px]:gap-5">
        {links.map((link) => (
          <NavLink
            key={link}
            to={paths[link] || '/'}
            end={link === 'Home'}
            className={({ isActive }) => `p-0 text-[17px] ${isActive ? 'font-semibold text-accent' : 'text-muted hover:text-ink'}`}
          >
            {link}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Header
