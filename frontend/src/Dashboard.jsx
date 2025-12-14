import React, { useState } from 'react';
import UploadForm from './UploadForm';
import axios from 'axios';

const Dashboard = () => {
    const [step, setStep] = useState(1);
    const [uploadData, setUploadData] = useState(null);
    const [generatedEmails, setGeneratedEmails] = useState([]);
    const [smtpEmail, setSmtpEmail] = useState("");
    const [smtpPassword, setSmtpPassword] = useState("");
    const [sendingResults, setSendingResults] = useState([]);

    // Background Orbs for "Alive" feel
    const BackgroundOrbs = () => (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl float"></div>
            <div className="absolute top-[20%] right-[-5%] w-72 h-72 bg-cyan-600/30 rounded-full blur-3xl float-delayed"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-80 h-80 bg-blue-600/30 rounded-full blur-3xl float"></div>
        </div>
    );

    const handleUploadSuccess = (data) => {
        setUploadData(data);
        setStep(2);
        generateEmails(data);
    };

    const generateEmails = async (data) => {
        try {
            const response = await axios.post("http://localhost:8000/generate-emails", {
                resume_filename: data.resume_filename,
                excel_filename: data.excel_filename
            });
            setGeneratedEmails(response.data.emails);
            setStep(3);
        } catch (error) {
            console.error(error);
            alert("Error generating emails. Ensure Backend is active.");
            setStep(1);
        }
    };

    const handleSendEmails = async () => {
        if (!smtpEmail || !smtpPassword) {
            alert("Please enter SMTP Credentials");
            return;
        }

        try {
            const payload = {
                emails: generatedEmails.map(item => ({
                    to: item.hr_email,
                    subject: item.email.includes("Subject:") ? item.email.split('\n').find(l => l.includes("Subject:")).replace("Subject:", "").trim() : "Application Inquiry",
                    body: item.email
                })),
                smtp_email: smtpEmail,
                smtp_password: smtpPassword
            };

            const response = await axios.post("http://localhost:8000/send-bulk-emails", payload);
            setSendingResults(response.data.results);
            setStep(4);
        } catch (error) {
            console.error(error);
            alert("Error sending emails");
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6">
            <BackgroundOrbs />

            {/* Header */}
            <header className="mb-10 text-center z-10 fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="inline-block p-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-4">
                    <div className="bg-slate-900 rounded-full px-4 py-1">
                        <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
                            AI-POWERED RECRUITMENT AGENT
                        </span>
                    </div>
                </div>
                <h1 className="text-6xl font-extrabold text-white glow-text tracking-tight mb-2">
                    Hunter<span className="text-cyan-400">.ai</span>
                </h1>
                <p className="text-blue-200 text-lg max-w-lg mx-auto leading-relaxed">
                    Automate your job outreach with personalized, AI-crafted emails.
                </p>
            </header>

            <main className="w-full max-w-6xl z-10">
                {step === 1 && (
                    <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <UploadForm onUploadSuccess={handleUploadSuccess} />
                    </div>
                )}

                {step === 2 && (
                    <div className="max-w-xl mx-auto glass-panel p-12 text-center fade-in-up">
                        <div className="relative w-24 h-24 mx-auto mb-8">
                            <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 border-4 border-t-cyan-400 rounded-full animate-spin"></div>
                            <div className="absolute inset-4 bg-cyan-500/20 rounded-full backdrop-blur-sm"></div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">AI Brain at Work</h2>
                        <p className="text-blue-200 mb-8">Parsing resume, analyzing tech stack, and crafting perfect pitches...</p>

                        <div className="bg-black/20 rounded-full h-1.5 w-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-[shimmer_1.5s_infinite] w-2/3"></div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in-up">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white">Draft Reviews</h2>
                                <p className="text-blue-300">We've prepared {generatedEmails.length} personalized emails for you.</p>
                            </div>
                            <button className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
                                Regenerate All
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {generatedEmails.map((item, index) => (
                                <div key={index} className="glass-panel p-6 group hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg">
                                            <span className="text-2xl">🏢</span>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-white/10 text-cyan-300 border border-cyan-500/20">
                                            MATCH: 92%
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-xl text-white mb-1 group-hover:text-cyan-300 transition-colors">{item.company}</h3>
                                    <p className="text-sm text-gray-400 mb-4 font-mono truncate">{item.hr_email}</p>

                                    <div className="bg-black/40 p-3 rounded-lg border border-white/5 h-40 overflow-hidden relative group-hover:border-cyan-500/30 transition-colors">
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                                        <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{item.email}</p>
                                    </div>
                                    <button className="w-full mt-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold text-white border border-white/10 transition-colors">
                                        Edit / Preview
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="glass-panel p-8 max-w-2xl mx-auto border-t-4 border-t-cyan-500">
                            <h3 className="text-2xl font-bold text-white mb-6 text-center">Ready to Launch Campaign? 🚀</h3>

                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <input
                                    type="email"
                                    placeholder="Your Gmail Address"
                                    value={smtpEmail}
                                    onChange={(e) => setSmtpEmail(e.target.value)}
                                    className="glass-input w-full"
                                />
                                <input
                                    type="password"
                                    placeholder="Gmail App Password"
                                    value={smtpPassword}
                                    onChange={(e) => setSmtpPassword(e.target.value)}
                                    className="glass-input w-full"
                                />
                            </div>
                            <button
                                onClick={handleSendEmails}
                                className="w-full glass-btn text-lg"
                            >
                                Send {generatedEmails.length} Emails Now
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="max-w-4xl mx-auto glass-panel p-10 fade-in-up">
                        <div className="text-center mb-10">
                            <div className="inline-block p-4 rounded-full bg-green-500/20 mb-4">
                                <span className="text-4xl">🎉</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white mb-2">Campaign Completed!</h2>
                            <p className="text-gray-300">Here's how your outreach went.</p>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                            <table className="w-full text-left">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Recipient</th>
                                        <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {sendingResults.map((res, index) => (
                                        <tr key={index} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-white font-medium">{res.to}</td>
                                            <td className="p-4">
                                                {res.status === 'sent' ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                                        SENT
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                                                        FAILED
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-sm text-gray-500">{res.error || "Delivered"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-10 text-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10 hover:border-cyan-500/50"
                            >
                                Start New Campaign
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
