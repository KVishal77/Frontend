import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { auth } from "../firebase";

function SavedPlantDetail() {
    const { id } = useParams();
    const [plant, setPlant] = useState(null);

    useEffect(() => {
        const fetchPlant = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const res = await axios.get(`https://api.plantshazam.com/plants/${user.uid}`);
                const match = res.data.find(p => p.id === id);
                setPlant(match);
            } catch (err) {
                console.error("❌ Error fetching plant:", err);
            }
        };

        fetchPlant();
    }, [id]);

    if (!plant) {
        return <p className="text-center mt-10 text-gray-600">Loading plant data...</p>;
    }

    return (
        <div className="min-h-screen bg-green-50 px-4 py-6">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 shadow-md">
                <img
                    src={plant.image || "https://via.placeholder.com/600x300?text=No+Image"}
                    alt={plant.name}
                    className="w-full h-64 object-cover rounded"
                />
                <div className="mt-6 space-y-2">
                    <h1 className="text-3xl font-bold text-green-800">{plant.name}</h1>
                    <p className="italic text-gray-600">{plant.scientific_name}</p>

                    <div className="mt-4 space-y-2 text-gray-700">
                        <p><strong>Sunlight:</strong> {plant.sunlight}</p>
                        <p><strong>Watering:</strong> {plant.watering}</p>
                        <p><strong>Soil:</strong> {plant.soil}</p>
                        <p><strong>Seasonality:</strong> {plant.seasonality}</p>
                        <p><strong>Uses / Notes:</strong> {plant.uses_notes}</p>
                    </div>

                    {plant.qr && (
                        <div className="mt-6 text-center">
                            <p className="font-medium text-green-700 mb-2">Scan QR to access this plant:</p>
                            <img src={plant.qr} alt="QR Code" className="mx-auto w-32 h-32" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SavedPlantDetail;