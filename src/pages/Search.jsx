import React, { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

function Search() {
    const [query, setQuery] = useState("");
    const [plant, setPlant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setSaved(false);
        try {
            const response = await axios.post("http://localhost:5000/suggest", {
                name: query,
            });
            setPlant(response.data);
        } catch (err) {
            console.error("Error searching plant:", err);
        } finally {
            setLoading(false);
        }
    };

    const savePlant = async () => {
        const user = auth.currentUser;
        if (!user || !plant) return;
        try {
            await axios.post("http://localhost:5000/save", {
                uid: user.uid,
                ...plant,
            });
            setSaved(true);
        } catch (err) {
            console.error("Error saving plant:", err);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 pb-28 px-4 pt-6">
            <h1 className="text-2xl font-bold text-green-700 mb-4">Search for a Plant 🌱</h1>
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Enter plant name"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border rounded-md px-4 py-2"
                />
                <button
                    onClick={handleSearch}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    Search with AI
                </button>
            </div>

            {loading && <p className="text-gray-600">Loading...</p>}

            {plant && (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <img
                        src={plant.image || "https://via.placeholder.com/400x250?text=No+Image"}
                        alt={plant.name}
                        className="w-full h-60 object-cover rounded-lg mb-4"
                    />
                    <h2 className="text-2xl font-bold text-green-800">{plant.name}</h2>
                    <p className="italic text-sm text-gray-500 mb-2">{plant.scientific_name}</p>

                    <div className="text-gray-700 space-y-2 mt-4">
                        <p><strong>Sunlight:</strong> {plant.sunlight}</p>
                        <p><strong>Watering:</strong> {plant.watering}</p>
                        <p><strong>Soil:</strong> {plant.soil}</p>
                        <p><strong>Seasonality:</strong> {plant.seasonality}</p>
                        <p><strong>Uses/Notes:</strong> {plant.uses_notes}</p>
                    </div>

                    <div className="mt-6">
                        <img
                            src={plant.qr}
                            alt="QR Code"
                            className="w-28 h-28 mb-4"
                        />
                        {!saved ? (
                            <button
                                onClick={savePlant}
                                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                            >
                                Save to Dashboard
                            </button>
                        ) : (
                            <p className="text-green-600 font-semibold">✅ Saved to Dashboard</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Search;