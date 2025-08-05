import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";
import Layout from "../components/Layout";
import BottomNav from "../components/BottomNav";
import { QRCodeCanvas } from "qrcode.react";

const SinglePlant = () => {
    const { id } = useParams();
    const db = getFirestore(getApp());
    const [plant, setPlant] = useState(null);

    useEffect(() => {
        const fetchPlant = async () => {
            try {
                const docRef = doc(db, "plants", id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setPlant(docSnap.data());
                } else {
                    console.log("No such plant!");
                }
            } catch (error) {
                console.error("Error fetching plant:", error);
            }
        };

        fetchPlant();
    }, [id, db]);

    if (!plant) return <div className="text-center mt-20 text-gray-600">Loading plant details...</div>;

    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col">
            <Layout />
            <div className="flex-1 p-4">
                <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h1 className="text-2xl font-bold mb-1">{plant.name}</h1>
                <h2 className="text-md text-green-700 italic mb-4">{plant.scientificName}</h2>
                <p className="mb-4">{plant.description}</p>

                {plant.sunlight && (
                    <p className="mb-2">
                        <strong>Sunlight:</strong> {plant.sunlight}
                    </p>
                )}
                {plant.watering && (
                    <p className="mb-2">
                        <strong>Watering:</strong> {plant.watering}
                    </p>
                )}
                {plant.soil && (
                    <p className="mb-2">
                        <strong>Soil Type:</strong> {plant.soil}
                    </p>
                )}
                {plant.temperature && (
                    <p className="mb-4">
                        <strong>Ideal Temperature:</strong> {plant.temperature}
                    </p>
                )}

                <div className="mt-6">
                    <p className="mb-2 font-semibold">QR Code:</p>
                    <QRCodeCanvas value={plant.qrData || window.location.href} size={128} />
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default SinglePlant;