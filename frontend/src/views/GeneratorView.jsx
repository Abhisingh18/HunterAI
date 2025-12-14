import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X, Send, Edit, Copy } from 'lucide-react';
import axios from 'axios';

const GeneratorView = ({ uploadData }) => {
    const [generatedEmails, setGeneratedEmails] = useState([]);
    const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (uploadData && generatedEmails.length === 0) {
            generateEmails();
        }
    }, [uploadData]);

    const generateEmails = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8000/generate-emails", {
                resume_filename: uploadData.resume_filename,
                excel_filename: uploadData.excel_filename
            });
            setGeneratedEmails(res.data.emails);
        } catch (e) {
            console.error(e);
            alert("Error generating emails");
        } finally {
            setLoading(false);
        }
    };

    const handleSendCurrent = async () => {
        // Logic to send single email or push to queue
        if (!uploadData.smtpEmail || !uploadData.smtpPassword) {
            alert("Missing SMTP Credentials. Go back to Upload.");
            return;
        }

        const current = generatedEmails[selectedEmailIndex];
        setSending(true);
        try {
            const payload = {
                emails: [{
                    to: current.hr_email,
                    subject: current.email.split('\n')[0].replace("Subject: ", ""), // Simple extraction
                    body: current.email
                }],
                smtp_email: uploadData.smtpEmail,
                smtp_password: uploadData.smtpPassword,
                resume_filename: uploadData.resume_filename // Pass filename for attachment
            };
            await axios.post("http://localhost:8000/send-bulk-emails", payload);
            alert(`Email sent to ${current.company}`);
        } catch (e) {
            console.error(e);
            alert("Sending failed.");
        } finally {
            setSending(false);
        }
    };

    if (!uploadData) return (
        <div className="flex items-center justify-center h-full text-slate-500">
            No data loaded. Please start from Upload page.
        </div>
    );

    return (
        <div className="h-[calc(100vh-100px)] flex gap-6">
            {/* Left: List */}
            <div className="w-1/3 glass-panel overflow-hidden flex flex-col bg-white">
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900">Candidates ({generatedEmails.length})</h3>
                    <button
                        onClick={generateEmails}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Regenerate All"
                    >
                        <RefreshCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-2 space-y-2">
                    {loading ? (
                        <div className="text-center p-8 text-slate-500">AI is brainstorming...</div>
                    ) : generatedEmails.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedEmailIndex(idx)}
                            className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedEmailIndex === idx ? 'bg-indigo-50 border-indigo-200' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <h4 className={`font-medium ${selectedEmailIndex === idx ? 'text-indigo-700' : 'text-slate-700'}`}>{item.company}</h4>
                                <span className="text-xs text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">95%</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{item.hr_email}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Preview */}
            <div className="flex-1 glass-panel flex flex-col overflow-hidden relative bg-white">
                {generatedEmails.length > 0 && (
                    <>
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">Subject</p>
                                <h2 className="text-lg font-medium text-slate-900 truncate max-w-lg">
                                    {generatedEmails[selectedEmailIndex].email.split('\n')[0].replace("Subject: ", "")}
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors">
                                    <Edit className="w-4 h-4" /> Edit
                                </button>
                                <button
                                    onClick={handleSendCurrent}
                                    disabled={sending}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    <Send className="w-4 h-4" /> {sending ? 'Sending...' : 'Send Now'}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto bg-slate-100/50">
                            <div className="max-w-3xl mx-auto bg-white text-slate-900 p-8 rounded-lg shadow-sm border border-slate-200 min-h-full font-serif loading-relaxed leading-7 whitespace-pre-wrap">
                                {generatedEmails[selectedEmailIndex].email}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default GeneratorView;
