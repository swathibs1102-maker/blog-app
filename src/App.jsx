import { useMemo, useState } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
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
import { usePosts } from './context/PostsContext'

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

function HomeFeed({ tagRoute = false }) {
  const { tag } = useParams()
  const { posts, tagList, popularTags, topAuthors, loading, error } = usePosts()
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

  const emptyText = search.trim() ? 'No posts match your search' : 'No posts for this tag'

  return (
    <>
      {!tagRoute && <FeaturedPost emoji={featured.emoji} title={featured.title} summary={featured.summary} author={featured.author} date={featured.date} readTime={featured.readTime} />}
      {tagRoute && <div className="tag-page-heading"><p className="author-label">TAG</p><h1 className="detail-title">#{activeTag}</h1></div>}
      {loading && <p className="status-message">Loading posts and authors…</p>}
      {error && <p className="status-message error-message">{error}</p>}
      {!loading && !error && (
        <>
          <div className="filter-bar">
            <TagFilter tags={tagsForFilter} activeTag={activeTag} />
            <SearchBox value={search} onChange={setSearch} />
          </div>
          <div className="layout">
            <PostGrid posts={visiblePosts} emptyText={emptyText} />
            <Sidebar popularTags={popularTags} topAuthors={topAuthors} />
          </div>
        </>
      )}
    </>
  )
}

function App() {
  return (
    <>
      <Header blogName="DevDiary" links={['Home', 'Write', 'About']} />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomeFeed />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/write" element={<WriteForm />} />
          <Route path="/tag/:tag" element={<HomeFeed tagRoute />} />
          <Route path="/author/:id" element={<AuthorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer text="© 2026 DevDiary. Written by trainees, for trainees." />
    </>
  )
}

export default App
