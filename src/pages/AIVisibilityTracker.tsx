import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Bot, 
  Search, 
  TrendingUp, 
  Eye, 
  Zap, 
  BarChart3,
  Rocket,
  Star,
  AlertTriangle
} from 'lucide-react';

export function AIVisibilityTracker() {
  const [activeTab, setActiveTab] = useState('monitoring');

  const platforms = [
    { name: 'ChatGPT', logo: '🤖', coverage: '98%' },
    { name: 'Perplexity', logo: '🔍', coverage: '95%' },
    { name: 'Claude', logo: '🧠', coverage: '92%' },
    { name: 'Gemini', logo: '💎', coverage: '89%' },
    { name: 'Bing Chat', logo: '🌐', coverage: '87%' },
    { name: 'You.com', logo: '🎯', coverage: '85%' }
  ];

  const features = {
    monitoring: [
      { icon: Eye, title: 'Real-time AI Mentions', description: 'Track when your business is mentioned across 20+ AI platforms' },
      { icon: Search, title: 'Keyword Visibility', description: 'Monitor your ranking for industry keywords in AI responses' },
      { icon: TrendingUp, title: 'Trend Analysis', description: 'Identify rising topics and opportunities in your industry' },
      { icon: AlertTriangle, title: 'Competitive Alerts', description: 'Get notified when competitors gain visibility' }
    ],
    insights: [
      { icon: BarChart3, title: 'Visibility Scores', description: 'Quantify your AI presence with our proprietary scoring system' },
      { icon: Bot, title: 'AI Sentiment Analysis', description: 'Understand how AI platforms perceive your brand' },
      { icon: TrendingUp, title: 'Growth Opportunities', description: 'Discover untapped niches and content gaps' },
      { icon: Zap, title: 'Optimization Recommendations', description: 'Get AI-powered suggestions to improve visibility' }
    ],
    content: [
      { icon: Bot, title: 'AI-Optimized Content', description: 'Generate content designed to rank in AI responses' },
      { icon: Search, title: 'Query Suggestions', description: 'See what questions people ask about your industry' },
      { icon: CheckCircle, title: 'Content Validation', description: 'Test content performance before publishing' },
      { icon: TrendingUp, title: 'Impact Tracking', description: 'Measure how content affects your AI visibility' }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Rocket className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Revenue Ripple</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
              <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="h-4 w-4 mr-2" />
              New: AI-First Marketing Tool
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Track Your Business in the
              <span className="block text-purple-600">Age of AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Monitor your visibility across ChatGPT, Perplexity, and 20+ AI platforms. 
              Discover hidden opportunities worth $250K+ that traditional analytics miss.
            </p>

            {/* Platform Logos */}
            <div className="flex justify-center items-center space-x-8 mb-12">
              {platforms.slice(0, 4).map((platform, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{platform.logo}</div>
                  <div className="text-sm text-gray-600">{platform.name}</div>
                  <div className="text-xs text-green-600 font-semibold">{platform.coverage}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboarding?product=ai-tracker"
                className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                Start 14-Day Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">342</div>
                  <div className="text-sm text-gray-600">AI Mentions</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">78%</div>
                  <div className="text-sm text-gray-600">Visibility Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$127K</div>
                  <div className="text-sm text-gray-600">Opportunity Value</div>
                </div>
              </div>
              <div className="flex justify-center text-sm text-gray-500">
                ↗️ AI Visibility Dashboard Preview
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The Invisible Marketing Crisis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              While you're optimizing for Google, your potential customers are asking AI. 
              Are you missing out on the fastest-growing search paradigm?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Invisible to AI</h3>
              <p className="text-gray-600">
                60% of searches now happen through AI platforms, but you have zero visibility into your performance.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Missing Opportunities</h3>
              <p className="text-gray-600">
                Competitors are gaining ground in AI search results while you're focused on traditional SEO.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Blind Strategy</h3>
              <p className="text-gray-600">
                Making marketing decisions without knowing how AI platforms perceive and recommend your business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete AI Visibility Intelligence
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to dominate AI search and multiply your visibility
            </p>
          </div>

          {/* Feature Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              {Object.keys(features).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Feature Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {features[activeTab as keyof typeof features].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="flex items-start">
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-lg mr-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">Real Results from Real Businesses</h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold mb-2">$250K+</div>
                <div className="text-purple-100">Average opportunity value discovered</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">340%</div>
                <div className="text-purple-100">Increase in qualified leads</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">67%</div>
                <div className="text-purple-100">Improvement in brand visibility</div>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg mb-4">
                "We discovered we were completely invisible in AI search results. Within 30 days of using 
                AI Visibility Tracker, we increased our AI mentions by 400% and generated $180K in new revenue."
              </blockquote>
              <div className="font-semibold">Sarah Chen, Growth Director at TechScale</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Start free, scale as you grow</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Tracker Starter</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">$97<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600">Perfect for small businesses</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Track 5 AI platforms</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Monitor 50 keywords</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Weekly visibility reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Basic competitor tracking</span>
                </li>
              </ul>

              <Link
                to="/onboarding?product=ai-tracker&plan=starter"
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-purple-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Tracker Pro</h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">$197<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600">For growing businesses</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Track 20+ AI platforms</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Monitor unlimited keywords</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Daily visibility reports</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advanced competitor analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>AI content optimization</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>

              <Link
                to="/onboarding?product=ai-tracker&plan=pro"
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-center block"
              >
                Start Free Trial
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              🎁 <strong>Limited Time:</strong> Get 2 months free when you choose annual billing
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Don't Let AI Search Pass You By
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start your 14-day free trial and discover what opportunities you're missing in the AI revolution
          </p>
          <Link
            to="/onboarding?product=ai-tracker"
            className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Free Trial - No Credit Card Required <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}