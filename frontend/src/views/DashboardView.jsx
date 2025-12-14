import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import { Mail, MousePointer, Users, Activity, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
    { name: 'Mon', emails: 400, replies: 240 },
    { name: 'Tue', emails: 300, replies: 139 },
    { name: 'Wed', emails: 200, replies: 980 },
    { name: 'Thu', emails: 278, replies: 390 },
    { name: 'Fri', emails: 189, replies: 480 },
    { name: 'Sat', emails: 239, replies: 380 },
    { name: 'Sun', emails: 349, replies: 430 },
];

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 flex flex-col justify-between h-40 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${color} text-white shadow-md shadow-${color.replace('bg-', '')}/20`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{change}</span>
        </div>
        <div>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{title}</p>
        </div>
    </div>
);

const DashboardView = ({ setView }) => {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 p-10 shadow-lg">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
                            Automate your <span className="gradient-text">Outreach</span>
                        </h1>
                        <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                            HunterAI creates hyper-personalized emails using your resume and target company data to 10x your response rate.
                        </p>
                        <button
                            onClick={() => setView('upload')}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            <Plus className="w-5 h-5" />
                            Create New Campaign
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Emails Sent" value="12,450" change="+12%" icon={Mail} color="bg-indigo-500" />
                <StatCard title="Response Rate" value="24.8%" change="+4.2%" icon={MousePointer} color="bg-violet-500" />
                <StatCard title="Active Campaigns" value="3" change="Active" icon={Activity} color="bg-blue-500" />
                <StatCard title="Jobs Matched" value="85" change="+18" icon={Users} color="bg-emerald-500" />
            </div>

            {/* Analytics Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                <div className="lg:col-span-2 glass-panel p-6 bg-white">
                    <h3 className="text-lg font-semibold text-slate-900 mb-6">Campaign Performance</h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                                itemStyle={{ color: '#0f172a' }}
                            />
                            <Bar dataKey="emails" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="replies" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-panel p-6 bg-white">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-700">Campaign "Frontend Roles" sent</p>
                                    <p className="text-xs text-slate-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
