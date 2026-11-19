function PostCard({
  id,
  emoji,
  bg,
  tag,
  title,
  summary,
  author,
  initials,
  avatarColor,
  date,
  likes,
  liked,
  onToggleLike,
  onReadMore,
}) {
  return (
    <article className="post-card">
      <div className="post-image" style={{ backgroundColor: bg }}>
        {emoji}
      </div>
      <div className="post-body">
        <span className="post-tag">{tag}</span>
        <h3>{title}</h3>
        <p className="post-summary">{summary}</p>
        <div className="post-meta">
          <div className="author">
            <span className="avatar" style={{ backgroundColor: avatarColor }}>
              {initials}
            </span>
            <div>
              <p className="author-name">{author}</p>
              <p className="post-date">{date}</p>
            </div>
          </div>
          <button
            type="button"
            className="like-btn"
            onClick={() => onToggleLike(id)}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            {liked ? '❤️' : '🤍'} {likes}
          </button>
        </div>
        <button
          type="button"
          className="read-more"
          onClick={() => onReadMore(id)}
        >
          Read more →
        </button>
      </div>
    </article>
  )
}

export default PostCard
