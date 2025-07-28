
import { useState } from 'react';
import { Settings, Wifi, WifiOff } from 'lucide-react';
import { NotificationSystem } from './NotificationSystem';

interface HeaderProps {
  onSettingsClick?: () => void;
  alerts?: any[];
  onDismissAlert?: (alertId: string) => void;
  onActionAlert?: (actionId: string, alertId: string) => void;
}

export function Header({ onSettingsClick, alerts = [], onDismissAlert, onActionAlert }: HeaderProps) {
  const [isConnected, setIsConnected] = useState(true);

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      alert('Settings panel will be implemented here. This would include:\n\n• API Configuration\n• Webhook Settings\n• Agent Defaults\n• System Preferences\n• Integration Settings');
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">AI Agent Dashboard</h1>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">Automated business operations monitoring</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2 text-sm">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-muted-foreground">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-red-600">Disconnected</span>
                </>
              )}
            </div>
            
            {/* Notification System */}
            <NotificationSystem 
              alerts={alerts}
              onDismiss={onDismissAlert}
              onAction={onActionAlert}
            />
            
            {/* Settings Button */}
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
              onClick={handleSettingsClick}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}