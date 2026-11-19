import { useState } from 'react'

const categories = ['React', 'JavaScript','java', 'CSS', 'Career']

function WriteForm({ onPublish }) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState('React')
  const [author, setAuthor] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (title.trim() === '' || content.trim() === '') {
      setError('Title and content are required.')
      return
    }

    onPublish({ title, summary, content, tag, author })
  }

  return (
    <form className="write-form" onSubmit={handleSubmit}>
      <h1 className="detail-title">Write a post</h1>

      <label>
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your post a title"
        />
      </label>

      <label>
        Summary
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="One line about your post"
        />
      </label>

      <label>
        Content
        <textarea
          rows="8"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post here..."
        />
      </label>

      <div className="form-row">
        <label>
          Tag
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Author
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="publish-btn">
        Publish
      </button>
    </form>
  )
}

export default WriteForm
