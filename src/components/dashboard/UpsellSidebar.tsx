import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Bot, 
  Sparkles, 
  Crown,
  X,
  Eye,
  BarChart3,
  Zap,
  DollarSign,
  Users
} from 'lucide-react';

interface UpsellSidebarProps {
  currentProduct?: string;
  userActions?: string[];
  onUpsellClick?: (type: string, trigger: string) => void;
}

export function UpsellSidebar({ currentProduct = 'command-center', userActions = [], onUpsellClick }: UpsellSidebarProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [shownOffers, setShownOffers] = useState<string[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  // Smart recommendations based on current product and user behavior
  const getRecommendations = () => {
    const baseRecommendations = [
      {
        id: 'bundle',
        type: 'bundle',
        title: 'Complete Growth Stack',
        description: 'Get all 3 platforms and save $294/month',
        icon: Sparkles,
        color: 'from-purple-500 to-blue-500',
        value: 'Save $294/mo',
        priority: 1,
        cta: 'View Bundle Deal'
      },
      {
        id: 'ai-tracker',
        type: 'ai-tracker',
        title: 'AI Visibility Tracker',
        description: 'Track your business across ChatGPT & AI platforms',
        icon: Bot,
        color: 'from-purple-500 to-purple-600',
        value: '$97/month',
        priority: 2,
        cta: 'Add AI Tracker',
        badge: '🔥 New'
      },
      {
        id: 'revenue-ripple',
        type: 'revenue-ripple',
        title: 'Revenue Ripple Core',
        description: 'Master marketing with proven strategies',
        icon: TrendingUp,
        color: 'from-blue-500 to-blue-600',
        value: '$297/month',
        priority: 3,
        cta: 'Learn More'
      }
    ];

    // Personalize based on user actions
    if (userActions.includes('high-agent-usage')) {
      baseRecommendations[0].priority = 0; // Prioritize bundle
      baseRecommendations[0].description = 'You\'re maximizing DevOps. Unlock the full ecosystem!';
    }

    if (userActions.includes('revenue-focused')) {
      baseRecommendations[2].priority = 1;
      baseRecommendations[2].description = 'Turn your operational efficiency into revenue growth';
    }

    return baseRecommendations.sort((a, b) => a.priority - b.priority);
  };

  const recommendations = getRecommendations();
  const currentOffer = recommendations[currentOfferIndex];

  // Rotate offers every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % recommendations.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [recommendations.length]);

  const handleOfferClick = (offerId: string, type: string) => {
    setShownOffers(prev => [...prev, offerId]);
    onUpsellClick?.(type, 'sidebar');
  };

  const dismissOffer = (offerId: string) => {
    setShownOffers(prev => [...prev, offerId]);
  };

  if (isMinimized) {
    return (
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-20 w-80 z-40">
      <div className="space-y-4">
        {/* Main Offer */}
        {currentOffer && !shownOffers.includes(currentOffer.id) && (
          <div className="bg-white rounded-2xl shadow-xl border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${currentOffer.color}`}>
                <currentOffer.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => dismissOffer(currentOffer.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-bold text-gray-900">{currentOffer.title}</h3>
                {currentOffer.badge && <span className="text-sm">{currentOffer.badge}</span>}
              </div>
              <p className="text-gray-600 text-sm mb-3">{currentOffer.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-green-600">{currentOffer.value}</span>
                {currentOffer.type === 'bundle' && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Limited Time
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleOfferClick(currentOffer.id, currentOffer.type)}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all bg-gradient-to-r ${currentOffer.color} hover:scale-105`}
            >
              <div className="flex items-center justify-center">
                {currentOffer.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </button>
          </div>
        )}

        {/* Quick Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <h3 className="font-bold text-gray-900 mb-4">Your Progress</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">DevOps Savings</span>
              <span className="font-semibold text-green-600">$15,900/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Agents</span>
              <span className="font-semibold">9/12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">System Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600 mb-2">Potential with full suite:</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-blue-600">$45K+/mo savings</span>
              <Link 
                to="/pricing" 
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
              >
                See how →
              </Link>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border p-6">
          <div className="flex items-center mb-3">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <span className="font-semibold text-gray-900">15,000+ Users</span>
          </div>
          <blockquote className="text-sm text-gray-700 italic mb-3">
            "The bundle paid for itself in 2 weeks. 10X ROI in 6 months."
          </blockquote>
          <div className="text-xs text-gray-600">— Lisa R., TechScale CEO</div>
          
          <Link
            to="/pricing"
            className="mt-4 w-full bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold text-sm border border-blue-200 hover:bg-blue-50 transition-colors text-center block"
          >
            Read More Success Stories
          </Link>
        </div>

        {/* Offer Indicators */}
        <div className="flex justify-center space-x-2">
          {recommendations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentOfferIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentOfferIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}