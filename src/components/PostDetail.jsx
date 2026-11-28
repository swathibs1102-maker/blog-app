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
    <article className="detail">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      {loading && <p className="status-message">Loading post…</p>}
      {error && <p className="status-message error-message">Unable to load this post: {error}</p>}
      {!loading && !error && !normalizedPost && <p className="status-message">Post not found.</p>}

      {normalizedPost && (
        <>
          <div className="detail-image">📝</div>
          <div className="post-tags">
            {normalizedPost.tags.map((tag) => <span className="post-tag" key={tag}>{tag}</span>)}
          </div>
          <h1 className="detail-title">{normalizedPost.title}</h1>
          <div className="post-meta detail-meta">
            <div className="author">
              {normalizedPost.authorPhoto
                ? <img className="avatar" src={normalizedPost.authorPhoto} alt="" />
                : <span className="avatar">{normalizedPost.author.slice(0, 2)}</span>}
              <div>
                {author
                  ? <Link className="author-name author-link" to={`/author/${author.id}`}>{normalizedPost.author}</Link>
                  : <p className="author-name">{normalizedPost.author}</p>}
                <p className="post-date">DummyJSON post</p>
              </div>
            </div>
            <button
              type="button"
              className="like-btn"
              onClick={() => toggleLike(normalizedPost.id, normalizedPost.likes, normalizedPost.liked)}
              aria-label={normalizedPost.liked ? 'Unlike' : 'Like'}
            >
              {normalizedPost.liked ? '❤️' : '🤍'} {normalizedPost.likes}
            </button>
          </div>
          <p className="detail-content">{normalizedPost.body}</p>
          <section className="comments">
            <h2>Comments</h2>
            {commentsRequest.error && <p className="status-message error-message">Unable to load comments: {commentsRequest.error}</p>}
            {commentsRequest.loading && <p className="status-message">Loading comments…</p>}
            {!commentsRequest.loading && !commentsRequest.error && comments.length === 0 && <p className="post-summary">No comments yet.</p>}
            {comments.map((comment) => (
              <article className="comment" key={comment.id}>
                <p className="author-name">{comment.user?.fullName || comment.user?.username || 'Reader'}</p>
                <p>{comment.body}</p>
              </article>
            ))}
          </section>
        </>
      )}
    </article>
  )
}

export default PostDetail
