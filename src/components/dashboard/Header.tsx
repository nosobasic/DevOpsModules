
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Wifi, WifiOff, Rocket, TrendingUp, Bot, BarChart3, Crown, Sparkles } from 'lucide-react';
import { NotificationSystem } from './NotificationSystem';

interface HeaderProps {
  onSettingsClick?: () => void;
  alerts?: any[];
  onDismissAlert?: (alertId: string) => void;
  onActionAlert?: (actionId: string, alertId: string) => void;
}

export function Header({ onSettingsClick, alerts = [], onDismissAlert, onActionAlert }: HeaderProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [showProductMenu, setShowProductMenu] = useState(false);

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      alert('Settings panel will be implemented here. This would include:\n\n• API Configuration\n• Webhook Settings\n• Agent Defaults\n• System Preferences\n• Integration Settings');
    }
  };

  const products = [
    {
      name: 'Revenue Ripple Core',
      description: 'Marketing education platform',
      icon: TrendingUp,
      color: 'text-blue-600',
      link: '/pricing',
      status: 'Available'
    },
    {
      name: 'AI Visibility Tracker',
      description: 'Track AI platform mentions',
      icon: Bot,
      color: 'text-purple-600',
      link: '/ai-visibility-tracker',
      status: 'New',
      badge: '🔥'
    },
    {
      name: 'Command Center',
      description: 'DevOps automation (Current)',
      icon: BarChart3,
      color: 'text-green-600',
      link: '/dashboard',
      status: 'Active'
    }
  ];

  return (
    <header className="border-b bg-card relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-primary">Revenue Ripple</span>
            </Link>
            
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProductMenu(!showProductMenu)}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <span>Products</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProductMenu && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                  <div className="p-4">
                    <div className="text-sm font-semibold text-gray-900 mb-3">Revenue Ripple Ecosystem</div>
                    <div className="space-y-3">
                      {products.map((product, index) => {
                        const Icon = product.icon;
                        return (
                          <Link
                            key={index}
                            to={product.link}
                            className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={() => setShowProductMenu(false)}
                          >
                            <Icon className={`h-5 w-5 ${product.color} mr-3 mt-0.5`} />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 group-hover:text-blue-600">{product.name}</span>
                                {product.badge && <span>{product.badge}</span>}
                                {product.status === 'Active' && (
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Active</span>
                                )}
                                {product.status === 'New' && (
                                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">New</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{product.description}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    
                    <div className="border-t mt-4 pt-4">
                      <Link
                        to="/pricing"
                        className="flex items-center justify-center w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                        onClick={() => setShowProductMenu(false)}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        View Bundle Deal - Save 27%
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Upgrade Banner */}
            <Link
              to="/pricing"
              className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all text-sm font-semibold"
            >
              <Crown className="h-4 w-4" />
              <span>Upgrade to Full Suite</span>
            </Link>

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