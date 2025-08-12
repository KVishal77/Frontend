import React, { useRef, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

// Env-based API
const API_BASE = process.env.REACT_APP_API_URL || "https://api.plantshazam.com/";

const Search = () => {
    const [query, setQuery] = useState("");
    const [plantData, setPlantData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [qrGenerated, setQrGenerated] = useState(false);
    const [qrCodeValue, setQrCodeValue] = useState("");
    const qrRef = useRef(null);
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setPlantData(null);
        setQrGenerated(false);
        try {
            const response = await axios.post(`${API_BASE}/suggest`, {
                plantName: query,
            });
            const data = response.data.suggestions;

            if (!data.image || !data.image.includes("wikimedia")) {
                data.image =
                    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Plant_icon.svg/512px-Plant_icon.svg.png";
            }

            setPlantData({ ...data, name: query });
        } catch (error) {
            alert("Error fetching plant data.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateQR = async () => {
        if (!plantData) return;
        const id = uuidv4();
        const user = auth.currentUser;
        const plant = {
            id,
            ...plantData,
            timestamp: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", user.uid, "plants", id), plant);
        setQrCodeValue(JSON.stringify(plant));
        setQrGenerated(true);
    };

    const handleDownloadQR = () => {
        const svg = qrRef.current.querySelector("svg");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const img = new Image();
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);

            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "plant-qr.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };

        img.src = url;
    };

    return (
        <div className="p-4 max-w-3xl mx-auto mt-4 overflow-y-auto pb-24">
            <button onClick={() => navigate("/")} className="text-green-700 text-sm mb-2">
                {"<"} Back to all plants
            </button>
            <h1 className="text-2xl font-bold text-center mb-4 text-green-800">Search Plant</h1>

            <div className="bg-white rounded-2xl shadow-md p-6">
                <input
                    type="text"
                    placeholder="Enter plant name here"
                    className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <button
                    onClick={handleSearch}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mb-4"
                >
                    {loading ? "Searching..." : "Search with AI"}
                </button>

                {plantData && (
                    <div className="mt-6 space-y-6">
                        <div className="flex justify-center">
                            <img
                                src={plantData.image}
                                alt="Plant"
                                className="rounded-xl w-full max-w-md h-64 object-cover"
                            />
                        </div>

                        <div className="text-left">
                            <h2 className="text-xl text-green-700 font-bold">{plantData.name}</h2>
                            <p className="italic">{plantData.scientific_name}</p>
                        </div>

                        <div className="flex justify-between">
                            <div className="w-1/2 pr-2">
                                <p className="font-semibold">💧 Watering</p>
                                <p>{plantData.watering}</p>
                            </div>
                            <div className="w-1/2 pl-2">
                                <p className="font-semibold">☀️ Sunlight</p>
                                <p>{plantData.sunlight}</p>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div className="w-1/2 pr-2">
                                <p className="font-semibold">🌱 Soil</p>
                                <p>{plantData.soil}</p>
                            </div>
                            <div className="w-1/2 pl-2">
                                <p className="font-semibold">📅 Seasonality</p>
                                <p>{plantData.seasonality}</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold">📓 Uses & Notes</p>
                            <p>{plantData.uses_notes}</p>
                        </div>

                        <div className="text-center mt-4" ref={qrRef}>
                            <p className="font-semibold mb-2">QR Code</p>
                            {qrGenerated ? (
                                <>
                                    <div className="flex justify-center mb-2">
                                        <QRCodeSVG value={qrCodeValue} />
                                    </div>
                                    <button onClick={handleDownloadQR} className="text-blue-600 underline">
                                        ⬇️ Download QR Code
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleGenerateQR}
                                    className="mt-2 w-full max-w-sm mx-auto bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                                >
                                    Generate QR Code
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;