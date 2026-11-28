import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePosts } from '../context/PostsContext'
import useFetch from '../hooks/useFetch'

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { posts, getAuthor, toggleLike, likeOverrides, loading: postsLoading } = usePosts()
  const contextPost = posts.find((item) => String(item.id) === id)
  const postRequest = useFetch(contextPost ? '' : `https://dummyjson.com/posts/${id}`)
  const post = contextPost || postRequest.data
  const authorFromContext = post ? getAuthor(post.userId) : null
  const authorRequest = useFetch(post && !authorFromContext ? `https://dummyjson.com/users/${post.userId}` : '')
  const author = authorFromContext || authorRequest.data
  const commentsRequest = useFetch(`https://dummyjson.com/posts/${id}/comments`)
  const comments = commentsRequest.data?.comments || []

  const likeOverride = post ? likeOverrides[post.id] : null
  const normalizedPost = post ? {
    ...post,
    ...(likeOverride || {}),
    author: post.author || (author ? `${author.firstName} ${author.lastName}` : 'Unknown author'),
    authorPhoto: post.authorPhoto || author?.image || '',
    likes: post.likes ?? post.reactions?.likes ?? 0,
    liked: Boolean(post.liked),
    body: post.body || '',
    tags: post.tags || [],
  } : null

  const loading = contextPost ? false : (postRequest.loading || postsLoading)
  const error = postRequest.error

  return (
    <article className="mx-auto max-w-[760px]">
      <button type="button" className="mb-6 cursor-pointer p-0 text-base font-semibold text-accent hover:underline" onClick={() => navigate(-1)}>← Back</button>
      {loading && <p className="my-7 text-[17px] text-muted">Loading post…</p>}
      {error && <p className="my-7 text-[17px] text-red-700">Unable to load this post: {error}</p>}
      {!loading && !error && !normalizedPost && <p className="my-7 text-[17px] text-muted">Post not found.</p>}

      {normalizedPost && (
        <>
          <div className="mb-6 flex h-60 items-center justify-center rounded-[20px] text-[96px]">📝</div>
          <div className="flex flex-wrap gap-1.5">
            {normalizedPost.tags.map((tag) => <span className="mb-2 self-start rounded-full bg-accent-soft px-3.5 py-[2px] text-[13px] font-semibold text-accent" key={tag}>{tag}</span>)}
          </div>
          <h1 className="mt-3 mb-[18px] font-serif text-[38px] leading-[1.25] max-[700px]:text-[28px]">{normalizedPost.title}</h1>
          <div className="mt-0 mb-[14px] flex items-center justify-between border-b border-line pb-5">
            <div className="flex items-center gap-3">
              {normalizedPost.authorPhoto
                ? <img className="h-11 w-11 shrink-0 rounded-full object-cover" src={normalizedPost.authorPhoto} alt="" />
                : <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">{normalizedPost.author.slice(0, 2)}</span>}
              <div>
                {author
                  ? <Link className="text-base leading-[1.3] font-semibold text-inherit no-underline hover:text-accent" to={`/author/${author.id}`}>{normalizedPost.author}</Link>
                  : <p className="text-base leading-[1.3] font-semibold">{normalizedPost.author}</p>}
                <p className="text-sm leading-[1.3] text-muted">DummyJSON post</p>
              </div>
            </div>
            <button
              type="button"
              className="cursor-pointer rounded-full px-2.5 py-1.5 text-[17px] text-muted hover:bg-chip"
              onClick={() => toggleLike(normalizedPost.id, normalizedPost.likes, normalizedPost.liked)}
              aria-label={normalizedPost.liked ? 'Unlike' : 'Like'}
            >
              {normalizedPost.liked ? '❤️' : '🤍'} {normalizedPost.likes}
            </button>
          </div>
          <p className="mt-6 whitespace-pre-line text-lg leading-[1.8]">{normalizedPost.body}</p>
          <section className="mt-9">
            <h2 className="mb-[18px] font-serif text-[26px]">Comments</h2>
            {commentsRequest.error && <p className="my-7 text-[17px] text-red-700">Unable to load comments: {commentsRequest.error}</p>}
            {commentsRequest.loading && <p className="my-7 text-[17px] text-muted">Loading comments…</p>}
            {!commentsRequest.loading && !commentsRequest.error && comments.length === 0 && <p className="mb-4 text-base text-muted">No comments yet.</p>}
            {comments.map((comment) => (
              <article className="border-t border-line py-[18px]" key={comment.id}>
                <p className="text-base leading-[1.3] font-semibold">{comment.user?.fullName || comment.user?.username || 'Reader'}</p>
                <p className="mt-1.5 text-muted">{comment.body}</p>
              </article>
            ))}
          </section>
        </>
      )}
    </article>
  )
}

export default PostDetail
