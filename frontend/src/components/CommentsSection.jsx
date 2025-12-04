import { useEffect, useState } from "react";
// import { getComments, createComment } from "../api/comments"; // NOTE: API calls are commented out for purely local storage implementation

import "./comments.css";

// Helper function to save the current list of comments to localStorage
const saveComments = (bookId, comments) => {
  localStorage.setItem(`comments-${bookId}`, JSON.stringify(comments));
};

export default function CommentsSection({ bookId, book }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [filterRating, setFilterRating] = useState("");

  // Function to load, search, filter, and sort comments from localStorage
  const load = () => {
    // 1. Load the raw data from localStorage
    let saved = JSON.parse(localStorage.getItem(`comments-${bookId}`)) || [];

    // 2. Apply Search
    if (search.trim()) {
      saved = saved.filter((c) =>
        c.text.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 3. Apply Filter by Rating
    if (filterRating) {
      // Ensure the filter value is converted to a number for comparison
      saved = saved.filter((c) => c.rating === Number(filterRating));
    }

    // 4. Apply Sorting
    if (sort === "newest") {
      // Sort by descending ID (assuming ID reflects creation time)
      saved = saved.sort((a, b) => b.id - a.id);
    } else {
      // Sort by ascending ID
      saved = saved.sort((a, b) => a.id - b.id);
    }

    // 5. Update the state
    setComments(saved);
  };

  // Re-run the load function whenever bookId, search, sort, or filterRating changes
  useEffect(() => {
    load();
    // Also log the current bookId for debugging if needed
    console.log("Loading comments for bookId:", bookId); 
  }, [bookId, search, sort, filterRating]);


  // 🚀 Handle Comment Submission (Create or Update)
  const submit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
        alert("Comment text cannot be empty.");
        return;
    }
    
    // Create a new comment object
    const newComment = {
      // Use a unique ID (e.g., current timestamp + random number) for new comments
      // If editing, use the existing editId
      id: editId || Date.now() + Math.random(), 
      text,
      // Convert rating string to a number, or 0 if empty
      rating: Number(rating) || 0, 
      // Add book details (optional, but good for context if comments were ever global)
      bookId, 
      title: book.title,
      author: book.authors?.join(", "),
      // ... other book details
    };

    setComments(prevComments => {
        let updatedComments;
        
        if (editId) {
            // Update existing comment
            updatedComments = prevComments.map(c => 
                c.id === editId ? newComment : c
            );
        } else {
            // Add new comment to the beginning of the list
            updatedComments = [newComment, ...prevComments];
        }

        // Save the updated list to localStorage
        saveComments(bookId, updatedComments);
        
        // Reset form fields
        setText("");
        setRating("");
        setEditId(null);

        // NOTE: After saving, we reload/re-filter the comments 
        // by calling 'load()' to ensure sorting/filtering is applied correctly.
        load();
        
        // Return the *current* state (before the 'load()' updates it)
        return updatedComments; 
    });

  };
  
  // 🗑️ Handle Comment Deletion
  const remove = (id) => {
    setComments((prevComments) => {
      // Filter out the comment to be deleted
      const updatedComments = prevComments.filter((c) => c.id !== id);
      
      // Save the new list back to localStorage
      saveComments(bookId, updatedComments);
      
      // Return the new list to update the component state
      return updatedComments;
    });
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

        <button type="submit">{editId ? "Update" : "Post"}</button> 
        {/* Changed onClick to type="submit" for form handling */}
        {editId && <button type="button" onClick={() => {setText(""); setRating(""); setEditId(null);}}>Cancel Edit</button>}
      </form>

      {comments.length === 0 && <p>No comments yet. Be first!</p>}

      {comments.map((c) => (
        <div key={c.id} className="comment-card">
          <div className="comment-header">
            {/* Display rating only if it's a positive number */}
            <span className="stars">{c.rating > 0 ? "⭐".repeat(c.rating) : ""}</span> 
          </div>

          <p>{c.text}</p>

          <div className="comment-actions">
            <button
              onClick={() => {
                setEditId(c.id);
                setText(c.text);
                // Ensure rating is set as a string for the select input
                setRating(String(c.rating || "")); 
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