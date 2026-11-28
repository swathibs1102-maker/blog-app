import { NavLink, Link } from 'react-router-dom'

function Sidebar({ popularTags, topAuthors }) {
  return (
    <aside className="flex flex-col gap-7">
      <section className="rounded-[20px] border border-line p-7">
        <h2 className="mb-[18px] font-serif text-2xl">Popular tags</h2>
        <div className="flex flex-wrap gap-3">
          {popularTags.map((tag) => (
            <NavLink
              key={tag}
              to={`/tag/${encodeURIComponent(tag.toLowerCase())}`}
              className={({ isActive }) => `rounded-full px-4 py-2 text-[15px] ${isActive ? 'bg-ink text-white' : 'bg-chip hover:bg-[#e8e8e8]'}`}
            >
              #{tag}
            </NavLink>
          ))}
        </div>
      </section>

      <section className="rounded-[20px] border border-line p-7">
        <h2 className="mb-[18px] font-serif text-2xl">Top authors</h2>
        <ul className="flex list-none flex-col gap-[22px]">
          {topAuthors.map((a) => (
            <li key={a.id} className="flex items-center gap-3">
              <img className="h-11 w-11 shrink-0 rounded-full object-cover" src={a.image} alt="" />
              <div>
                <Link className="text-base leading-[1.3] font-semibold text-inherit no-underline hover:text-accent" to={`/author/${a.id}`}>{a.name}</Link>
                <p className="text-sm leading-[1.3] text-muted">{a.posts} {a.posts === 1 ? 'post' : 'posts'}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}

export default Sidebar
