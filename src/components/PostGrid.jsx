import PostCard from './PostCard'

function PostGrid({ posts, emptyText }) {
  if (posts.length === 0) return <p className="empty">{emptyText}</p>

  return (
    <div className="post-grid">
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  )
}

export default PostGrid
