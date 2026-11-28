import { Link, useParams } from 'react-router-dom'
import PostGrid from './PostGrid'
import { usePosts } from '../context/PostsContext'
import useFetch from '../hooks/useFetch'

function AuthorPage() {
  const { id } = useParams()
  const { posts: sharedPosts, likeOverrides } = usePosts()
  const { data: user, loading: userLoading, error: userError } = useFetch(`https://dummyjson.com/users/${id}`)
  const { data: postData, loading: postsLoading, error: postsError } = useFetch(`https://dummyjson.com/posts/user/${id}`)

  const posts = (postData?.posts || []).map((post) => {
    const sharedPost = sharedPosts.find((item) => String(item.id) === String(post.id))
    const authorName = user ? `${user.firstName} ${user.lastName}` : 'Unknown author'
    return {
      ...post,
      body: post.body || '',
      summary: post.body || '',
      tags: post.tags || [],
      author: authorName,
      authorPhoto: user?.image || '',
      initials: `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`,
      date: 'DummyJSON post',
      likes: likeOverrides[post.id]?.likes ?? sharedPost?.likes ?? post.reactions?.likes ?? 0,
      liked: likeOverrides[post.id]?.liked ?? sharedPost?.liked ?? false,
    }
  })

  const loading = userLoading || postsLoading
  const error = userError || postsError

  return (
    <section className="author-page">
      {loading && <p className="status-message">Loading author…</p>}
      {error && <p className="status-message error-message">Unable to load author: {error}</p>}
      {user && !error && (
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
          <PostGrid posts={posts} emptyText="This author has no posts." />
        </>
      )}
    </section>
  )
}

export default AuthorPage
