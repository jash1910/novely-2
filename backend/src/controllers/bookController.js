import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const GOOGLE_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

// GOOGLE BOOK SEARCH
export const searchGoogleBooks = async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q) return res.status(400).json({ message: "Query required" });

    const limit = 20;
    const startIndex = (Number(page) - 1) * limit;

    const { data } = await axios.get(GOOGLE_BASE_URL, {
      params: {
        q,
        startIndex,
        maxResults: limit,
        key: process.env.GOOGLE_BOOKS_API_KEY || undefined,
      },
    });

    const items = (data.items || []).map(item => {
      const info = item.volumeInfo || {};
      const access = item.accessInfo || {};

      return {
        googleBooksId: item.id,
        title: info.title || "Untitled",
        author: Array.isArray(info.authors) ? info.authors.join(", ") : "Unknown",
        description: info.description || "",
        coverImage: info.imageLinks?.thumbnail || "",
        publishedYear: info.publishedDate?.slice(0, 4) || "",
        genre: info.categories?.[0] || "",
        previewLink: info.previewLink || "",
        embeddable: access.embeddable ?? true,
        viewability: access.viewability ?? "PARTIAL",
      };
    });

    res.json({ items, total: items.length, page, pageSize: limit });
  } catch (err) {
    console.log("GOOGLE SEARCH ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch Google books" });
  }
};

// SAVE BOOK
export const saveBook = async (req, res) => {
  try {
    const { googleBooksId, title, author, description, coverImage, publishedYear, genre } = req.body;

    const exists = await prisma.book.findUnique({ where: { googleBooksId } });
    if (exists) return res.status(400).json({ message: "Book already saved" });

    const book = await prisma.book.create({
      data: { googleBooksId, title, author, description, coverImage, publishedYear, genre },
    });

    res.status(201).json(book);
  } catch {
    res.status(500).json({ message: "Failed to save book" });
  }
};

// GET ALL SAVED BOOKS
export const getSavedBooks = async (req, res) => {
  try {
    const items = await prisma.book.findMany({ orderBy: { createdAt: "desc" } });
    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to fetch saved books" });
  }
};

// GET SINGLE BOOK BY DB ID
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({ where: { id } });
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.json(book);
  } catch {
    res.status(500).json({ message: "Failed to fetch book" });
  }
};

// UPDATE
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { genre, description } = req.body;

    const book = await prisma.book.update({
      where: { id },
      data: { genre, description },
    });

    res.json(book);
  } catch {
    res.status(500).json({ message: "Failed to update book info" });
  }
};

// DELETE
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.book.delete({ where: { id } });
    res.json({ message: "Book removed" });
  } catch {
    res.status(500).json({ message: "Failed to delete book" });
  }
};
