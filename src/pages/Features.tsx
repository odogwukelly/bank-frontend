import { Link } from 'react-router-dom';
import { Shield, Smartphone, CreditCard, TrendingUp, Lock, Zap, Globe, Clock, Award, Users, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HamburgerMenu } from '@/components/layout/HamburgerMenu';
import handleLogout from '@/components/logOut';
import appName from '@/appName';

export default function Features() {
  const token = localStorage.getItem("token");

  const mainFeatures = [
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your money and data are protected with enterprise-grade security and encryption.',
      details: [
        '256-bit SSL encryption',
        'Two-factor authentication',
        'Biometric login support',
        'Real-time fraud monitoring'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile Banking',
      description: 'Access your accounts anytime, anywhere with our intuitive mobile app.',
      details: [
        'iOS & Android apps',
        'Mobile check deposit',
        'Touch ID & Face ID',
        'Offline access to statements'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: CreditCard,
      title: 'Digital Payments',
      description: 'Send and receive money instantly with our fast digital payment system.',
      details: [
        'Instant transfers',
        'International payments',
        'Bill pay automation',
        'Split payments'
      ],
      color: 'from-blue-600 to-indigo-600'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Track your spending and savings with intelligent financial insights.',
      details: [
        'Spending categorization',
        'Budget tracking',
        'Savings goals',
        'Financial forecasting'
      ],
      color: 'from-teal-500 to-green-600'
    }
  ];

  const additionalFeatures = [
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data is never sold to third parties. Complete control over your information.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant transactions and real-time balance updates across all your devices.'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Bank from anywhere in the world with multi-currency support.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer service to help you whenever you need it.'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized for excellence in digital banking and customer satisfaction.'
    },
    {
      icon: Users,
      title: 'Multi-User Accounts',
      description: 'Joint accounts with customizable permissions for business and family.'
    }
  ];

  const comparisonData = [
    { feature: 'Monthly Fees', us: '$0', others: '$5-15' },
    { feature: 'Transaction Speed', us: 'Instant', others: '1-3 days' },
    { feature: 'Mobile App Rating', us: '4.9/5', others: '3.5/5' },
    { feature: 'Customer Support', us: '24/7', others: 'Business hours' },
    { feature: 'International Transfers', us: 'Free', others: '$25-50' },
    { feature: 'ATM Network', us: '55,000+', others: '15,000+' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-green-50/30">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 fixed w-full top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 landing-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <span className="text-white font-bold text-lg">FF</span>
              </div>
              <span className="font-bold text-2xl text-gray-900 landing-text-gradient">{appName}</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
               {token ? (
                <>
                  <Link to="/features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group py-2">
                    Features
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-green-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors relative group py-2"
                  >
                    Logout
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  <Link to="/dashboard">
                    <Button className="landing-gradient-primary text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 px-6 py-2 rounded-xl font-semibold">
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group py-2">
                    Features
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-green-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors relative group py-2">
                    Login
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-green-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link to="/register">
                    <Button className="landing-gradient-primary text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 px-6 py-2 rounded-xl font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
              
            </div>

            {/* Mobile Navigation */}
            <HamburgerMenu />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-green-100 text-blue-700 text-sm font-semibold animate-fade-in">
              🎯 Complete Banking Solution
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              Powerful Features for
              <span className="landing-text-gradient"> Modern Banking</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 leading-relaxed">
              Everything you need to manage your finances efficiently, securely, and with complete control.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="landing-card-hover border-0 shadow-xl bg-white overflow-hidden">
                <CardContent className="p-8 sm:p-10">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 sm:py-24 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">More Features</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Built for <span className="landing-text-gradient">Your Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover additional features that make {appName} the perfect banking solution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="landing-card-hover border-0 shadow-lg bg-white group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 landing-feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      {/* <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Comparison</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Why Choose <span className="landing-text-gradient">FinFlow</span>?
            </h2>
            <p className="text-xl text-gray-600">
              See how we stack up against traditional banks.
            </p>
          </div>

          <Card className="shadow-2xl border-0 overflow-hidden landing-glow">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="landing-gradient-primary">
                    <tr>
                      <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">Feature</th>
                      <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">FinFlow</th>
                      <th className="px-6 py-5 text-center text-sm font-bold text-white uppercase tracking-wider">Traditional Banks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comparisonData.map((row, index) => (
                      <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-6 py-5 text-sm font-semibold text-gray-900">{row.feature}</td>
                        <td className="px-6 py-5 text-sm text-center">
                          <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 font-bold">
                            {row.us}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-center text-gray-600 font-medium">{row.others}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-16 sm:py-24 landing-gradient-cta relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl sm:text-2xl text-blue-50 mb-10 leading-relaxed">
            Join thousands of satisfied customers today and transform your banking experience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 w-full sm:w-auto text-lg px-10 py-7 font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
                Get Started Free
                <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto text-lg px-10 py-7 font-bold backdrop-blur-sm hover:scale-105 transition-all">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">FF</span>
              </div>
              <span className="font-bold text-2xl">{appName}</span>
            </Link>
            <p className="text-gray-400 mb-6">
              The future of banking is here. Experience secure, intelligent, and user-friendly financial services.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-gray-500 text-sm mt-6">© 2025 {appName}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
