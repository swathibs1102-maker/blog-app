import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json()
}

function PostDetail({ likeOverrides = {}, onToggleLike }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [author, setAuthor] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [commentsError, setCommentsError] = useState('')

  useEffect(() => {
    let active = true
    setPost(null)
    setAuthor(null)
    setComments([])
    setLoading(true)
    setCommentsLoading(true)
    setError('')
    setCommentsError('')

    fetchJson(`https://dummyjson.com/posts/${id}`)
      .then(async (data) => {
        let user = null
        try {
          user = await fetchJson(`https://dummyjson.com/users/${data.userId}`)
        } catch {
          user = null
        }
        if (!active) return
        setAuthor(user)
        setPost({
          ...data,
          author: user ? `${user.firstName} ${user.lastName}` : 'Unknown author',
          authorPhoto: user?.image || '',
          likes: data.reactions?.likes || 0,
          liked: false,
        })
      })
      .catch((fetchError) => {
        if (active) setError(`Unable to load this post: ${fetchError.message}`)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    fetchJson(`https://dummyjson.com/posts/${id}/comments`)
      .then((data) => {
        if (active) setComments(data.comments || [])
      })
      .catch((fetchError) => {
        if (active) setCommentsError(`Unable to load comments: ${fetchError.message}`)
      })
      .finally(() => {
        if (active) setCommentsLoading(false)
      })

    return () => { active = false }
  }, [id])

  const override = likeOverrides[id]
  const likes = override?.likes ?? post?.likes ?? 0
  const liked = override?.liked ?? post?.liked ?? false

  return (
    <article className="detail">
      <button type="button" className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      {loading && <p className="status-message">Loading post…</p>}
      {error && <p className="status-message error-message">{error}</p>}

      {post && (
        <>
          <div className="detail-image">📝</div>
          <div className="post-tags">
            {post.tags?.map((tag) => <span className="post-tag" key={tag}>{tag}</span>)}
          </div>
          <h1 className="detail-title">{post.title}</h1>
          <div className="post-meta detail-meta">
            <div className="author">
              {post.authorPhoto ? <img className="avatar" src={post.authorPhoto} alt="" /> : <span className="avatar">{post.author.slice(0, 2)}</span>}
              <div>
                {author ? <Link className="author-name author-link" to={`/author/${author.id}`}>{post.author}</Link> : <p className="author-name">{post.author}</p>}
                <p className="post-date">DummyJSON post</p>
              </div>
            </div>
            <button type="button" className="like-btn" onClick={() => onToggleLike(post.id, likes, liked)} aria-label={liked ? 'Unlike' : 'Like'}>
              {liked ? '❤️' : '🤍'} {likes}
            </button>
          </div>
          <p className="detail-content">{post.body}</p>
          <section className="comments">
            <h2>Comments</h2>
            {commentsError && <p className="status-message error-message">{commentsError}</p>}
            {commentsLoading && <p className="status-message">Loading comments…</p>}
            {!commentsLoading && !commentsError && comments.length === 0 && <p className="post-summary">No comments yet.</p>}
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
