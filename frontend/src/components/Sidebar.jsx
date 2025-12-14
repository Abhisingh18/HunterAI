import React from 'react';
import {
    LayoutDashboard,
    UploadCloud,
    Sparkles,
    Send,
    BarChart2,
    Settings,
    LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'upload', label: 'Upload Data', icon: UploadCloud },
        { id: 'generator', label: 'AI Generator', icon: Sparkles },
        { id: 'campaigns', label: 'Campaigns', icon: Send },
        { id: 'analytics', label: 'Analytics', icon: BarChart2 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50">
            {/* Brand */}
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">HunterAI</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 mt-6">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <motion.div
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`nav-item group ${isActive ? 'active' : ''}`}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Icon className={`sidebar-icon ${isActive ? 'text-indigo-400' : ''}`} />
                            <span>{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-slate-200">
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600">
                        AS
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">Abhishek Singh</p>
                        <p className="text-xs text-slate-500">Pro Plan</p>
                    </div>
                    <LogOut className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
