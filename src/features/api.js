import axios from "axios";

const isServer = typeof window === "undefined";

const api = () => {
  // Fetch the token dynamically for each request
  const token = !isServer ? localStorage.getItem("token") : null;

  return axios.create({
    baseURL: "http://localhost:3001", // Your API base URL
    headers: {
      Authorization: token ? `Bearer ${token}` : null, // Attach the token if it exists
    },
  });
};

export default api;