import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function PlantDetail() {
    const { id } = useParams();
    const [p, setP] = useState(null);

    useEffect(() => {
        const load = async () => {
            // load all user plants then find by id
            // or if you have /getbyid endpoint, use it
            // here we assume /getbyname for demo
            try {
                const res = await axios.get(`https://api.plantshazam.com/plant/${id}`);
                setP(res.data);
            } catch { }
        };
        load();
    }, [id]);

    if (!p) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-green-50 p-4">
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow overflow-hidden">
                <img src={p.image || '/placeholder.png'} alt={p.commonName} className="w-full h-48 object-cover" />
                <div className="p-4">
                    <h1 className="text-2xl font-bold">{p.commonName}</h1>
                    <p className="italic text-gray-600">{p.botanicalName}</p>
                    <ul className="mt-4 space-y-1">
                        <li><strong>Watering:</strong> {p.watering}</li>
                        <li><strong>Sunlight:</strong> {p.sunlight}</li>
                        <li><strong>Soil:</strong> {p.soil}</li>
                        <li><strong>Seasonality:</strong> {p.seasonality}</li>
                        <li><strong>Notes:</strong> {p.notes}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}