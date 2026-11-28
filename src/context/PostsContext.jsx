import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const PostsContext = createContext(null)

function getAuthorName(user) {
  if (!user) return 'Unknown author'
  return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || 'Unknown author'
}

function normalizePost(post, authors) {
  const author = authors[post.userId]
  const authorName = getAuthorName(author)
  return {
    ...post,
    title: post.title || '',
    body: post.body || '',
    summary: (post.body || '').slice(0, 100),
    tags: Array.isArray(post.tags) ? post.tags : [],
    author: post.author || authorName,
    authorPhoto: post.authorPhoto || author?.image || '',
    initials: post.initials || authorName.split(' ').map((word) => word[0]).join('').slice(0, 2),
    date: post.date || 'DummyJSON post',
    likes: post.likes ?? post.reactions?.likes ?? 0,
    liked: Boolean(post.liked),
  }
}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Request failed (${response.status})`)
  return response.json()
}

export function PostsProvider({ children }) {
  const [apiPosts, setApiPosts] = useState([])
  const [publishedPosts, setPublishedPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [likeOverrides, setLikeOverrides] = useLocalStorage('devdiary-like-overrides', {})

  useEffect(() => {
    let active = true

    Promise.all([
      fetchJson('https://dummyjson.com/posts?limit=12'),
      fetchJson('https://dummyjson.com/users?limit=30&select=firstName,lastName,image,username'),
    ])
      .then(async ([postData, userData]) => {
        const authors = Object.fromEntries(userData.users.map((user) => [user.id, user]))
        const missingIds = [...new Set(postData.posts.map((post) => post.userId).filter((id) => !authors[id]))]
        const extraUsers = await Promise.all(missingIds.map((id) =>
          fetchJson(`https://dummyjson.com/users/${id}?select=firstName,lastName,image,username`),
        ))
        if (!active) return
        extraUsers.forEach((user) => { authors[user.id] = user })
        const allUsers = [...userData.users, ...extraUsers]
        setUsers(allUsers)
        setApiPosts(postData.posts.map((post) => normalizePost(post, authors)))
      })
      .catch((fetchError) => {
        if (active) setError(`Unable to load posts: ${fetchError.message}`)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const usersById = useMemo(
    () => Object.fromEntries(users.map((user) => [user.id, user])),
    [users],
  )

  const posts = useMemo(() => {
    const combined = [...publishedPosts, ...apiPosts]
    return combined.map((post) => ({ ...post, ...(likeOverrides[post.id] || {}) }))
  }, [publishedPosts, apiPosts, likeOverrides])

  const addPost = useCallback((form) => {
    const user = usersById[Number(form.userId)]
    if (!user) throw new Error('Please select a valid author.')

    const title = form.title.trim()
    const content = form.content.trim()
    const author = getAuthorName(user)
    const newPost = {
      id: Date.now(),
      userId: Number(form.userId),
      title,
      body: content,
      summary: content.slice(0, 100),
      tags: form.tags.map((tag) => tag.toLowerCase()),
      author,
      authorPhoto: user.image || '',
      initials: author.split(' ').map((word) => word[0]).join('').slice(0, 2),
      date: new Date().toLocaleDateString('en-GB'),
      likes: 0,
      liked: false,
    }
    setPublishedPosts((current) => [newPost, ...current])
    return newPost
  }, [usersById])

  const toggleLike = useCallback((id, currentLikes = 0, currentlyLiked = false) => {
    setLikeOverrides((current) => {
      const existing = current[id]
      const liked = existing ? existing.liked : currentlyLiked
      const likes = existing ? existing.likes : currentLikes
      return {
        ...current,
        [id]: { liked: !liked, likes: liked ? likes - 1 : likes + 1 },
      }
    })
  }, [setLikeOverrides])

  const getAuthor = useCallback((userId) => usersById[Number(userId)] || null, [usersById])

  const tagList = useMemo(
    () => [...new Set(posts.flatMap((post) => post.tags).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [posts],
  )
  const popularTags = tagList.slice(0, 12)
  const authorCounts = posts.reduce((counts, post) => {
    counts[post.userId] = (counts[post.userId] || 0) + 1
    return counts
  }, {})
  const topAuthors = Object.entries(authorCounts)
    .map(([userId, count]) => {
      const user = getAuthor(userId)
      return user ? { id: userId, name: getAuthorName(user), image: user.image, posts: count } : null
    })
    .filter(Boolean)
    .sort((a, b) => b.posts - a.posts)
    .slice(0, 3)

  const value = {
    posts,
    users,
    addPost,
    toggleLike,
    likeOverrides,
    getAuthor,
    loading,
    error,
    tagList,
    popularTags,
    topAuthors,
  }

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (!context) throw new Error('usePosts must be used inside PostsProvider')
  return context
}
