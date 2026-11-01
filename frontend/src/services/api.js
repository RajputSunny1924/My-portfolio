// Automatically select the correct backend URL
// const LOCAL_API = "http://127.0.0.1:8000";
const PRODUCTION_API = "https://portfolio-backend-2swx.onrender.com";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const API_BASE = isLocalhost ? LOCAL_API : PRODUCTION_API;

export default API_BASE;
