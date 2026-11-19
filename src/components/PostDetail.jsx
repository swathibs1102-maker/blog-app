function PostDetail({ post, onBack, onToggleLike }) {
  return (
    <article className="detail">
      <button type="button" className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="detail-image" style={{ backgroundColor: post.bg }}>
        {post.emoji}
      </div>

      <span className="post-tag">{post.tag}</span>
      <h1 className="detail-title">{post.title}</h1>

      <div className="post-meta detail-meta">
        <div className="author">
          <span className="avatar" style={{ backgroundColor: post.avatarColor }}>
            {post.initials}
          </span>
          <div>
            <p className="author-name">{post.author}</p>
            <p className="post-date">{post.date}</p>
          </div>
        </div>
        <button
          type="button"
          className="like-btn"
          onClick={() => onToggleLike(post.id)}
          aria-label={post.liked ? 'Unlike' : 'Like'}
        >
          {post.liked ? '❤️' : '🤍'} {post.likes}
        </button>
      </div>

      <p className="detail-content">{post.content}</p>
    </article>
  )
}

export default PostDetail
