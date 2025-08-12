import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function PlantDetail() {
    const { id } = useParams();
    const [p, setP] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            setNotFound(false);
            setP(null);

            // Try top-level /plants
            let snap = await getDoc(doc(db, "plants", id));
            if (!snap.exists()) {
                // fallback to user’s saved plants
                const user = auth.currentUser;
                if (user) {
                    snap = await getDoc(doc(db, "users", user.uid, "plants", id));
                }
            }
            if (snap.exists()) setP(snap.data());
            else setNotFound(true);
        };
        load();
    }, [id]);

    if (notFound) return <div className="text-center py-10">Not found.</div>;
    if (!p) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-green-50 p-4">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow overflow-hidden">
                <img src={p.image || "/placeholder.png"} alt={p.commonName || p.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <h1 className="text-2xl font-bold">{p.commonName || p.name}</h1>
                    <p className="italic text-gray-600">{p.botanicalName || p.scientific_name}</p>
                    <ul className="mt-4 space-y-1">
                        <li><strong>Watering:</strong> {p.watering}</li>
                        <li><strong>Sunlight:</strong> {p.sunlight}</li>
                        <li><strong>Soil:</strong> {p.soil}</li>
                        <li><strong>Seasonality:</strong> {p.seasonality}</li>
                        <li><strong>Notes:</strong> {p.notes || p.uses_notes}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}