import { NavLink, Link } from 'react-router-dom'

function Sidebar({ popularTags, topAuthors }) {
  return (
    <aside className="sidebar">
      <section className="side-card">
        <h2>Popular tags</h2>
        <div className="chips">
          {popularTags.map((tag) => (
            <NavLink
              key={tag}
              to={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
              className={({ isActive }) => isActive ? 'chip active' : 'chip'}
            >
              #{tag}
            </NavLink>
          ))}
        </div>
      </section>

      <section className="side-card">
        <h2>Top authors</h2>
        <ul className="authors">
          {topAuthors.map((a) => (
            <li key={a.id} className="author">
              <img className="avatar avatar-lg" src={a.image} alt="" />
              <div>
                <Link className="author-name author-link" to={`/author/${a.id}`}>{a.name}</Link>
                <p className="post-date">{a.posts} {a.posts === 1 ? 'post' : 'posts'}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}

export default Sidebar
