import { Link } from 'react-router-dom'
import { usePosts } from '../context/PostsContext'

function PostCard({ post }) {
  const { toggleLike } = usePosts()
  const preview = post.body.length > 100 ? `${post.body.slice(0, 100)}…` : post.body

  return (
    <article className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-white">
      <div className="flex h-40 items-center justify-center text-[64px]">📝</div>
      <div className="flex flex-1 flex-col px-6 pt-[22px] pb-6">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => <span className="mb-2 self-start rounded-full bg-accent-soft px-3.5 py-[2px] text-[13px] font-semibold text-accent" key={tag}>{tag}</span>)}
        </div>
        <h3 className="mb-1.5 font-serif text-2xl leading-[1.3]">{post.title}</h3>
        <p className="mb-4 text-base text-muted">{preview}</p>
        <div className="mt-auto mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {post.authorPhoto ? <img className="h-11 w-11 shrink-0 rounded-full object-cover" src={post.authorPhoto} alt="" /> : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">{post.initials}</span>}
            <div>
              <p className="text-base leading-[1.3] font-semibold">{post.author}</p>
              <p className="text-sm leading-[1.3] text-muted">{post.date || 'DummyJSON post'}</p>
            </div>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-full px-2.5 py-1.5 text-[17px] text-muted hover:bg-chip"
            onClick={() => toggleLike(post.id, post.likes, post.liked)}
            aria-label={post.liked ? 'Unlike' : 'Like'}
          >
            {post.liked ? '❤️' : '🤍'} {post.likes}
          </button>
        </div>
        <Link className="self-start p-0 text-base font-semibold text-accent hover:underline" to={`/post/${post.id}`}>Read more →</Link>
      </div>
    </article>
  )
}

export default PostCard
