import { NavLink, Link } from 'react-router-dom'

function Header({ blogName = 'DevDiary', links = ['Home', 'Write', 'About'] }) {
  const paths = { Home: '/', Write: '/write', About: '/about' }

  return (
    <header className="header">
      <Link to="/" className="logo" aria-label={`${blogName} home`}>
        Dev<span>Diary</span>
      </Link>
      <nav className="nav">
        {links.map((link) => (
          <NavLink
            key={link}
            to={paths[link] || '/'}
            end={link === 'Home'}
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            {link}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Header
