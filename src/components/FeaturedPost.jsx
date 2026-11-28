function FeaturedPost({ emoji, title, summary, author, date, readTime }) {
  return (
    <section className="grid min-h-[360px] grid-cols-2 overflow-hidden rounded-3xl bg-ink text-white max-[700px]:grid-cols-1">
      <div className="flex items-center justify-center bg-accent text-[120px] max-[700px]:h-[200px] max-[700px]:text-[80px]">{emoji}</div>
      <div className="flex flex-col items-start justify-center p-12 max-[700px]:px-6 max-[700px]:py-[28px]">
        <span className="mb-4 rounded-full bg-accent px-3.5 py-1 text-[13px] font-semibold">Featured</span>
        <h1 className="mb-[14px] font-serif text-[40px] leading-[1.25] max-[700px]:text-[28px]">{title}</h1>
        <p className="mb-5 text-lg text-[#d0d0d0]">{summary}</p>
        <p className="text-[15px] text-[#b5b5b5]">
          By {author || 'DevDiary team'} · {date} · {readTime} min read
        </p>
      </div>
    </section>
  )
}

export default FeaturedPost
