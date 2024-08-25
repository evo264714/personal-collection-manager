import axios from "axios";

const instance = axios.create({
  baseURL: "https://personal-collection-manager-backend.onrender.com/",
});

export default instance;
