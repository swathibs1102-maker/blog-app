function TagFilter({ tags, activeTag, onTagSelect }) {
  return (
    <div className="tag-filter">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className={
            tag.toLowerCase() === activeTag.toLowerCase()
              ? 'tag-btn active'
              : 'tag-btn'
          }
          onClick={() => onTagSelect(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

export default TagFilter
