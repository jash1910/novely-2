import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5001/api/comments",

});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getComments = (bookId) => API.get(`/${bookId}`);
export const createComment = (bookId, data) => API.post(`/${bookId}`, data);
export const updateComment = (id, data) => API.patch(`/${id}`, data);
export const deleteComment = (id) => API.delete(`/${id}`);
