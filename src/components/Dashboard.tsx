import React from 'react';
import { DashboardProvider } from '../contexts/DashboardContext';
import { DashboardLayout } from './dashboard/DashboardLayout';
import { Header } from './dashboard/Header';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAgents } from '../hooks/useAgents';

// Import widget system
import '../widgets';

// Import grid layout CSS
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../styles/widgets.css';

export function Dashboard() {
  const { state: wsState } = useWebSocket();
  const { agents, isLoading: agentsLoading } = useAgents();

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header />
        
        {/* Connection Status */}
        {!wsState.isConnected && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Connecting to real-time updates...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          {/* System Status */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Connection</p>
                  <p className={`text-lg font-semibold ${
                    wsState.isConnected ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {wsState.isConnected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  wsState.isConnected ? 'bg-green-500' : 'bg-red-500'
                } ${wsState.isConnected ? 'animate-pulse' : ''}`}></div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Agents</p>
                  <p className="text-lg font-semibold text-foreground">
                    {agentsLoading ? 'Loading...' : agents.length}
                  </p>
                </div>
                <div className="text-2xl">🤖</div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {agentsLoading ? '--' : agents.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <div className="text-2xl">⚡</div>
              </div>
            </div>
          </div>

          {/* Dashboard Layout */}
          <DashboardLayout />
        </main>
      </div>
    </DashboardProvider>
  );
}