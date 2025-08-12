import axios from "axios";

// env + trailing slash safe
export const API_BASE = (process.env.REACT_APP_API_URL || "https://api.plantshazam.com").replace(/\/+$/, "");

const api = axios.create({
    baseURL: API_BASE,
    timeout: 20000,
});

export async function getSuggestion(plantName) {
    const { data } = await api.post("/suggest", { plantName });
    return data.suggestions;
}

export async function generateQR(url) {
    const { data } = await api.post("/generateQR", { url });
    return data.qr;
}

export async function savePlant(plantData) {
    const { data } = await api.post("/save", plantData);
    return data.id;
}

export async function searchPlantByName(name) {
    const { data } = await api.get("/getbyname", { params: { name } });
    return data;
}