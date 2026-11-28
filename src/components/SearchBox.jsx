function SearchBox({ value, onChange }) {
  return (
    <input
      type="search"
      className="min-w-[260px] rounded-full border border-[#d6d6d6] px-5 py-3 text-base outline-none focus:border-accent max-[700px]:w-full max-[700px]:min-w-0"
      placeholder="Search by title..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export default SearchBox
