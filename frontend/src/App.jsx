import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import BooksPage from "./pages/books"; 
import BookReader from "./pages/BookReader"; // 🟩 IMPORTANT IMPORT

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 🟩 NEW READER PAGE ROUTE */}
        <Route path="/read/:id" element={<BookReader />} />

      </Routes>
    </BrowserRouter>
  );
}
