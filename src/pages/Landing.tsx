import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, TrendingUp, Shield, Users, Bot, BarChart3, Rocket } from 'lucide-react';

export function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechStart Inc.",
      text: "Revenue Ripple increased our conversion rates by 340% in just 2 months. The AI insights are game-changing.",
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "CEO",
      company: "GrowthCorp",
      text: "The Command Center automated 80% of our DevOps tasks. We're saving $15K/month and our uptime is 99.9%.",
      avatar: "MC"
    },
    {
      name: "Lisa Rodriguez",
      role: "Growth Manager",
      company: "ScaleUp Solutions",
      text: "AI Visibility Tracker helped us identify opportunities worth $250K that we never knew existed.",
      avatar: "LR"
    }
  ];

  const products = [
    {
      name: "Revenue Ripple Core",
      description: "Complete marketing education platform with advanced analytics",
      features: ["Advanced Analytics", "Conversion Optimization", "Campaign Management", "ROI Tracking"],
      price: "$297/month",
      popular: true,
      link: "/pricing",
      icon: TrendingUp
    },
    {
      name: "AI Visibility Tracker",
      description: "Track your business across ChatGPT, Perplexity & 20+ AI platforms",
      features: ["AI Platform Monitoring", "Competitor Insights", "Content Suggestions", "Visibility Reports"],
      price: "$97/month",
      popular: false,
      link: "/ai-visibility-tracker",
      icon: Bot
    },
    {
      name: "Command Center",
      description: "Automated DevOps and operations management dashboard",
      features: ["DevOps Automation", "Performance Monitoring", "Alert Management", "Cost Optimization"],
      price: "$197/month",
      popular: false,
      link: "/command-center",
      icon: BarChart3
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Rocket className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Revenue Ripple</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/ai-visibility-tracker" className="text-gray-600 hover:text-blue-600 transition-colors">AI Tracker</Link>
              <Link to="/command-center" className="text-gray-600 hover:text-blue-600 transition-colors">Command Center</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
              <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Login</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Multiply Your Revenue With
              <span className="block text-blue-600">AI-Powered Marketing</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The complete marketing ecosystem that combines education, automation, and AI visibility 
              to scale your business beyond what you thought possible.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/onboarding"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/pricing"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                View Pricing
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex justify-center items-center space-x-8 text-gray-500 mb-16">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">15,000+</div>
                <div className="text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">$50M+</div>
                <div className="text-sm">Revenue Generated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">340%</div>
                <div className="text-sm">Avg Conversion Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Revenue Growth Ecosystem</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three powerful platforms working together to maximize your revenue at every touchpoint
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const Icon = product.icon;
              return (
                <div
                  key={index}
                  className={`relative p-8 rounded-2xl border-2 transition-all hover:shadow-xl ${
                    product.popular
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  {product.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="text-3xl font-bold text-blue-600 mb-6">{product.price}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={product.link}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors text-center block ${
                      product.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    Learn More
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">Trusted by Growth Leaders</h2>
          
          <div className="relative h-64">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentTestimonial ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <blockquote className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center justify-center">
                  <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mr-4 font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to 10X Your Revenue?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 15,000+ businesses using Revenue Ripple to scale beyond their wildest dreams
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              See All Plans
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Rocket className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-lg font-bold">Revenue Ripple</span>
              </div>
              <p className="text-gray-400">
                The complete marketing ecosystem for modern businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/pricing" className="hover:text-white transition-colors">Revenue Ripple Core</Link></li>
                <li><Link to="/ai-visibility-tracker" className="hover:text-white transition-colors">AI Visibility Tracker</Link></li>
                <li><Link to="/command-center" className="hover:text-white transition-colors">Command Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Revenue Ripple. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}