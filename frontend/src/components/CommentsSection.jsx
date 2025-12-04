import { useEffect, useState } from "react";
import { getComments, createComment } from "../api/comments";

import "./comments.css";

export default function CommentsSection({ bookId,book }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filterRating, setFilterRating] = useState("");

  const load = () => {
    let saved = JSON.parse(localStorage.getItem(`comments-${bookId}`)) || [];

    if (search.trim()) {
      saved = saved.filter((c) =>
        c.text.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterRating) {
      saved = saved.filter((c) => c.rating === Number(filterRating));
    }

    if (sort === "newest") {
      saved = saved.sort((a, b) => b.id - a.id);
    } else {
      saved = saved.sort((a, b) => a.id - b.id);
    }

    setComments(saved);
  };

  useEffect(() => {
    load();
  }, [bookId, search, sort, filterRating]);

  const submit = async (e) => {
  e.preventDefault();
  console.log("Submitting:", { text, rating, book });

  try {
    const res = await createComment(bookId, {
      text,
      rating,
      title: book.title,
      author: book.authors?.join(", "),
      description: book.description,
      coverImage: book.imageLinks?.thumbnail,
      genre: book.categories?.[0],
      publishedYear: book.publishedDate?.substring(0, 4),
    });

    setComments(prev => [res.data, ...prev]);
    setText("");
    setRating("");
  } catch (err) {
    console.error("POST ERROR:", err);
  }
};

  

  return (
    <div className="comments-container">
      <h2>Comments</h2>

      <div className="comment-controls">
        <input
          placeholder="Search comments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>
      </div>

      <form onSubmit={submit} className="comment-form">
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="">No rating</option>
          <option value="5">⭐⭐⭐⭐⭐</option>
          <option value="4">⭐⭐⭐⭐</option>
          <option value="3">⭐⭐⭐</option>
          <option value="2">⭐⭐</option>
          <option value="1">⭐</option>
        </select>

        <button type="submit" onClick={submit}>{editId ? "Update" : "Post"}</button>
      </form>

      {comments.length === 0 && <p>No comments yet. Be first!</p>}

      {comments.map((c) => (
        <div key={c.id} className="comment-card">
          <div className="comment-header">
            <span className="stars">{c.rating ? "⭐".repeat(c.rating) : ""}</span>
          </div>

          <p>{c.text}</p>

          <div className="comment-actions">
            <button
              onClick={() => {
                setEditId(c.id);
                setText(c.text);
                setRating(c.rating);
              }}
            >
              Edit
            </button>

            <button onClick={() => remove(c.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
