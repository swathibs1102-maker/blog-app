import { useState } from 'react'
import Header from './components/Header'
import FeaturedPost from './components/FeaturedPost'
import TagFilter from './components/TagFilter'
import SearchBox from './components/SearchBox'
import PostGrid from './components/PostGrid'
import PostDetail from './components/PostDetail'
import WriteForm from './components/WriteForm'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import {
  featured,
  tags,
  popularTags,
  tagStyles,
  initialPosts,
} from './data'

function App() {
  // ---- state (the only things we store) ----
  const [posts, setPosts] = useState(initialPosts)
  const [activeTag, setActiveTag] = useState('All')
  const [search, setSearch] = useState('')
  const [view, setView] = useState('home') // 'home' | 'post' | 'write'
  const [selectedPostId, setSelectedPostId] = useState(null)

  // ---- calculated while rendering (not stored) ----
  const visiblePosts = posts.filter((post) => {
    const matchesTag =
      activeTag === 'All' || post.tags.includes(activeTag.toLowerCase())
    const matchesSearch = post.title
      .toLowerCase()
      .includes(search.trim().toLowerCase())
    return matchesTag && matchesSearch
  })

  const selectedPost = posts.find((post) => post.id === selectedPostId)

  const authorCounts = {}
  posts.forEach((post) => {
    authorCounts[post.author] = (authorCounts[post.author] || 0) + 1
  })
  const topAuthors = Object.keys(authorCounts)
    .map((name) => {
      const firstPost = posts.find((post) => post.author === name)
      return {
        name,
        initials: firstPost.initials,
        avatarColor: firstPost.avatarColor,
        posts: authorCounts[name],
      }
    })
    .sort((a, b) => b.posts - a.posts)
    .slice(0, 3)

  const emptyText = search.trim()
    ? 'No posts match your search'
    : 'No posts for this tag'

  // ---- handlers ----
  function goTo(nextView) {
    setView(nextView)
    window.scrollTo(0, 0)
  }

  function handleNavigate(link) {
    if (link === 'Home') goTo('home')
    if (link === 'Write') goTo('write')
  }

  function handleToggleLike(id) {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
  }

  function handleReadMore(id) {
    setSelectedPostId(id)
    goTo('post')
  }

  function handlePublish(form) {
    const author = form.author.trim() || 'Anonymous'
    const existing = posts.find((post) => post.author === author)
    const words = author.split(' ').filter(Boolean)
    const initials = words
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join('')

    const newPost = {
      id: Date.now(),
      emoji: tagStyles[form.tag].emoji,
      bg: tagStyles[form.tag].bg,
      tag: form.tag,
      tags: [form.tag.toLowerCase()],
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content.trim(),
      author,
      initials,
      avatarColor: existing ? existing.avatarColor : '#e4572e',
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      likes: 0,
      liked: false,
    }

    setPosts([newPost, ...posts])
    setActiveTag('All')
    setSearch('')
    goTo('home')
  }

  return (
    <>
      <Header
        blogName="DevDiary"
        links={['Home', 'Write', 'About']}
        view={view}
        onNavigate={handleNavigate}
      />

      <main className="container">
        {view === 'home' && (
          <>
            <FeaturedPost
              emoji={featured.emoji}
              title={featured.title}
              summary={featured.summary}
              author={featured.author}
              date={featured.date}
              readTime={featured.readTime}
            />

            <div className="filter-bar">
              <TagFilter
                tags={tags}
                activeTag={activeTag}
                onTagSelect={setActiveTag}
              />
              <SearchBox value={search} onChange={setSearch} />
            </div>

            <div className="layout">
              <PostGrid
                posts={visiblePosts}
                emptyText={emptyText}
                onToggleLike={handleToggleLike}
                onReadMore={handleReadMore}
              />
              <Sidebar
                popularTags={popularTags}
                topAuthors={topAuthors}
                activeTag={activeTag}
                onTagSelect={setActiveTag}
              />
            </div>
          </>
        )}

        {view === 'post' && selectedPost && (
          <PostDetail
            post={selectedPost}
            onBack={() => goTo('home')}
            onToggleLike={handleToggleLike}
          />
        )}

        {view === 'write' && <WriteForm onPublish={handlePublish} />}
      </main>

      <Footer text="© 2026 DevDiary. Written by trainees, for trainees." />
    </>
  )
}

export default App
