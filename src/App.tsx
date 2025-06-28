import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from 'react-hot-toast';
// import { ConfigProvider } from './contexts/ConfigContext';
// import { AgentProvider } from './contexts/AgentContext';
// import Layout from './components/Layout';
// import Dashboard from './pages/Dashboard';
// import Agents from './pages/Agents';
// import Analytics from './pages/Analytics';
// import Settings from './pages/Settings';
// import Setup from './pages/Setup';
import { isConfigured } from './lib/config';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in older versions)
    },
  },
});

// Temporary simple components
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gradient mb-6">DevOps Modules Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="devops-card">
        <h3 className="text-lg font-semibold mb-2">Total Agents</h3>
        <p className="text-3xl font-bold text-primary-600">12</p>
        <p className="text-sm text-gray-600 mt-1">9 active</p>
      </div>
      <div className="devops-card">
        <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
        <p className="text-3xl font-bold text-green-600">96.8%</p>
        <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
      </div>
      <div className="devops-card">
        <h3 className="text-lg font-semibold mb-2">Revenue Generated</h3>
        <p className="text-3xl font-bold text-blue-600">$125K</p>
        <p className="text-sm text-gray-600 mt-1">This month</p>
      </div>
      <div className="devops-card">
        <h3 className="text-lg font-semibold mb-2">Cost Saved</h3>
        <p className="text-3xl font-bold text-purple-600">$35K</p>
        <p className="text-sm text-gray-600 mt-1">Automation savings</p>
      </div>
    </div>
    <div className="mt-8">
      <div className="devops-card">
        <h2 className="text-xl font-semibold mb-4">Revenue Ripple Integration</h2>
        <div className="flex items-center space-x-3">
          <div className="agent-status-active">Connected</div>
          <span className="text-gray-600">API Key configured from Revenue Ripple admin panel</span>
        </div>
        <p className="text-gray-600 mt-2">
          This DevOps modules system is designed as an add-on to your Revenue Ripple admin panel.
          Configure API keys and webhooks through your main Revenue Ripple dashboard for seamless integration.
        </p>
      </div>
    </div>
  </div>
);

const Setup = ({ onConfigured }: { onConfigured: () => void }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup DevOps Modules</h1>
        <p className="text-gray-600">Configure integration with Revenue Ripple</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Revenue Ripple URL
          </label>
          <input
            type="url"
            placeholder="https://your-revenue-ripple.com"
            className="devops-input"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key
          </label>
          <input
            type="password"
            placeholder="Your Revenue Ripple API key"
            className="devops-input"
          />
          <p className="text-xs text-gray-500 mt-1">
            Get this from your Revenue Ripple admin panel
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Integration Mode
          </label>
          <select className="devops-input">
            <option value="embedded">Embedded in Admin Panel</option>
            <option value="standalone">Standalone Dashboard</option>
            <option value="iframe">iFrame Widget</option>
          </select>
        </div>
        
        <button
          onClick={onConfigured}
          className="w-full devops-button-primary mt-6"
        >
          Complete Setup
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        This will configure the DevOps modules to work with your Revenue Ripple installation
      </div>
    </div>
  </div>
);

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50">
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">DevOps Modules</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Revenue Ripple Add-on</span>
            <div className="agent-status-active">Connected</div>
          </div>
        </div>
      </div>
    </nav>
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {children}
    </main>
  </div>
);

function App() {
  const [configured, setConfigured] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if the app is configured for revenue-ripple integration
    const checkConfiguration = () => {
      const isSetup = isConfigured();
      setConfigured(isSetup);
      setLoading(false);
    };

    checkConfiguration();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading DevOps Modules...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          {!configured ? (
            <Setup onConfigured={() => setConfigured(true)} />
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </Layout>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
