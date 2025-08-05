// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Trash2, Edit } from 'lucide-react';

const Dashboard = () => {
    const [plants, setPlants] = useState([]);
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const fetchPlants = async () => {
        if (!user) return;

        const snapshot = await getDocs(collection(db, `users/${user.uid}/plants`));
        const plantList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setPlants(plantList);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this plant?')) {
            await deleteDoc(doc(db, `users/${user.uid}/plants/${id}`));
            fetchPlants();
        }
    };

    const handleEdit = (plant) => {
        navigate(`/edit/${plant.id}`, { state: plant });
    };

    const handleAdd = () => {
        navigate('/search'); // or '/add' if you want to use AddPlant
    };

    useEffect(() => {
        fetchPlants();
    }, [user]);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Plants</h2>
                <button
                    onClick={handleAdd}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    + Add Plant
                </button>
            </div>

            {plants.length === 0 ? (
                <p>No plants yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {plants.map(plant => (
                        <div
                            key={plant.id}
                            className="bg-white rounded shadow p-3 relative"
                            onClick={() => navigate(`/plant/${plant.id}`, { state: plant })}
                        >
                            <img
                                src={plant.imageUrl || '/placeholder.png'}
                                alt={plant.commonName}
                                className="w-full h-40 object-cover rounded"
                            />
                            <h3 className="text-lg font-bold mt-2">{plant.commonName}</h3>
                            <p className="italic">{plant.botanicalName}</p>
                            <p className="text-sm mt-1">{plant.notes?.slice(0, 60)}...</p>

                            <div className="absolute bottom-2 right-2 flex gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(plant);
                                    }}
                                    className="text-blue-600"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(plant.id);
                                    }}
                                    className="text-red-600"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;