import { NavLink } from 'react-router-dom'

function TagFilter({ tags, activeTag }) {
  return (
    <div className="tag-filter">
      {tags.map((tag) => {
        const to = tag === 'All' ? '/' : `/tag/${encodeURIComponent(tag.toLowerCase())}`
        return (
          <NavLink
            key={tag}
            to={to}
            end={tag === 'All'}
            className={({ isActive }) => {
              const active = tag === 'All' ? isActive && !activeTag : isActive
              return active ? 'tag-btn active' : 'tag-btn'
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
