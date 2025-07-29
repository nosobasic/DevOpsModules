import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Rocket, 
  TrendingUp,
  Bot,
  BarChart3,
  User,
  Building,
  CreditCard,
  Shield,
  Sparkles,
  Target,
  Users,
  DollarSign
} from 'lucide-react';

export function Onboarding() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    // Business Info
    company: '',
    website: '',
    industry: '',
    teamSize: '',
    // Goals
    primaryGoal: '',
    currentRevenue: '',
    targetRevenue: '',
    // Product Selection
    selectedProduct: '',
    selectedPlan: '',
    billingPeriod: 'monthly',
    // Payment (trial)
    startTrial: true
  });

  const product = searchParams.get('product');
  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing');

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      selectedProduct: product || '',
      selectedPlan: plan || 'pro',
      billingPeriod: billing || 'monthly'
    }));
  }, [product, plan, billing]);

  const productConfig = {
    'revenue-ripple': {
      name: 'Revenue Ripple Core',
      icon: TrendingUp,
      color: 'blue',
      description: 'Complete marketing education platform'
    },
    'ai-tracker': {
      name: 'AI Visibility Tracker', 
      icon: Bot,
      color: 'purple',
      description: 'Track business across AI platforms'
    },
    'command-center': {
      name: 'Command Center',
      icon: BarChart3,
      color: 'green', 
      description: 'DevOps automation platform'
    },
    'bundle': {
      name: 'Revenue Accelerator Bundle',
      icon: Sparkles,
      color: 'gradient',
      description: 'All three platforms working together'
    }
  };

  const currentProduct = productConfig[formData.selectedProduct as keyof typeof productConfig];

  const steps = [
    { id: 1, title: 'Personal Info', description: 'Tell us about yourself' },
    { id: 2, title: 'Business Details', description: 'Your company information' },
    { id: 3, title: 'Goals & Vision', description: 'What you want to achieve' },
    { id: 4, title: 'Confirmation', description: 'Review and start trial' }
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 
    'Manufacturing', 'Consulting', 'Real Estate', 'Marketing Agency', 'Other'
  ];

  const teamSizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', 
    '201-500 employees', '501+ employees'
  ];

  const goals = [
    'Increase Revenue', 'Improve Marketing ROI', 'Automate Operations',
    'Better Analytics', 'Scale the Business', 'Reduce Costs'
  ];

  const revenueRanges = [
    'Under $100K', '$100K - $500K', '$500K - $1M', 
    '$1M - $5M', '$5M - $10M', '$10M+'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would typically submit to your backend
    console.log('Onboarding completed:', formData);
    // Redirect to dashboard or welcome page
    window.location.href = '/dashboard?newUser=true';
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 2:
        return formData.company && formData.industry && formData.teamSize;
      case 3:
        return formData.primaryGoal && formData.currentRevenue && formData.targetRevenue;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Rocket className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Revenue Ripple</span>
            </Link>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-1 mx-4 transition-colors ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Product Selection Banner */}
        {currentProduct && (
          <div className="bg-white rounded-2xl p-6 mb-8 border shadow-lg">
            <div className="flex items-center justify-center">
              <currentProduct.icon className={`h-8 w-8 text-${currentProduct.color}-600 mr-3`} />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentProduct.name}</h3>
                <p className="text-gray-600">{currentProduct.description}</p>
              </div>
              <div className="ml-auto">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  14-Day Free Trial
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          )}

          {/* Step 2: Business Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Building className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Business Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://company.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Industry</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size *
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => handleInputChange('teamSize', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Team Size</option>
                    {teamSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goals & Vision */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Target className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Your Goals & Vision</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Goal *
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {goals.map(goal => (
                    <button
                      key={goal}
                      onClick={() => handleInputChange('primaryGoal', goal)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.primaryGoal === goal
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Annual Revenue *
                  </label>
                  <select
                    value={formData.currentRevenue}
                    onChange={(e) => handleInputChange('currentRevenue', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Range</option>
                    {revenueRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Annual Revenue *
                  </label>
                  <select
                    value={formData.targetRevenue}
                    onChange={(e) => handleInputChange('targetRevenue', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Target</option>
                    {revenueRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Confirm Your Details</h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <div className="font-semibold">{formData.firstName} {formData.lastName}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <div className="font-semibold">{formData.email}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Company:</span>
                    <div className="font-semibold">{formData.company}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Industry:</span>
                    <div className="font-semibold">{formData.industry}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Primary Goal:</span>
                    <div className="font-semibold">{formData.primaryGoal}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Current Revenue:</span>
                    <div className="font-semibold">{formData.currentRevenue}</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <h4 className="text-lg font-semibold text-green-800">Free Trial Benefits</h4>
                </div>
                <ul className="space-y-2 text-green-700">
                  <li>• 14 days full access to all features</li>
                  <li>• No credit card required</li>
                  <li>• Cancel anytime during trial</li>
                  <li>• Personal onboarding session included</li>
                  <li>• 24/7 support during trial</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`flex items-center px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isStepValid()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Start Free Trial
                <Rocket className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Shield className="h-5 w-5" />
              <span className="text-sm">SSL Encrypted</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Users className="h-5 w-5" />
              <span className="text-sm">15,000+ Happy Customers</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm">No Credit Card Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}