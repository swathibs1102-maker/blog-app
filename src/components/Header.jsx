function Header({ blogName, links }) {
  return (
    <header className="header">
      <a href="#" className="logo">
        Dev<span>Diary</span>
      </a>
      <nav className="nav">
        {links.map((link, index) => (
          <a
            key={link}
            href="#"
            className={index === 0 ? 'nav-link active' : 'nav-link'}
          >
            {link}
          </a>
        ))}
      </nav>
    </header>
  )
}

export default Header
