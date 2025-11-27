import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// -------------------------
// PRICE PREDICTION
// -------------------------
export const predictPrice = (payload) => API.post("/predict", payload);

// -------------------------
// HOUSE COMPARISON
// -------------------------
export const compareHouses = (payload) => API.post("/compare", payload);

// -------------------------
// CHARTS / ANALYTICS
// -------------------------
export const getAnalytics = () => API.get("/charts/analytics");

// -------------------------
// DROPDOWN OPTIONS
// -------------------------
export const getDropdowns = () => API.get("/dropdowns");
