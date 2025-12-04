import "./hero.css";

export default function HeroBanner({ onSearch, search, setSearch, isSearching }) {
  return (
    <section className="hero-pastel centered-hero">
      <p className="hero-pill">Novely · read with love</p>

      <h1 className="hero-title">
        There is nothing better
        <br />
        than a good <span>book</span>.
      </h1>

      <p className="hero-sub">
        Discover comforting romances, magical fantasies, and powerful stories
        in your happy cozy reading space.
      </p>

      <form className="hero-search" onSubmit={onSearch}>
        <input
          placeholder="Search books, authors, genres..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="primary-btn" type="submit">
          {isSearching ? "Searching..." : "Search"}
        </button>
      </form>
    </section>
  );
}
