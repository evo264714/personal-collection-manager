// import axios from "axios";

// const instance = axios.create({
//   baseURL: "https://personal-collection-manager-backend.onrender.com/",
//   baseURL: "http://localhost:5000/",
// });

// export default instance;




import axios from "axios";

// Determine backend URL based on current hostname
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/"
    : "https://personal-collection-manager-backend.onrender.com/";

const instance = axios.create({
  baseURL,
  // You can add other configuration options here if needed
});

export default instance;
