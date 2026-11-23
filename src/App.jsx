import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import Header from './components/Header'
import FeaturedPost from './components/FeaturedPost'
import TagFilter from './components/TagFilter'
import SearchBox from './components/SearchBox'
import PostGrid from './components/PostGrid'
import PostDetail from './components/PostDetail'
import WriteForm from './components/WriteForm'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import AuthorPage from './components/AuthorPage'
import { featured } from './data'

function getAuthorName(user) {
  if (!user) return 'Unknown author'
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Unknown author'
}

function normalizePost(post, authors) {
  const author = authors[post.userId]
  const authorName = getAuthorName(author)
  const initials = authorName.split(' ').map((word) => word[0]).join('').slice(0, 2)
  return {
    ...post,
    title: post.title || '',
    body: post.body || '',
    summary: (post.body || '').slice(0, 100),
    tags: Array.isArray(post.tags) ? post.tags : [],
    author: authorName,
    authorPhoto: author?.image || '',
    initials,
    date: 'DummyJSON post',
    likes: post.reactions?.likes || 0,
    liked: false,
  }
}

async function fetchJson(url, options) {
  const response = await fetch(url, options)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json()
}

function NotFound() {
  return (
    <section className="not-found">
      <p className="author-label">404 · PAGE NOT FOUND</p>
      <h1 className="detail-title">Oops! This page doesn't exist.</h1>
      <p className="post-summary">The link may be broken, or the page may have moved.</p>
      <a href="/" className="read-more">← Back to Home</a>
    </section>
  )
}

function AboutPage() {
  return (
    <section className="about-page">
      <p className="author-label">ABOUT DEVDIARY</p>
      <h1 className="detail-title">Written by trainees, for trainees.</h1>
      <p className="detail-content">DevDiary is a place to share coding learnings, beginner-friendly tips, and stories from the developer journey.</p>
    </section>
  )
}

