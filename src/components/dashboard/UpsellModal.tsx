import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Bot, 
  BarChart3, 
  Crown,
  Sparkles,
  Zap,
  DollarSign
} from 'lucide-react';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ai-tracker' | 'revenue-ripple' | 'bundle' | 'upgrade';
  trigger?: string; // What triggered the modal (e.g., 'dashboard-limit', 'time-based', 'feature-click')
}

export function UpsellModal({ isOpen, onClose, type, trigger }: UpsellModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  if (!isOpen) return null;

  const upsellConfigs = {
    'ai-tracker': {
      title: 'Unlock AI Visibility Tracking',
      subtitle: 'Track your business across 20+ AI platforms',
      description: 'While you\'re optimizing your DevOps, discover hidden opportunities worth $250K+ in AI search results.',
      icon: Bot,
      color: 'purple',
      ctaText: 'Add AI Tracker for $97/mo',
      link: '/ai-visibility-tracker',
      features: [
        'Track mentions across ChatGPT, Perplexity, Claude',
        'Monitor keyword rankings in AI responses',
        'Get competitor intelligence reports',
        'AI content optimization suggestions'
      ],
      testimonial: {
        text: "We discovered we were invisible in AI search. Within 30 days, we generated $180K in new revenue.",
        author: "Sarah Chen, Growth Director"
      }
    },
    'revenue-ripple': {
      title: 'Master Revenue Growth',
      subtitle: 'Complete marketing education platform',
      description: 'Your DevOps is optimized. Now multiply your revenue with proven marketing strategies.',
      icon: TrendingUp,
      color: 'blue',
      ctaText: 'Add Revenue Ripple for $297/mo',
      link: '/pricing',
      features: [
        'Complete marketing curriculum & courses',
        'Advanced conversion optimization tools',
        'A/B testing and analytics platform',
        'Monthly 1:1 coaching calls'
      ],
      testimonial: {
        text: "Revenue Ripple increased our conversion rates by 340% in just 2 months.",
        author: "Mike Johnson, CEO"
      }
    },
    'bundle': {
      title: 'Get the Complete Growth Stack',
      subtitle: 'All three platforms working together',
      description: 'You\'re already seeing results with Command Center. Unlock the full Revenue Ripple ecosystem.',
      icon: Sparkles,
      color: 'gradient',
      ctaText: 'Get Bundle Deal - Save $294/mo',
      link: '/pricing',
      features: [
        'Revenue Ripple Core (Marketing education)',
        'AI Visibility Tracker (AI platform monitoring)',
        'Command Center (DevOps automation)',
        'Cross-platform analytics & unified reporting',
        'Priority support across all products'
      ],
      testimonial: {
        text: "The bundle transformed our entire business. 10X ROI in 6 months.",
        author: "Lisa Rodriguez, Founder"
      }
    },
    'upgrade': {
      title: 'Upgrade Your Command Center',
      subtitle: 'Unlock advanced automation features',
      description: 'You\'re already saving time with basic automation. Unlock enterprise-grade capabilities.',
      icon: Crown,
      color: 'yellow',
      ctaText: 'Upgrade to Pro - $497/mo',
      link: '/pricing',
      features: [
        'Advanced deployment automation',
        'Custom agent development',
        'White-label dashboard',
        'Dedicated success manager',
        'SLA guarantees'
      ],
      testimonial: {
        text: "Upgrading to Pro saved us an additional $25K monthly in operational costs.",
        author: "David Kim, CTO"
      }
    }
  };

  const config = upsellConfigs[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-90vh overflow-y-auto">
        <div className="relative p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              config.color === 'gradient' 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                : `bg-${config.color}-100`
            }`}>
              <Icon className={`h-8 w-8 ${
                config.color === 'gradient' ? 'text-white' : `text-${config.color}-600`
              }`} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{config.title}</h2>
            <p className="text-xl text-gray-600 mb-4">{config.subtitle}</p>
            <p className="text-gray-700">{config.description}</p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get:</h3>
            <ul className="space-y-3">
              {config.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ROI Calculator */}
          {type === 'bundle' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-green-800 mb-3">Bundle Savings Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Individual Products:</span>
                  <span className="line-through text-gray-500">$1,091/mo</span>
                </div>
                <div className="flex justify-between">
                  <span>Bundle Price:</span>
                  <span className="font-semibold text-green-600">$797/mo</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>You Save:</span>
                    <span className="text-green-600">$294/mo</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Testimonial */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <blockquote className="text-gray-700 italic mb-3">
              "{config.testimonial.text}"
            </blockquote>
            <div className="font-semibold text-gray-900">— {config.testimonial.author}</div>
          </div>

          {/* Urgency Elements */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="font-semibold text-yellow-800">Limited Time Offer</span>
            </div>
            <p className="text-yellow-700 mt-1 text-sm">
              {type === 'bundle' 
                ? 'Bundle pricing available for first 1,000 customers. Lock in this rate forever.'
                : 'Start your 14-day free trial. First month 50% off for existing customers.'
              }
            </p>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Link
              to={`${config.link}${config.link.includes('?') ? '&' : '?'}source=${trigger || 'modal'}`}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all text-center block ${
                config.color === 'gradient'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                  : `bg-${config.color}-600 text-white hover:bg-${config.color}-700`
              }`}
              onClick={onClose}
            >
              <div className="flex items-center justify-center">
                {config.ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            </Link>
            
            <button
              onClick={onClose}
              className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-6">
              <span>✓ 14-day free trial</span>
              <span>✓ No credit card required</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}