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
    <section className="mx-auto my-10 max-w-[760px] text-center">
      <p className="mb-2 text-[13px] font-bold tracking-[.12em] text-accent">404 · PAGE NOT FOUND</p>
      <h1 className="mt-3 mb-[18px] font-serif text-[38px] leading-[1.25] max-[700px]:text-[28px]">Oops! This page doesn't exist.</h1>
      <p className="mb-4 text-base text-muted">The link may be broken, or the page may have moved.</p>
      <a href="/" className="mt-3 inline-block self-start p-0 text-base font-semibold text-accent hover:underline">← Back to Home</a>
    </section>
  )
}

function AboutPage() {
  return (
    <section className="mx-auto my-10 max-w-[760px] text-center">
      <p className="mb-2 text-[13px] font-bold tracking-[.12em] text-accent">ABOUT DEVDIARY</p>
      <h1 className="mt-3 mb-[18px] font-serif text-[38px] leading-[1.25] max-[700px]:text-[28px]">Written by trainees, for trainees.</h1>
      <p className="mt-6 whitespace-pre-line text-lg leading-[1.8]">DevDiary is a place to share coding learnings, beginner-friendly tips, and stories from the developer journey.</p>
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
      {tagRoute && <div className="mt-[10px] mb-6"><p className="mb-2 text-[13px] font-bold tracking-[.12em] text-accent">TAG</p><h1 className="mt-3 mb-[18px] font-serif text-[38px] leading-[1.25] max-[700px]:text-[28px]">#{activeTag}</h1></div>}
      {loading && <p className="my-7 text-[17px] text-muted">Loading posts and authors…</p>}
      {error && <p className="my-7 text-[17px] text-red-700">{error}</p>}
      {!loading && !error && (
        <>
          <div className="mt-9 mb-7 flex flex-wrap items-center justify-between gap-4">
            <TagFilter tags={tagsForFilter} activeTag={activeTag} />
            <SearchBox value={search} onChange={setSearch} />
          </div>
          <div className="grid grid-cols-[1fr_380px] items-start gap-8 max-[1100px]:grid-cols-1">
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
      <main className="mx-auto max-w-[1500px] px-16 pt-10 pb-[60px] max-[1100px]:px-8 max-[700px]:px-5 max-[700px]:pt-6 max-[700px]:pb-10">
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
