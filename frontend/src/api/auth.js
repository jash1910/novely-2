import axios from "axios";

const API = axios.create({
  baseURL: "https://novely-2.onrender.com/api/auth"
});

export const signup = (data) => API.post("/signup", data);
export const login = (data) => API.post("/login", data);
