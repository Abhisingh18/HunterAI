import React, { useState } from 'react';
import { UploadCloud, FileText, Settings, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const UploadView = ({ onUploadComplete }) => {
    const [resume, setResume] = useState(null);
    const [excel, setExcel] = useState(null);
    const [smtpEmail, setSmtpEmail] = useState("");
    const [smtpPassword, setSmtpPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!resume || !excel) {
            alert("Please provide both Resume and Excel files.");
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("company_excel", excel);

        try {
            const res = await axios.post(`${API_BASE_URL}/upload`, formData);
            // Pass minimal data needed for generator + generic SMTP creds storage (in state)
            onUploadComplete({
                ...res.data,
                smtpEmail,
                smtpPassword
            });
        } catch (err) {
            console.error(err);
            alert("Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Configure Campaign</h2>
                <p className="text-slate-500">Upload your data sources to initialize the AI agent.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Card 1: Company List */}
                <div className="glass-panel p-6 hover:bg-white transition-colors group bg-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Company Data</h3>
                    </div>

                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${excel ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-400'}`}>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => setExcel(e.target.files[0])}
                            className="hidden"
                            id="excel-upload"
                        />
                        <label htmlFor="excel-upload" className="cursor-pointer block h-full">
                            {excel ? (
                                <div className="text-emerald-400 flex flex-col items-center">
                                    <CheckCircle2 className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-medium truncate max-w-full">{excel.name}</span>
                                </div>
                            ) : (
                                <span className="text-sm text-slate-500">
                                    Drag & drop Excel<br /><span className="text-xs opacity-70">or click to browse</span>
                                </span>
                            )}
                        </label>
                    </div>
                </div>

                {/* Card 2: Resume */}
                <div className="glass-panel p-6 hover:bg-white transition-colors group bg-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Your Resume</h3>
                    </div>

                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${resume ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-400'}`}>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setResume(e.target.files[0])}
                            className="hidden"
                            id="resume-upload"
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer block h-full">
                            {resume ? (
                                <div className="text-blue-400 flex flex-col items-center">
                                    <CheckCircle2 className="w-8 h-8 mb-2" />
                                    <span className="text-sm font-medium truncate max-w-full">{resume.name}</span>
                                </div>
                            ) : (
                                <span className="text-sm text-slate-500">
                                    Drag & drop PDF<br /><span className="text-xs opacity-70">or click to browse</span>
                                </span>
                            )}
                        </label>
                    </div>
                </div>

                {/* Card 3: Email Config */}
                <div className="glass-panel p-6 hover:bg-white transition-colors group bg-white">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors">
                            <Settings className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-slate-900">Sender Config</h3>
                    </div>

                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Gmail Address"
                            value={smtpEmail}
                            onChange={(e) => setSmtpEmail(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                        <input
                            type="password"
                            placeholder="App Password"
                            value={smtpPassword}
                            onChange={(e) => setSmtpPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                        />
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                            <span className="text-xs text-slate-500">SMTP Disconnected</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="group relative inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Analyze & Generate'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};

export default UploadView;
