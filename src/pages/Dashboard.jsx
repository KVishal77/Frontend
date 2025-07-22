import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';

export default function Dashboard() {
    const [plants, setPlants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            const user = auth.currentUser;
            if (!user) return;
            try {
                const res = await axios.get(`http://localhost:5000/plants/${user.uid}`);
                setPlants(res.data);
            } catch { }
        };
        fetch();
    }, []);

    const del = async (id) => {
        const user = auth.currentUser;
        if (!user) return;
        if (!window.confirm('Delete this plant?')) return;
        await axios.delete(`http://localhost:5000/plants/${user.uid}/${id}`);
        setPlants((p) => p.filter(x => x.id !== id));
    };

    return (
        <div className="min-h-screen bg-green-50 p-4 pt-0">
            <div className="flex justify-between items-center mt-4 mb-6 px-2">
                <h1 className="text-2xl font-bold text-green-800">My Plants</h1>
                <button
                    onClick={() => navigate('/new')}
                    className="btn btn-green"
                >
                    + Add Plant
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {plants.map(p => (
                    <div key={p.id} className="bg-white rounded-xl shadow overflow-hidden relative">
                        <img
                            src={p.image || '/placeholder.png'}
                            alt={p.commonName}
                            className="w-full h-40 object-cover cursor-pointer"
                            onClick={() => navigate(`/plant/${p.id}`)}
                        />
                        <div className="p-4 cursor-pointer" onClick={() => navigate(`/plant/${p.id}`)}>
                            <h2 className="font-bold">{p.commonName}</h2>
                            <p className="italic text-gray-600 text-sm">{p.botanicalName}</p>
                        </div>
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <button onClick={() => navigate(`/new?edit=${p.id}`)} className="p-2 bg-yellow-100 rounded-full">
                                <FaPencilAlt className="text-yellow-700" />
                            </button>
                            <button onClick={() => del(p.id)} className="p-2 bg-red-100 rounded-full">
                                <FaTrash className="text-red-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}