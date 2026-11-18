import PostCard from './PostCard'

function PostGrid({ posts }) {
  return (
    <div className="post-grid">
      {posts.map((post) => (
        <PostCard
          key={post.id}
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
        />
      ))}
    </div>
  )
}

export default PostGrid
