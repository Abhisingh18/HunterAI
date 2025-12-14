import React, { useState } from 'react';
import Layout from './components/Layout';
import DashboardView from './views/DashboardView';
import UploadView from './views/UploadView';
import GeneratorView from './views/GeneratorView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [uploadData, setUploadData] = useState(null);

  const handleUploadComplete = (data) => {
    setUploadData(data);
    setActiveTab('generator');
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView setView={setActiveTab} />;
      case 'upload':
        return <UploadView onUploadComplete={handleUploadComplete} />;
      case 'generator':
        return <GeneratorView uploadData={uploadData} />;
      case 'campaigns':
        return <div className="text-slate-500 text-center py-20">Campaign Management Module Coming Soon</div>;
      case 'analytics':
        return <div className="text-slate-500 text-center py-20">Advanced Analytics Module Coming Soon</div>;
      case 'settings':
        return <div className="text-slate-500 text-center py-20">Settings Module Coming Soon</div>;
      default:
        return <DashboardView setView={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderView()}
    </Layout>
  );
}

export default App;
