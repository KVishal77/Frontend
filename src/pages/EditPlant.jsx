import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import axios from "axios";

const EditPlant = () => {
    const { id } = useParams();
    const [plant, setPlant] = useState(null);
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    const fetchPlant = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const response = await axios.get(`http://localhost:5000/plants/${user.uid}`);
            const match = response.data.find(p => p.id === id);
            if (match) {
                setPlant(match);
                setForm({
                    name: match.name || "",
                    scientific_name: match.scientific_name || "",
                    sunlight: match.sunlight || "",
                    watering: match.watering || "",
                    soil: match.soil || "",
                    seasonality: match.seasonality || "",
                    uses_notes: match.uses_notes || "",
                    image: match.image || "",
                });
            }
        } catch (err) {
            console.error("Error fetching plant:", err);
        }
    };

    useEffect(() => {
        fetchPlant();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            await axios.put(`http://localhost:5000/plants/${user.uid}/${id}`, form);
            alert("✅ Plant updated successfully!");
            navigate("/dashboard");
        } catch (err) {
            console.error("Update failed:", err);
            alert("❌ Failed to update plant");
        }
    };

    if (!plant) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-2xl mx-auto p-4 mt-6 bg-white shadow-md rounded-xl">
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Edit Plant</h2>

            {["name", "scientific_name", "sunlight", "watering", "soil", "seasonality", "uses_notes"].map((field) => (
                <label className="block mb-3" key={field}>
                    <span className="text-gray-700 capitalize">{field.replace("_", " ")}</span>
                    <input
                        type="text"
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border border-gray-300 p-2"
                    />
                </label>
            ))}

            <button
                onClick={handleUpdate}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Save Changes
            </button>
        </div>
    );
};

export default EditPlant;