function HomeFeed({ posts, tagList, popularTags, topAuthors, loading, loadError, likeOverrides, onToggleLike, tagRoute }) {
  const { tag } = useParams()
  const [search, setSearch] = useState('')
  const activeTag = tagRoute ? decodeURIComponent(tag || '').toLowerCase() : 'all'
  const tagsForFilter = useMemo(() => {
    const base = ['All', ...tagList]
    if (activeTag !== 'all' && !base.some((item) => item.toLowerCase() === activeTag)) {
      base.push(activeTag)
    }
    return base
  }, [tagList, activeTag])

  const visiblePosts = posts
    .filter((post) => activeTag === 'all' || post.tags.some((postTag) => postTag.toLowerCase() === activeTag))
    .filter((post) => post.title.toLowerCase().includes(search.trim().toLowerCase()))
    .map((post) => ({ ...post, ...(likeOverrides[post.id] || {}) }))

  const emptyText = search.trim() ? 'No posts match your search' : 'No posts for this tag'

  return (
    <>
      {!tagRoute && <FeaturedPost emoji={featured.emoji} title={featured.title} summary={featured.summary} author={featured.author} date={featured.date} readTime={featured.readTime} />}
      {tagRoute && <div className="tag-page-heading"><p className="author-label">TAG</p><h1 className="detail-title">#{activeTag}</h1></div>}
      {loading && <p className="status-message">Loading posts and authors…</p>}
      {loadError && <p className="status-message error-message">{loadError}</p>}
      {!loading && !loadError && (
        <>
          <div className="filter-bar">
            <TagFilter tags={tagsForFilter} activeTag={activeTag} />
            <SearchBox value={search} onChange={setSearch} />
          </div>
          <div className="layout">
            <PostGrid posts={visiblePosts} emptyText={emptyText} onToggleLike={onToggleLike} />
            <Sidebar popularTags={popularTags} topAuthors={topAuthors} />
          </div>
        </>
      )}
    </>
  )
}

function App() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [publishedPosts, setPublishedPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [likeOverrides, setLikeOverrides] = useState({})

  useEffect(() => {
    let active = true
    Promise.all([
      fetchJson('https://dummyjson.com/posts?limit=12'),
      fetchJson('https://dummyjson.com/users?limit=30&select=firstName,lastName,image,username'),
    ])
      .then(async ([postData, userData]) => {
        const authors = Object.fromEntries(userData.users.map((user) => [user.id, user]))
        const missingIds = [...new Set(postData.posts.map((post) => post.userId).filter((userId) => !authors[userId]))]
        const extraUsers = await Promise.all(missingIds.map((userId) =>
          fetchJson(`https://dummyjson.com/users/${userId}?select=firstName,lastName,image,username`),
        ))
        if (!active) return
        extraUsers.forEach((user) => { authors[user.id] = user })
        setUsers([...userData.users, ...extraUsers])
        setPosts(postData.posts.map((post) => normalizePost(post, authors)))
      })
      .catch((error) => { if (active) setLoadError(`Unable to load posts: ${error.message}`) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const allPosts = useMemo(() => [...publishedPosts, ...posts], [publishedPosts, posts])
  const tagList = useMemo(() => [...new Set(allPosts.flatMap((post) => post.tags).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [allPosts])
  const popularTags = tagList.slice(0, 12)
  const authorsById = Object.fromEntries(users.map((user) => [user.id, user]))
  const authorCounts = allPosts.reduce((counts, post) => {
    counts[post.userId] = (counts[post.userId] || 0) + 1
    return counts
  }, {})
  const topAuthors = Object.entries(authorCounts)
    .map(([userId, count]) => {
      const user = authorsById[userId]
      return user ? { id: userId, name: getAuthorName(user), image: user.image, posts: count } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.posts - a.posts)
    .slice(0, 3)

  function handleToggleLike(id, currentLikes = 0, currentlyLiked = false) {
    setLikeOverrides((current) => {
      const existing = current[id]
      const liked = existing ? existing.liked : currentlyLiked
      const likes = existing ? existing.likes : currentLikes
      return { ...current, [id]: { liked: !liked, likes: liked ? likes - 1 : likes + 1 } }
    })
  }

  function handlePublish(form) {
    const user = authorsById[Number(form.userId)]
    const title = form.title.trim()
    const content = form.content.trim()
    const authorName = getAuthorName(user)
    const newPost = {
      id: Date.now(),
      userId: Number(form.userId),
      title,
      body: content,
      summary: content.slice(0, 100),
      tags: form.tags.map((tag) => tag.toLowerCase()),
      author: authorName,
      authorPhoto: user?.image || '',
      initials: authorName.split(' ').map((word) => word[0]).join('').slice(0, 2),
      date: new Date().toLocaleDateString('en-GB'),
      likes: 0,
      liked: false,
    }
    setPublishedPosts((current) => [newPost, ...current])
    navigate('/')
    window.scrollTo(0, 0)
  }

  return (
    <>
      <Header blogName="DevDiary" links={['Home', 'Write', 'About']} />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomeFeed posts={allPosts} tagList={tagList} popularTags={popularTags} topAuthors={topAuthors} loading={loading} loadError={loadError} likeOverrides={likeOverrides} onToggleLike={handleToggleLike} tagRoute={false} />} />
          <Route path="/post/:id" element={<PostDetail likeOverrides={likeOverrides} onToggleLike={handleToggleLike} />} />
          <Route path="/write" element={<WriteForm users={users} popularTags={popularTags} onPublish={handlePublish} />} />
          <Route path="/tag/:tag" element={<HomeFeed posts={allPosts} tagList={tagList} popularTags={popularTags} topAuthors={topAuthors} loading={loading} loadError={loadError} likeOverrides={likeOverrides} onToggleLike={handleToggleLike} tagRoute />} />
          <Route path="/author/:id" element={<AuthorPage likeOverrides={likeOverrides} onToggleLike={handleToggleLike} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer text="© 2026 DevDiary. Written by trainees, for trainees." />
    </>
  )
}

export default App
