import { NavLink } from 'react-router-dom'

function TagFilter({ tags, activeTag }) {
  return (
    <div className="flex flex-wrap gap-3">
      {tags.map((tag) => {
        const to = tag === 'All' ? '/' : `/tag/${encodeURIComponent(tag.toLowerCase())}`
        return (
          <NavLink
            key={tag}
            to={to}
            end={tag === 'All'}
            className={({ isActive }) => {
              const active = tag === 'All' ? isActive && !activeTag : isActive
              return `rounded-full border px-6 py-3 text-base ${active ? 'border-ink bg-ink text-white' : 'border-[#d6d6d6] bg-white text-ink'}`
            }}
          >
            {tag === 'All' ? tag : tag.charAt(0).toUpperCase() + tag.slice(1)}
          </NavLink>
        )
      })}
    </div>
  )
}

export default TagFilter
