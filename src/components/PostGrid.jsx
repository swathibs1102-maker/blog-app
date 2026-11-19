import PostCard from './PostCard'

function PostGrid({ posts, emptyText, onToggleLike, onReadMore }) {
  if (posts.length === 0) {
    return <p className="empty">{emptyText}</p>
  }

  return (
    <div className="post-grid">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          emoji={post.emoji}
          bg={post.bg}
          tag={post.tag}
          title={post.title}
          summary={post.summary}
          author={post.author}
          initials={post.initials}
          avatarColor={post.avatarColor}
          date={post.date}
          likes={post.likes}
          liked={post.liked}
          onToggleLike={onToggleLike}
          onReadMore={onReadMore}
        />
      ))}
    </div>
  )
}

export default PostGrid
