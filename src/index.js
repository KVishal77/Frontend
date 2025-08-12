// frontend/src/api/index.js
import axios from "axios";

// Env se lo; local fallback
export const API_BASE =
    process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function getSuggestion(plantName) {
    const res = await axios.post(`${API_BASE}/suggest`, { plantName });
    return res.data.suggestions;
}

export async function generateQR(url) {
    const res = await axios.post(`${API_BASE}/generateQR`, { url });
    return res.data.qr;
}

export async function savePlant(plantData) {
    const res = await axios.post(`${API_BASE}/save`, plantData);
    return res.data.id;
}

export async function searchPlantByName(name) {
    const res = await axios.get(`${API_BASE}/getbyname`, {
        params: { name },
    });
    return res.data;
}