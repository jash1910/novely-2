import { useNavigate } from "react-router-dom";
import "./row.css";

export default function Row({ title, books }) {
  const navigate = useNavigate();

  return (
    <div className="row-container">
      <h2>{title}</h2>
      <div className="row-scroll">
        {books.map((b) => (
          <div
            key={b.googleBooksId}
            className="row-card"
            onClick={() => navigate(`/read/${b.googleBooksId}`)}
          >
            <img src={b.coverImage} alt={b.title} />
            <p>{b.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
