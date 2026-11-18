function Sidebar({ popularTags, topAuthors }) {
  return (
    <aside className="sidebar">
      <section className="side-card">
        <h2>Popular tags</h2>
        <div className="chips">
          {popularTags.map((tag) => (
            <span key={tag} className="chip">
              #{tag}
            </span>
          ))}
        </div>
      </section>

      <section className="side-card">
        <h2>Top authors</h2>
        <ul className="authors">
          {topAuthors.map((a) => (
            <li key={a.name} className="author">
              <span
                className="avatar avatar-lg"
                style={{ backgroundColor: a.avatarColor }}
              >
                {a.initials}
              </span>
              <div>
                <p className="author-name">{a.name}</p>
                <p className="post-date">{a.posts} posts</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}

export default Sidebar
