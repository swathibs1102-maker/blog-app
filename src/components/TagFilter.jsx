function TagFilter({ tags }) {
  return (
    <div className="tag-filter">
      {tags.map((tag, index) => (
        <button
          key={tag}
          type="button"
          className={index === 0 ? 'tag-btn active' : 'tag-btn'}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

export default TagFilter
