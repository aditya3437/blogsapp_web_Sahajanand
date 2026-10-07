export default function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <a href="/" onClick={(event) => { event.preventDefault(); navigate('/') }} className="brand footer-brand">
        <span className="brand-mark">P</span>
        <span>Papertrail<span className="brand-period">.</span></span>
      </a>
      <span>A quieter corner of the internet.</span>
      <span>© {new Date().getFullYear()} Papertrail</span>
    </footer>
  )
}
