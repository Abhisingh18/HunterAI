import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onUploadSuccess }) => {
    const [resume, setResume] = useState(null);
    const [excel, setExcel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!resume || !excel) {
            alert("Please select both Resume and Excel file.");
            return;
        }

        setStatus("🚀 Initiating Launch Sequence...");
        setLoading(true);

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("company_excel", excel);

        try {
            const response = await axios.post("http://localhost:8000/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            setStatus("✨ Files Secure. Engaging AI Core...");
            setTimeout(() => {
                onUploadSuccess(response.data);
            }, 1500);
        } catch (error) {
            console.error(error);
            setStatus("❌ System Failure during upload.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel p-10 max-w-lg mx-auto transform transition-all hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] relative overflow-hidden group">
            {/* Glossy shine effect */}
            <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out]"></div>

            <h2 className="text-2xl font-bold mb-6 text-center text-white">Initialize Outreach</h2>

            <form onSubmit={handleUpload} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-cyan-300 mb-2 uppercase tracking-wide">Resume (PDF)</label>
                    <div className={`relative border-2 border-dashed border-white/20 rounded-xl p-6 transition-all ${resume ? 'bg-cyan-500/10 border-cyan-500/50' : 'hover:bg-white/5 hover:border-cyan-400/50'}`}>
                        <input
                            type="file" accept=".pdf"
                            onChange={(e) => setResume(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center pointer-events-none">
                            <span className="text-2xl mb-2 block">{resume ? '📄' : '📤'}</span>
                            <p className="text-sm font-medium text-gray-300">{resume ? resume.name : "Drop PDF or Click to Browse"}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-purple-300 mb-2 uppercase tracking-wide">Company List (Excel)</label>
                    <div className={`relative border-2 border-dashed border-white/20 rounded-xl p-6 transition-all ${excel ? 'bg-purple-500/10 border-purple-500/50' : 'hover:bg-white/5 hover:border-purple-400/50'}`}>
                        <input
                            type="file" accept=".xlsx, .xls"
                            onChange={(e) => setExcel(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center pointer-events-none">
                            <span className="text-2xl mb-2 block">{excel ? '📊' : '📥'}</span>
                            <p className="text-sm font-medium text-gray-300">{excel ? excel.name : "Drop Excel or Click to Browse"}</p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full glass-btn mt-4 group"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : (
                        "🚀 Start Processing"
                    )}
                </button>
            </form>
            {status && <div className="mt-4 p-3 rounded-lg bg-black/30 text-center text-sm font-mono text-cyan-200 border border-cyan-500/20">{status}</div>}
        </div>
    );
};

export default UploadForm;
