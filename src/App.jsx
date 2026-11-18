import Header from './components/Header'
import FeaturedPost from './components/FeaturedPost'
import TagFilter from './components/TagFilter'
import PostGrid from './components/PostGrid'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import {
  featured,
  tags,
  posts,
  popularTags,
  topAuthors,
} from './data'

function App() {
  return (
    <>
      <Header blogName="DevDiary" links={['Home', 'Write', 'About']} />

      <main className="container">
        <FeaturedPost
          emoji={featured.emoji}
          title={featured.title}
          summary={featured.summary}
          author={featured.author}
          date={featured.date}
          readTime={featured.readTime}
        />

        <TagFilter tags={tags} />

        <div className="layout">
          <PostGrid posts={posts} />
          <Sidebar popularTags={popularTags} topAuthors={topAuthors} />
        </div>
      </main>

      <Footer text="© 2026 DevDiary. Written by trainees, for trainees." />
    </>
  )
}

export default App
