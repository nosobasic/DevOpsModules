import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Rocket, 
  TrendingUp,
  Bot,
  BarChart3,
  Star,
  Crown,
  Zap,
  Users,
  Sparkles
} from 'lucide-react';

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [showBundleOffer, setShowBundleOffer] = useState(false);

  const products = [
    {
      id: 'revenue-ripple',
      name: 'Revenue Ripple Core',
      description: 'Complete marketing education platform',
      icon: TrendingUp,
      color: 'blue',
      popular: true,
      plans: {
        starter: {
          name: 'Starter',
          monthly: 97,
          annual: 970,
          features: [
            'Marketing fundamentals course',
            'Basic analytics dashboard',
            'Email support',
            'Monthly webinars',
            'Community access'
          ]
        },
        pro: {
          name: 'Professional',
          monthly: 297,
          annual: 2970,
          features: [
            'Complete marketing curriculum',
            'Advanced analytics & reporting',
            'A/B testing tools',
            'Priority support',
            'Private mastermind group',
            'Monthly 1:1 coaching calls',
            'Custom funnels & templates'
          ]
        },
        enterprise: {
          name: 'Enterprise',
          monthly: 997,
          annual: 9970,
          features: [
            'Everything in Professional',
            'White-label solutions',
            'Custom integrations',
            'Dedicated account manager',
            'Team training sessions',
            'Advanced automation tools',
            'Custom reporting & API access'
          ]
        }
      }
    },
    {
      id: 'ai-tracker',
      name: 'AI Visibility Tracker',
      description: 'Track business across AI platforms',
      icon: Bot,
      color: 'purple',
      popular: false,
      plans: {
        starter: {
          name: 'AI Starter',
          monthly: 97,
          annual: 970,
          features: [
            'Track 5 AI platforms',
            'Monitor 50 keywords',
            'Weekly reports',
            'Basic competitor tracking',
            'Email alerts'
          ]
        },
        pro: {
          name: 'AI Professional',
          monthly: 197,
          annual: 1970,
          features: [
            'Track 20+ AI platforms',
            'Unlimited keywords',
            'Daily reports',
            'Advanced competitor analysis',
            'AI content optimization',
            'Priority support',
            'Custom alerts'
          ]
        },
        enterprise: {
          name: 'AI Enterprise',
          monthly: 497,
          annual: 4970,
          features: [
            'Everything in Professional',
            'White-label reports',
            'API access',
            'Custom integrations',
            'Dedicated success manager',
            'Team collaboration tools',
            'Advanced analytics'
          ]
        }
      }
    },
    {
      id: 'command-center',
      name: 'Command Center',
      description: 'DevOps automation platform',
      icon: BarChart3,
      color: 'green',
      popular: false,
      plans: {
        starter: {
          name: 'DevOps Starter',
          monthly: 197,
          annual: 1970,
          features: [
            '10 automation agents',
            'Basic monitoring',
            'Email alerts',
            'Standard support',
            'Basic integrations'
          ]
        },
        pro: {
          name: 'DevOps Professional',
          monthly: 497,
          annual: 4970,
          features: [
            '20+ automation agents',
            'Advanced monitoring',
            'Real-time alerts',
            'Priority support',
            'Custom integrations',
            'Performance optimization',
            'Security scanning'
          ]
        },
        enterprise: {
          name: 'DevOps Enterprise',
          monthly: 997,
          annual: 9970,
          features: [
            'Everything in Professional',
            'Unlimited agents',
            'Custom agent development',
            'Dedicated infrastructure',
            'White-label dashboard',
            'SLA guarantees',
            '24/7 support'
          ]
        }
      }
    }
  ];

  const bundleOffer = {
    name: 'Revenue Accelerator Bundle',
    description: 'All three platforms working together for maximum growth',
    originalPrice: billingPeriod === 'monthly' ? 1091 : 10910,
    bundlePrice: billingPeriod === 'monthly' ? 797 : 7970,
    savings: billingPeriod === 'monthly' ? 294 : 2940,
    features: [
      'Revenue Ripple Core (Professional)',
      'AI Visibility Tracker (Professional)', 
      'Command Center (Professional)',
      'Cross-platform analytics',
      'Unified reporting dashboard',
      'Priority support across all products',
      'Exclusive bundle-only features',
      'Monthly strategy sessions'
    ]
  };

  const getPrice = (price: number) => billingPeriod === 'annual' ? price / 12 : price;
  const getSavings = (monthly: number, annual: number) => Math.round(((monthly * 12 - annual) / (monthly * 12)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Rocket className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Revenue Ripple</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/ai-visibility-tracker" className="text-gray-600 hover:text-blue-600 transition-colors">AI Tracker</Link>
              <Link to="/command-center" className="text-gray-600 hover:text-blue-600 transition-colors">Command Center</Link>
              <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="block text-blue-600">Growth Path</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Simple, transparent pricing for the complete revenue growth ecosystem. 
            Start with one product or bundle everything for maximum impact.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-lg border">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
                  billingPeriod === 'annual'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Bundle Offer Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white mb-16 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 mr-2" />
              <span className="text-lg font-bold">Special Bundle Offer</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">{bundleOffer.name}</h3>
            <p className="mb-4 opacity-90">{bundleOffer.description}</p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-sm opacity-75">Individual Price</div>
                <div className="text-xl line-through">${getPrice(bundleOffer.originalPrice).toFixed(0)}/mo</div>
              </div>
              <div className="text-2xl">→</div>
              <div className="text-center">
                <div className="text-sm opacity-75">Bundle Price</div>
                <div className="text-3xl font-bold">${getPrice(bundleOffer.bundlePrice).toFixed(0)}/mo</div>
              </div>
              <div className="text-center">
                <div className="text-sm opacity-75">You Save</div>
                <div className="text-xl font-bold text-yellow-300">${getPrice(bundleOffer.savings).toFixed(0)}/mo</div>
              </div>
            </div>
            <button
              onClick={() => setShowBundleOffer(true)}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mt-6"
            >
              View Bundle Details
            </button>
          </div>
        </div>
      </section>

      {/* Individual Products */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {products.map((product, productIndex) => {
            const Icon = product.icon;
            return (
              <div key={product.id} className="mb-16">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center mb-4">
                    <Icon className={`h-8 w-8 text-${product.color}-600 mr-3`} />
                    <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>
                    {product.popular && (
                      <Crown className="h-6 w-6 text-yellow-500 ml-2" />
                    )}
                  </div>
                  <p className="text-lg text-gray-600">{product.description}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {Object.entries(product.plans).map(([planKey, plan], index) => {
                    const isPopular = planKey === 'pro';
                    const monthlyPrice = plan.monthly;
                    const annualPrice = plan.annual;
                    const displayPrice = billingPeriod === 'annual' ? annualPrice / 12 : monthlyPrice;
                    const savings = getSavings(monthlyPrice, annualPrice);

                    return (
                      <div
                        key={planKey}
                        className={`relative bg-white rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${
                          isPopular
                            ? `border-${product.color}-500 shadow-lg scale-105`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isPopular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className={`bg-${product.color}-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center`}>
                              <Star className="h-4 w-4 mr-1" />
                              Most Popular
                            </span>
                          </div>
                        )}

                        <div className="text-center mb-8">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                          <div className="mb-4">
                            <span className="text-4xl font-bold text-gray-900">${displayPrice.toFixed(0)}</span>
                            <span className="text-gray-600">/month</span>
                            {billingPeriod === 'annual' && (
                              <div className="text-sm text-green-600 font-semibold">
                                Save {savings}% annually
                              </div>
                            )}
                          </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Link
                          to={`/onboarding?product=${product.id}&plan=${planKey}&billing=${billingPeriod}`}
                          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors text-center block ${
                            isPopular
                              ? `bg-${product.color}-600 text-white hover:bg-${product.color}-700`
                              : `border-2 border-${product.color}-600 text-${product.color}-600 hover:bg-${product.color}-50`
                          }`}
                        >
                          Start Free Trial
                        </Link>

                        <div className="text-center mt-4 text-sm text-gray-500">
                          14-day free trial • No credit card required
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bundle Offer Modal */}
      {showBundleOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{bundleOffer.name}</h2>
                  <p className="text-lg text-gray-600">{bundleOffer.description}</p>
                </div>
                <button
                  onClick={() => setShowBundleOffer(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {bundleOffer.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Bundle Savings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Individual Products:</span>
                      <span className="line-through text-gray-500">${getPrice(bundleOffer.originalPrice).toFixed(0)}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bundle Price:</span>
                      <span className="font-bold text-green-600">${getPrice(bundleOffer.bundlePrice).toFixed(0)}/mo</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Savings:</span>
                        <span className="text-green-600">${getPrice(bundleOffer.savings).toFixed(0)}/mo</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((bundleOffer.savings / bundleOffer.originalPrice) * 100)}% discount
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/onboarding?product=bundle&billing=${billingPeriod}`}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors text-center block mt-6"
                  >
                    Get Bundle - Start Free Trial
                  </Link>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Zap className="h-5 w-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-800">Limited Time Offer</span>
                </div>
                <p className="text-yellow-700 mt-1">
                  Bundle pricing available for the first 1,000 customers. Lock in this rate forever.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            {[
              {
                q: "Can I switch between plans?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle."
              },
              {
                q: "What's included in the free trial?",
                a: "Full access to all features of your chosen plan for 14 days. No credit card required to start."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment."
              },
              {
                q: "Can I use multiple products together?",
                a: "Absolutely! Our products are designed to work together. The bundle offers the best value and integrated experience."
              },
              {
                q: "Is there a setup fee?",
                a: "No setup fees. The price you see is what you pay. We include onboarding and setup assistance."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to 10X Your Revenue?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start with any product or bundle everything for maximum growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding?product=bundle"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Get Bundle Deal <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/onboarding"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Start with One Product
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}