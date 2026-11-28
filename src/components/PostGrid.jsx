import PostCard from './PostCard'

function PostGrid({ posts, emptyText }) {
  if (posts.length === 0) return <p className="col-span-full rounded-[20px] border border-dashed border-[#d6d6d6] px-5 py-[60px] text-center text-lg text-muted">{emptyText}</p>

  return (
    <div className="grid grid-cols-2 gap-[30px] max-[700px]:grid-cols-1">
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  )
}

export default PostGrid
