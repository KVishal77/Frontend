import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../firebase";
import axios from "axios";

function PlantPage() {
    const { id } = useParams();
    const [plant, setPlant] = useState(null);

    useEffect(() => {
        const fetchPlant = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const res = await axios.get(`https://api.plantshazam.com/plants/${user.uid}`);
                const found = res.data.find((p) => p.id === id);
                setPlant(found);
            } catch (err) {
                console.error("Error loading plant:", err);
            }
        };

        fetchPlant();
    }, [id]);

    if (!plant) return <p className="text-center mt-10 text-gray-500">Loading plant info...</p>;

    return (
        <div className="min-h-screen bg-green-50 p-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-24">
                <img
                    src={plant.image || "https://via.placeholder.com/600x300?text=No+Image"}
                    alt={plant.name}
                    className="w-full h-64 object-cover"
                />
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-green-700 mb-2">{plant.name}</h1>
                    <p className="italic text-gray-600 mb-4">{plant.scientific_name}</p>

                    <div className="space-y-2 text-gray-700 text-base leading-relaxed">
                        <p><strong>Sunlight:</strong> {plant.sunlight}</p>
                        <p><strong>Watering:</strong> {plant.watering}</p>
                        <p><strong>Soil:</strong> {plant.soil}</p>
                        <p><strong>Seasonality:</strong> {plant.seasonality}</p>
                        <p><strong>Uses / Notes:</strong> {plant.uses_notes}</p>
                    </div>

                    {plant.qr && (
                        <div className="mt-6 text-center">
                            <p className="text-green-600 font-medium mb-2">QR Code for this plant</p>
                            <img src={plant.qr} alt="QR Code" className="w-32 h-32 mx-auto" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PlantPage;