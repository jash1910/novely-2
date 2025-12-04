import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentsSection from "../components/CommentsSection";
import { saveBook, deleteBook, markAsRead } from "../api/books";
import "./BookReader.css";

export default function BookReader() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    async function loadBook() {
      try {
        // Try DB first
        const dbRes = await fetch(`http://localhost:5001/api/books/${id}`);
        const dbData = await dbRes.json();

        if (dbData && dbData.title) {
          setBook(dbData);
          return;
        }

        // If not found in DB, load from Google Books API
        const googleRes = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        const googleData = await googleRes.json();
        const info = googleData.volumeInfo;

        setBook({
          googleBooksId: id,
          title: info.title || "Untitled",
          author: info.authors?.join(", ") || "Unknown",
          description: info.description || "No description available.",
          coverImage: info.imageLinks?.thumbnail || "",
          publishedYear: info.publishedDate?.slice(0, 4) || "",
          genre: info.categories?.[0] || "",
        });
      } catch (err) {
        console.log("Failed to load book:", err);
      }
    }

    loadBook();
  }, [id]);

  if (!book)
    return <h1 className="loading-text">Loading book details...</h1>;

  return (
    <div className="reader-container">
      <div className="reader-header">
        <img src={book.coverImage} alt={book.title} className="reader-cover" />

        <div className="reader-info">
          <h1>{book.title}</h1>
          <p className="author">{book.author}</p>

          {book.genre && <p className="genre-tag">{book.genre}</p>}

          <p className="description">{book.description}</p>

          <div className="reader-actions">
            <button onClick={() => saveBook(book)}>Save</button>
            <button onClick={() => markAsRead(book.googleBooksId)}>Mark Read</button>
            <button onClick={() => deleteBook(book.googleBooksId)}>Delete</button>
          </div>
        </div>
      </div>

      <CommentsSection bookId={id} book={book} />

    </div>
  );
}
