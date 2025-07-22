import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import {
    getStorage,
    ref as sRef,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage';
import {
    getFirestore,
    collection,
    addDoc,
} from 'firebase/firestore';
import { FaCalendarAlt, FaCamera } from 'react-icons/fa';

export default function AddPlant() {
    const navigate = useNavigate();
    const auth = getAuth();
    const storage = getStorage();
    const db = getFirestore();

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('/placeholder.png');
    const [loadingAI, setLoadingAI] = useState(false);
    const [form, setForm] = useState({
        commonName: '',
        botanicalName: '',
        plantType: '',
        watering: '',
        sunlight: '',
        soil: '',
        fertilizer: '',
        seasonality: '',
        seasonalMonths: [],
        notes: '',
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Handle field changes
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
    };

    // Handle image upload & preview
    const handleImageChange = e => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    // Toggle month selection
    const toggleMonth = m => {
        setForm(f => ({
            ...f,
            seasonalMonths: f.seasonalMonths.includes(m)
                ? f.seasonalMonths.filter(x => x !== m)
                : [...f.seasonalMonths, m],
        }));
    };

    // Call AI to fill fields
    const handleAISuggest = async () => {
        if (!form.commonName.trim()) {
            alert('Enter Common Name first');
            return;
        }
        setLoadingAI(true);
        try {
            const res = await axios.post('http://localhost:5000/suggest', {
                plantName: form.commonName,
            });
            const s = res.data.suggestions;
            setForm(f => ({
                ...f,
                botanicalName: s.scientific_name || '',
                plantType: s.plant_type || '',
                watering: s.watering || '',
                sunlight: s.sunlight || '',
                soil: s.soil || '',
                fertilizer: s.fertilizer || '',
                seasonality: s.seasonality || '',
                notes: s.uses_notes || '',
            }));
            setPreview(s.image || '/placeholder.png');
        } catch (err) {
            console.error(err);
            alert('AI suggestion failed');
        }
        setLoadingAI(false);
    };

    // Save to Firestore + Storage
    const handleSubmit = async e => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) {
            alert('Please log in first');
            return;
        }

        let imageURL = preview;
        if (imageFile) {
            const path = `plants/${user.uid}/${Date.now()}_${imageFile.name}`;
            const r = sRef(storage, path);
            await uploadBytes(r, imageFile);
            imageURL = await getDownloadURL(r);
        }

        const data = {
            ...form,
            image: imageURL,
            userId: user.uid,
            savedAt: new Date().toISOString(),
        };

        try {
            await addDoc(collection(db, 'users', user.uid, 'plants'), data);
            alert('Plant added successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert('Failed to save plant');
        }
    };

    return (
        <div className="min-h-screen bg-green-50 py-6 px-4">
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
                    Add New Plant
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Image + Upload Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-24 h-24 object-cover rounded-lg border"
                        />
                        <label className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700">
                            <FaCamera />
                            Upload Photo
                            <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Common Name + AI Suggest */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            name="commonName"
                            value={form.commonName}
                            onChange={handleChange}
                            placeholder="Common Name *"
                            required
                            className="flex-1 border rounded px-3 py-2"
                        />
                        <button
                            type="button"
                            onClick={handleAISuggest}
                            disabled={loadingAI}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {loadingAI ? 'Loading...' : 'Generate AI Suggestions'}
                        </button>
                    </div>

                    {/* Rest of the fields */}
                    <input
                        type="text"
                        name="botanicalName"
                        value={form.botanicalName}
                        onChange={handleChange}
                        placeholder="Botanical Name"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        name="plantType"
                        value={form.plantType}
                        onChange={handleChange}
                        placeholder="Plant Type"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        name="watering"
                        value={form.watering}
                        onChange={handleChange}
                        placeholder="Watering"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        name="sunlight"
                        value={form.sunlight}
                        onChange={handleChange}
                        placeholder="Sunlight"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        name="soil"
                        value={form.soil}
                        onChange={handleChange}
                        placeholder="Soil"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        name="fertilizer"
                        value={form.fertilizer}
                        onChange={handleChange}
                        placeholder="Fertilizer"
                        className="w-full border rounded px-3 py-2"
                    />
                    <input
                        type="text"
                        name="seasonality"
                        value={form.seasonality}
                        onChange={handleChange}
                        placeholder="Seasonality"
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* Seasonal Months */}
                    <div>
                        <label className="block mb-2 font-semibold">Seasonal Months</label>
                        <div className="grid grid-cols-6 gap-2">
                            {months.map(m => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => toggleMonth(m)}
                                    className={`flex items-center gap-1 px-2 py-1 text-sm rounded border ${form.seasonalMonths.includes(m)
                                            ? 'bg-green-100 border-green-400'
                                            : 'border-gray-300'
                                        }`}
                                >
                                    <FaCalendarAlt className="text-gray-600" />
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Uses / Notes"
                        rows="3"
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-green-700 text-white py-3 rounded font-semibold hover:bg-green-800"
                    >
                        Add Plant
                    </button>
                </form>
            </div>
        </div>
    );
}