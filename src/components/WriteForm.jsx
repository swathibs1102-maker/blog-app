import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePosts } from '../context/PostsContext'

function validate(form) {
  const errors = {}
  const title = form.title.trim()
  const summary = form.summary.trim()
  const content = form.content.trim()

  if (!title) errors.title = 'Title is required.'
  else if (title.length < 10) errors.title = 'Title must be at least 10 characters.'
  else if (title.length > 100) errors.title = 'Title must be no more than 100 characters.'

  if (summary.length > 160) errors.summary = 'Summary must be no more than 160 characters.'
  if (!content) errors.content = 'Content is required.'
  else if (content.length < 100) errors.content = 'Content must be at least 100 characters.'
  if (!form.tags.length) errors.tags = 'Select at least one tag.'
  if (!form.userId.trim()) errors.userId = 'Select an author.'

  return errors
}

function WriteForm() {
  const { users, popularTags, addPost } = usePosts()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    tags: [],
    userId: '',
  })
  const [errors, setErrors] = useState({})
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    setForm((current) => ({
      ...current,
      tags: current.tags.filter((tag) => popularTags.includes(tag)),
    }))
  }, [popularTags])

  useEffect(() => {
    if (users.length && !users.some((user) => String(user.id) === form.userId)) {
      const nextForm = { ...form, userId: String(users[0].id) }
      setForm(nextForm)
      setErrors((current) => {
        const nextErrors = { ...current }
        delete nextErrors.userId
        return nextErrors
      })
    }
  }, [users, form])

  function updateField(field, value) {
    const nextForm = { ...form, [field]: value }
    setForm(nextForm)

    if (errors[field]) {
      const validation = validate(nextForm)
      setErrors((current) => {
        const nextErrors = { ...current }
        if (validation[field]) nextErrors[field] = validation[field]
        else delete nextErrors[field]
        return nextErrors
      })
    }
  }

  function validateField(field) {
    const validation = validate(form)
    setErrors((current) => {
      const nextErrors = { ...current }
      if (validation[field]) nextErrors[field] = validation[field]
      else delete nextErrors[field]
      return nextErrors
    })
  }

  function handleTagChange(tag) {
    const tags = form.tags.includes(tag)
      ? form.tags.filter((currentTag) => currentTag !== tag)
      : [...form.tags, tag]
    updateField('tags', tags)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const normalizedForm = {
      ...form,
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content.trim(),
    }
    const validation = validate(normalizedForm)
    setErrors(validation)

    if (Object.keys(validation).length > 0) {
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch('https://dummyjson.com/posts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: normalizedForm.title,
          body: normalizedForm.content,
          summary: normalizedForm.summary,
          tags: normalizedForm.tags,
          userId: Number(normalizedForm.userId),
        }),
      })
      if (!response.ok) throw new Error(`Request failed (${response.status})`)
      const createdPost = await response.json()
      addPost({ ...normalizedForm, id: createdPost.id })
      setErrors({})
      navigate('/')
      window.scrollTo(0, 0)
    } catch (publishError) {
      setErrors((current) => ({
        ...current,
        submit: `Unable to publish post: ${publishError.message || 'Please try again.'}`,
      }))
    } finally {
      setIsPublishing(false)
    }
  }

  const hasFieldErrors = Object.keys(errors).some((field) => field !== 'submit')

  return (
    <form className="mx-auto flex max-w-[760px] flex-col gap-5" onSubmit={handleSubmit}>
      <h1 className="mt-3 mb-[18px] font-serif text-[38px] leading-[1.25] max-[700px]:text-[28px]">Write a post</h1>
      <label className="flex flex-1 flex-col gap-1.5 text-[15px] font-medium">
        Title
        <input
          className={`rounded-xl border bg-white px-4 py-3 text-base outline-none ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-[#d6d6d6] focus:border-accent'}`}
          type="text"
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          onBlur={() => validateField('title')}
          placeholder="Give your post a title"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : 'title-count'}
        />
        {errors.title && <span id="title-error" className="text-sm text-red-600">{errors.title}</span>}
        <span id="title-count" className="self-end text-xs text-muted">{form.title.length}/100</span>
      </label>
      <label className="flex flex-1 flex-col gap-1.5 text-[15px] font-medium">
        Summary
        <input
          className={`rounded-xl border bg-white px-4 py-3 text-base outline-none ${errors.summary ? 'border-red-500 focus:border-red-500' : 'border-[#d6d6d6] focus:border-accent'}`}
          type="text"
          value={form.summary}
          onChange={(e) => updateField('summary', e.target.value)}
          onBlur={() => validateField('summary')}
          placeholder="Add a short summary (optional)"
          aria-invalid={Boolean(errors.summary)}
          aria-describedby={errors.summary ? 'summary-error' : 'summary-count'}
        />
        {errors.summary && <span id="summary-error" className="text-sm text-red-600">{errors.summary}</span>}
        <span id="summary-count" className="self-end text-xs text-muted">{form.summary.length}/160</span>
      </label>
      <label className="flex flex-1 flex-col gap-1.5 text-[15px] font-medium">
        Content
        <textarea
          className={`resize-y rounded-xl border bg-white px-4 py-3 text-base outline-none ${errors.content ? 'border-red-500 focus:border-red-500' : 'border-[#d6d6d6] focus:border-accent'}`}
          rows="8"
          value={form.content}
          onChange={(e) => updateField('content', e.target.value)}
          onBlur={() => validateField('content')}
          placeholder="Write your post here..."
          aria-invalid={Boolean(errors.content)}
          aria-describedby={errors.content ? 'content-error' : 'content-count'}
        />
        {errors.content && <span id="content-error" className="text-sm text-red-600">{errors.content}</span>}
        <span id="content-count" className="self-end text-xs text-muted">{form.content.length}/100 minimum</span>
      </label>
      <div className="flex gap-5 max-[700px]:flex-col">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <fieldset
            className={`flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2.5 rounded-xl border px-4 py-3 ${errors.tags ? 'border-red-500' : 'border-[#d6d6d6]'}`}
            disabled={popularTags.length === 0}
            aria-describedby={errors.tags ? 'tags-error' : undefined}
          >
            <legend className="px-1 text-[15px] font-medium">Tags</legend>
            {popularTags.length === 0 ? (
              <p className="text-sm leading-[1.3] text-muted">No popular tags available</p>
            ) : popularTags.map((popularTag) => (
              <label className="flex flex-none cursor-pointer flex-row items-center gap-2 text-sm" key={popularTag}>
                <input
                  className="h-4 w-4 p-0 accent-accent"
                  type="checkbox"
                  value={popularTag}
                  checked={form.tags.includes(popularTag)}
                  onChange={() => handleTagChange(popularTag)}
                  onBlur={() => validateField('tags')}
                />
                {popularTag.charAt(0).toUpperCase() + popularTag.slice(1)}
              </label>
            ))}
          </fieldset>
          {errors.tags && <span id="tags-error" className="text-sm text-red-600">{errors.tags}</span>}
        </div>
        <label className="flex flex-1 flex-col gap-1.5 text-[15px] font-medium">
          Author
          <select
            className={`rounded-xl border bg-white px-4 py-3 text-base outline-none ${errors.userId ? 'border-red-500 focus:border-red-500' : 'border-[#d6d6d6] focus:border-accent'}`}
            value={form.userId}
            onChange={(e) => updateField('userId', e.target.value)}
            onBlur={() => validateField('userId')}
            disabled={users.length === 0}
            aria-invalid={Boolean(errors.userId)}
            aria-describedby={errors.userId ? 'author-error' : undefined}
          >
            {users.length === 0 && <option value="">Loading authors…</option>}
            {users.map((user) => <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>)}
          </select>
          {errors.userId && <span id="author-error" className="text-sm text-red-600">{errors.userId}</span>}
        </label>
      </div>
      {errors.submit && <p className="text-[15px] text-red-700" role="alert">{errors.submit}</p>}
      <button type="submit" className="self-start cursor-pointer rounded-full bg-accent px-8 py-3 text-base font-semibold text-white hover:bg-[#cf4a23] disabled:cursor-not-allowed disabled:opacity-[0.65]" disabled={isPublishing || hasFieldErrors || users.length === 0 || popularTags.length === 0}>
        {isPublishing ? 'Publishing…' : 'Publish'}
      </button>
    </form>
  )
}

export default WriteForm
