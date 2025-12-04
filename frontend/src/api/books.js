import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const searchGoogleBooks = (q, page = 1) =>
  API.get("/books/search", { params: { q, page } });

export const saveBook = (book) => API.post("/books/save", book);

export const getSavedBooks = (params) => API.get("/books/saved", { params });

export const updateBook = (id, data) => API.put(`/books/${id}`, data);

export const deleteBook = (id) => API.delete(`/books/${id}`);

export const markAsRead = (id) => API.post(`/books/${id}/read`);

export const getReadBooks = (page = 1) =>
  API.get("/books/read/list", { params: { page } });

export const getRecommendations = () => API.get("/recommend");
