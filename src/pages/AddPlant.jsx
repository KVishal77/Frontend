import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { LuCalendarDays } from "react-icons/lu";
import placeholder from "../assets/placeholder.png";
import { API_BASE } from "../api/plantAPI";

const BASE = API_BASE;

const AddPlant = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        commonName: "",
        botanicalName: "",
        plantType: "",
        watering: "",
        sunlight: "",
        soil: "",
        fertilizer: "",
        seasonality: "",
        seasonalMonths: [],
        notes: "",
        image: "",
    });

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(placeholder);
    const [loadingAI, setLoadingAI] = useState(false);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleMonthToggle = (month) => {
        const updated = formData.seasonalMonths.includes(month)
            ? formData.seasonalMonths.filter((m) => m !== month)
            : [...formData.seasonalMonths, month];
        setFormData({ ...formData, seasonalMonths: updated });
    };

    const handleImageChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setImagePreview(URL.createObjectURL(selected));
        }
    };

    const handleAISuggestions = async () => {
        if (!formData.commonName) return alert("Please enter a common name first");
        setLoadingAI(true);
        try {
            const res = await axios.post(`${BASE}/suggest`, { plantName: formData.commonName });
            const data = res.data.suggestions;
            setFormData((prev) => ({
                ...prev,
                botanicalName: data.scientific_name || "",
                watering: data.watering || "",
                sunlight: data.sunlight || "",
                soil: data.soil || "",
                seasonality: data.seasonality || "",
                notes: data.uses_notes || "",
                image: data.image || "",
            }));
            setImagePreview(data.image || placeholder);
        } catch {
            alert("Failed to get AI suggestion");
        }
        setLoadingAI(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageURL = formData.image;

            if (file) {
                const imgRef = ref(storage, `plants/${uuidv4()}-${file.name}`);
                await uploadBytes(imgRef, file);
                imageURL = await getDownloadURL(imgRef);
            }

            const newPlant = { ...formData, image: imageURL };
            await addDoc(collection(db, "plants"), newPlant);
            navigate("/");
        } catch {
            alert("Failed to save plant");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Add New Plant</h2>
            <div className="bg-white p-6 rounded-xl shadow">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="text-center">
                        <img src={imagePreview} alt="Plant" className="w-28 h-28 object-contain rounded mx-auto" />
                        <p className="text-sm mt-2 text-gray-600">Plant Image</p>
                    </div>
                    <div className="flex flex-col justify-center">
                        <label className="cursor-pointer border-2 border-dashed border-gray-400 px-6 py-4 text-center text-gray-600 hover:bg-gray-50 rounded-md">
                            <span className="block text-sm">Upload Photo</span>
                            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Common Name*</label>
                        <input
                            name="commonName"
                            value={formData.commonName}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="e.g. Tulsi"
                        />
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={handleAISuggestions}
                            className="text-blue-600 border border-blue-400 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded w-full"
                        >
                            {loadingAI ? "🔄 Generating..." : "🔍 Generate AI Suggestions"}
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Botanical Name*</label>
                        <input
                            name="botanicalName"
                            value={formData.botanicalName}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="e.g. Ocimum sanctum"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Plant Type</label>
                        <select
                            name="plantType"
                            value={formData.plantType}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="">Select plant type</option>
                            {["Tree", "Shrub", "Herb", "Vine", "Grass", "Succulent", "Aquatic", "Other"].map((t) => (
                                <option key={t}>{t}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Watering</label>
                            <input
                                name="watering"
                                value={formData.watering}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                placeholder="e.g. Weekly"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Sunlight</label>
                            <select
                                name="sunlight"
                                value={formData.sunlight}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">Select</option>
                                <option>Full Sun</option>
                                <option>Partial Sun</option>
                                <option>Shade</option>
                                <option>Indirect Light</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Soil</label>
                        <input
                            name="soil"
                            value={formData.soil}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="e.g. Sandy, Well-drained"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Fertilizer</label>
                        <input
                            name="fertilizer"
                            value={formData.fertilizer}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="e.g. Monthly"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Seasonality</label>
                        <input
                            name="seasonality"
                            value={formData.seasonality}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="e.g. Perennial"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Seasonal Months</label>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                            {months.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleMonthToggle(m)}
                                    className={`border rounded px-2 py-1 flex items-center justify-center gap-1 ${formData.seasonalMonths.includes(m) ? "bg-green-100 border-green-500" : "bg-white"
                                        }`}
                                >
                                    <LuCalendarDays className="text-gray-600" />
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Uses & Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            placeholder="e.g. Medicinal, spiritual use"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-full w-full"
                    >
                        Add Plant
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPlant;