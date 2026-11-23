import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PostGrid from './PostGrid'

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json()
}

function AuthorPage({ likeOverrides, onToggleLike }) {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setUser(null)
    setPosts([])
    setLoading(true)
    setError('')
    Promise.all([
      fetchJson(`https://dummyjson.com/users/${id}`),
      fetchJson(`https://dummyjson.com/posts/user/${id}`),
    ])
      .then(([userData, postData]) => {
        if (!active) return
        setUser(userData)
        setPosts((postData.posts || []).map((post) => ({
          ...post,
          body: post.body || '',
          summary: post.body || '',
          author: `${userData.firstName} ${userData.lastName}`,
          authorPhoto: userData.image,
          initials: `${userData.firstName?.[0] || ''}${userData.lastName?.[0] || ''}`,
          date: 'DummyJSON post',
          likes: post.reactions?.likes || 0,
          liked: false,
        })))
      })
      .catch((err) => { if (active) setError(`Unable to load author: ${err.message}`) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  const visiblePosts = posts.map((post) => ({
    ...post,
    ...(likeOverrides[post.id] || {}),
  }))

  return (
    <section className="author-page">
      {loading && <p className="status-message">Loading author…</p>}
      {error && <p className="status-message error-message">{error}</p>}
      {user && (
        <>
          <div className="author-profile">
            <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="author-photo" />
            <div>
              <p className="author-label">AUTHOR PROFILE</p>
              <h1 className="detail-title">{user.firstName} {user.lastName}</h1>
              <p className="post-summary">@{user.username} · {posts.length} posts</p>
              <p className="post-summary">{user.company?.title || 'Blog contributor'}</p>
              <Link to="/" className="read-more">← Back to blog</Link>
            </div>
          </div>
          <h2 className="author-posts-title">Posts by {user.firstName}</h2>
          <PostGrid posts={visiblePosts} emptyText="This author has no posts." onToggleLike={onToggleLike} />
        </>
      )}
    </section>
  )
}

export default AuthorPage
