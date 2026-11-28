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
    <section>
      {loading && <p className="my-7 text-[17px] text-muted">Loading author…</p>}
      {error && <p className="my-7 text-[17px] text-red-700">Unable to load author: {error}</p>}
      {user && !error && (
        <>
          <div className="mb-9 flex items-center gap-7 rounded-[20px] border border-line p-[30px] max-[700px]:flex-col max-[700px]:p-6 max-[700px]:text-center">
            <img src={user.image} alt={`${user.firstName} ${user.lastName}`} className="h-[120px] w-[120px] shrink-0 rounded-full object-cover max-[700px]:h-[100px] max-[700px]:w-[100px]" />
            <div>
              <p className="mb-2 text-[13px] font-bold tracking-[.12em] text-accent">AUTHOR PROFILE</p>
              <h1 className="mt-3 mb-[18px] font-serif text-[38px] leading-[1.25] max-[700px]:text-[28px]">{user.firstName} {user.lastName}</h1>
              <p className="mb-4 text-base text-muted">@{user.username} · {posts.length} posts</p>
              <p className="mb-4 text-base text-muted">{user.company?.title || 'Blog contributor'}</p>
              <Link to="/" className="self-start p-0 text-base font-semibold text-accent hover:underline">← Back to blog</Link>
            </div>
          </div>
                    <h2 className="mb-[22px] font-serif text-[28px]">Posts by {user.firstName}</h2>
          <PostGrid posts={posts} emptyText="This author has no posts." />
        </>
      )}
    </section>
  )
}

export default AuthorPage
