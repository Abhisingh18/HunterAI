import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, activeTab, setActiveTab }) => {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <main className="pl-64 min-h-screen">
                {/* Top Bar Place holder if needed, or integrated into pages */}
                <div className="p-8 max-w-7xl mx-auto animate-in fade-in zoom-in duration-300">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
