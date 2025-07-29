import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Rocket, 
  Shield, 
  Zap, 
  BarChart3,
  Settings,
  Clock,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Monitor,
  Cpu
} from 'lucide-react';

export function CommandCenter() {
  const [savingsCounter, setSavingsCounter] = useState(0);

  const agents = [
    { name: 'Deploy Bot', description: 'Automated deployment management', status: 'active', savings: '$2,500/mo' },
    { name: 'Bug Watcher', description: 'Real-time error monitoring', status: 'active', savings: '$1,800/mo' },
    { name: 'Performance Monitor', description: 'System optimization', status: 'active', savings: '$3,200/mo' },
    { name: 'Security Scanner', description: 'Automated security audits', status: 'active', savings: '$4,100/mo' },
    { name: 'Cost Optimizer', description: 'Resource cost reduction', status: 'active', savings: '$2,900/mo' },
    { name: 'Alert Manager', description: 'Intelligent alerting system', status: 'active', savings: '$1,400/mo' }
  ];

  const benefits = [
    {
      icon: Clock,
      title: '80% Time Saved',
      description: 'Automate routine DevOps tasks that used to take hours',
      metric: '32 hours/week saved'
    },
    {
      icon: DollarSign,
      title: '$15K+ Monthly Savings',
      description: 'Reduce operational costs through intelligent automation',
      metric: 'Average client saves $15,900/month'
    },
    {
      icon: Shield,
      title: '99.9% Uptime',
      description: 'Proactive monitoring prevents costly downtime',
      metric: '340% improvement in reliability'
    },
    {
      icon: TrendingUp,
      title: '5X Faster Deployments',
      description: 'Deploy with confidence using automated testing and rollbacks',
      metric: 'From 2 hours to 24 minutes average'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setSavingsCounter(prev => prev + Math.floor(Math.random() * 50) + 25);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
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
              <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Access Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Monitor className="h-4 w-4 mr-2" />
              DevOps Automation Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Your DevOps
              <span className="block text-blue-600">Command Center</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Automate 80% of your DevOps tasks, prevent costly downtime, and save $15K+ monthly 
              with our AI-powered operations dashboard.
            </p>

            {/* Live Savings Counter */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Live Savings Today</div>
                <div className="text-3xl font-bold text-green-600">${savingsCounter.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Across all clients</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboarding?product=command-center"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/dashboard"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                View Live Demo
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">9/12</div>
                  <div className="text-sm text-gray-600">Active Agents</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">99.9%</div>
                  <div className="text-sm text-gray-600">System Uptime</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$15.9K</div>
                  <div className="text-sm text-gray-600">Monthly Savings</div>
                </div>
              </div>
              
              {/* Agent Grid Preview */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.slice(0, 6).map((agent, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-900">{agent.name}</div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{agent.description}</div>
                    <div className="text-xs text-green-600 font-semibold">{agent.savings}</div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6 text-sm text-gray-500">
                🚀 Live Command Center Dashboard
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
              DevOps Chaos Costing You Millions?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manual DevOps processes are expensive, error-prone, and don't scale. 
              How much is downtime and inefficiency really costing your business?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-red-100 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Costly Downtime</h3>
              <p className="text-gray-600">
                Average cost of downtime is $5,600 per minute. Manual monitoring misses critical issues.
              </p>
              <div className="text-2xl font-bold text-red-600 mt-2">$5.6K/min</div>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wasted Developer Time</h3>
              <p className="text-gray-600">
                Developers spend 60% of their time on DevOps tasks instead of building features.
              </p>
              <div className="text-2xl font-bold text-orange-600 mt-2">60% waste</div>
            </div>
            <div className="text-center p-6">
              <div className="bg-yellow-100 text-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hidden Costs</h3>
              <p className="text-gray-600">
                Over-provisioned resources, security vulnerabilities, and inefficient deployments drain budgets.
              </p>
              <div className="text-2xl font-bold text-yellow-600 mt-2">30% overspend</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transform Your Operations
            </h2>
            <p className="text-xl text-gray-600">
              Measurable results from day one with our intelligent automation platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
                  <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 mb-4">{benefit.description}</p>
                  <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {benefit.metric}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              20+ AI-Powered Agents
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive automation for every aspect of your DevOps pipeline
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Deploy Bot', description: 'Automated deployment with rollback protection', icon: Rocket, category: 'Deployment' },
              { name: 'Bug Watcher', description: 'Real-time error detection and resolution', icon: Shield, category: 'Monitoring' },
              { name: 'Performance Monitor', description: 'System optimization and scaling', icon: BarChart3, category: 'Performance' },
              { name: 'Security Scanner', description: 'Continuous security audits and fixes', icon: Shield, category: 'Security' },
              { name: 'Cost Optimizer', description: 'Resource utilization optimization', icon: DollarSign, category: 'Cost Management' },
              { name: 'Alert Manager', description: 'Intelligent alerting and escalation', icon: AlertTriangle, category: 'Operations' }
            ].map((agent, index) => {
              const Icon = agent.icon;
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-600 font-semibold uppercase mb-1">{agent.category}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{agent.name}</h3>
                      <p className="text-gray-600">{agent.description}</p>
                      <div className="mt-3">
                        <span className="inline-flex items-center text-sm text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All 20+ Agents <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-8">Calculate Your Savings</h2>
          
          <div className="bg-white/10 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">$15,900</div>
                <div className="text-blue-100">Average Monthly Savings</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">32 hours</div>
                <div className="text-blue-100">Weekly Time Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">5X</div>
                <div className="text-blue-100">Faster Deployments</div>
              </div>
            </div>
          </div>

          <div className="bg-white text-gray-900 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Your Potential ROI</h3>
            <div className="space-y-4 text-left">
              <div className="flex justify-between">
                <span>Current DevOps team cost:</span>
                <span className="font-semibold">$25,000/month</span>
              </div>
              <div className="flex justify-between">
                <span>Command Center cost:</span>
                <span className="font-semibold text-blue-600">$197/month</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated savings:</span>
                <span className="font-semibold text-green-600">$15,900/month</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Annual ROI:</span>
                  <span className="text-green-600">8,000%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple Pricing, Massive Savings</h2>
            <p className="text-xl text-gray-600">One platform, unlimited automation</p>
          </div>

          <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 max-w-md mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Command Center Pro</h3>
              <div className="text-5xl font-bold text-blue-600 mb-2">$197<span className="text-lg text-gray-600">/month</span></div>
              <p className="text-gray-600">Everything you need to automate your DevOps</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>20+ AI-powered automation agents</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Real-time monitoring & alerts</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Automated deployments & rollbacks</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Security scanning & compliance</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>Cost optimization analytics</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span>24/7 support & onboarding</span>
              </li>
            </ul>

            <Link
              to="/onboarding?product=command-center"
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block text-lg"
            >
              Start 30-Day Free Trial
            </Link>

            <div className="text-center mt-4 text-sm text-gray-600">
              💳 No credit card required • Cancel anytime
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              🎯 <strong>ROI Guarantee:</strong> Save more than you spend in 60 days or get your money back
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Stop Losing Money to Manual DevOps
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 500+ companies saving $15K+ monthly with automated DevOps operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding?product=command-center"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Live Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}