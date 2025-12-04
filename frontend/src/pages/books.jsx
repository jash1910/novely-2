import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchGoogleBooks } from "../api/books";
import HeroBanner from "../components/HeroBanner";
import "./books.css";

export default function BooksPage() {
  const categories = [
    { title: "Trending", query: "bestsellers" },
    { title: "Fantasy", query: "fantasy" },
    { title: "Romance", query: "romance" },
    { title: "Mystery", query: "mystery thriller" },
  ];

  const [rows, setRows] = useState({});
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function loadRows() {
      try {
        const results = {};
        for (const c of categories) {
          const res = await searchGoogleBooks(c.query, 1);
          results[c.title] = res.data.items || [];
        }
        setRows(results);
      } catch (err) {
        console.log("Failed to load homepage rows", err);
      }
    }
    loadRows();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setIsSearching(true);
    try {
      const res = await searchGoogleBooks(search, 1);
      setSearchResults(res.data.items || []);
    } catch (err) {
      console.log("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="books-page-pastel">
      <HeroBanner
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
        isSearching={isSearching}
      />

      <main className="books-main">
        {searchResults.length > 0 ? (
          <Section title={`Search results for "${search}"`}>
            <BookGrid books={searchResults} />
          </Section>
        ) : (
          <>
            <Section title="Trending now" subtitle="What everyone is reading this week">
              <BookGrid books={rows["Trending"] || []} />
            </Section>

            <Section title="Fantasy" subtitle="Magic • Worlds • Adventures">
              <BookGrid books={rows["Fantasy"] || []} />
            </Section>

            <Section title="Romance" subtitle="Warm • Heartfelt • Emotional">
              <BookGrid books={rows["Romance"] || []} />
            </Section>
          </>
        )}
      </main>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="section">
      <div className="section-header">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function BookGrid({ books }) {
  if (!books || books.length === 0) {
    return <p className="empty-text">Nothing here yet.</p>;
  }

  return (
    <div className="book-grid">
      {books.map((b) => {
        const info = b.volumeInfo || b;
        const id = b.id || b.googleBooksId;
        const cover =
          info.imageLinks?.thumbnail ||
          b.coverImage ||
          "https://via.placeholder.com/160x240?text=No+Cover";

        const title = info.title || b.title || "Untitled";
        const author =
          (info.authors && info.authors.join(", ")) ||
          b.author ||
          "Unknown Author";

        return (
          <Link to={`/read/${id}`} key={id} className="book-card">
            <img src={cover} alt={title} className="book-img" />
            <h3>{title}</h3>
            <p className="book-author">{author}</p>
          </Link>
        );
      })}
    </div>
  );
}
