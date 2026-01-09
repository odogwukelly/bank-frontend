import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Smartphone, CreditCard, TrendingUp, Menu, Star, ChevronLeft, ChevronRight, Check, Lock, Users, Globe, Zap, Download, Bell, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HamburgerMenu } from '@/components/layout/HamburgerMenu';
import heroBanking from '@/assets/hero-banking.jpg';
import appMockup from '@/assets/app-mockup.jpg';
import securityFeature from '@/assets/security-feature.jpg';

import handleLogout from '@/components/logOut';
import appName from '@/appName';





export default function Landing() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate()

  const features = [
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your money and data are protected with enterprise-grade security and encryption.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Banking',
      description: 'Access your accounts anytime, anywhere with our intuitive mobile app.'
    },
    {
      icon: CreditCard,
      title: 'Digital Payments',
      description: 'Send and receive money instantly with our fast digital payment system.'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Track your spending and savings with intelligent financial insights.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      content: `${appName} has revolutionized how I manage my business finances. The analytics are incredible!`,
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Freelancer',
      content: 'The mobile app is so intuitive. I can transfer money and pay bills on the go.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Marketing Manager',
      content: 'Best banking experience I\'ve ever had. The security features give me peace of mind.',
      rating: 5
    }
  ];

  const partners = [
    'Visa', 'Mastercard', 'PayPal', 'Stripe', 'Plaid', 'Zelle'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-100 fixed w-full top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 landing-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <span className="text-white font-bold text-lg">FF</span>
              </div>
              <span className="font-bold text-2xl text-gray-900 landing-text-gradient">{appName}</span>
            </div>

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
      <section className="pt-16 landing-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-28 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold animate-fade-in">
                🚀 Join 50,000+ satisfied customers
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                Banking Made
                <br />
                <span className="landing-text-gradient">Simple & Secure</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
                Experience the future of banking with our secure, intelligent platform.
                Manage your finances effortlessly with cutting-edge technology.
              </p>
              <div className="flex flex-col sm:flex-row lg:justify-start justify-center items-center gap-4">
                 {token ? (
                  <>
                  <Link to="/dashboard">
                  <Button size="lg" className="landing-gradient-primary text-white hover:opacity-90 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto text-lg px-8 py-6">
                    Continue Banking
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                  </>

                 ):(
                  <>
                  <Link to="/register">
                  <Button size="lg" className="landing-gradient-primary text-white hover:opacity-90 shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto text-lg px-8 py-6">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                  </>

                 )}
                
                


                {/* <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-gray-50">
                  Watch Demo
                </Button> */}
              </div>
              {/* <p className="text-sm text-gray-500 mt-6">No credit card required • Free forever</p> */}
            </div>
            <div className="relative">
              <img
                src={heroBanking}
                alt="People using modern banking app"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold landing-text-gradient mb-2">50K+</div>
              <p className="text-sm sm:text-base text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold landing-text-gradient mb-2">$2B+</div>
              <p className="text-sm sm:text-base text-gray-600">Transactions</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold landing-text-gradient mb-2">150+</div>
              <p className="text-sm sm:text-base text-gray-600">Countries</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold landing-text-gradient mb-2">99.9%</div>
              <p className="text-sm sm:text-base text-gray-600">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-3">
              Everything you need for
              <span className="landing-text-gradient"> modern banking</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive suite of banking tools helps you manage your money with confidence and ease.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center landing-card-hover border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8 sm:p-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 landing-feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-3">
              Get started in <span className="landing-text-gradient">3 simple steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 landing-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl sm:text-3xl font-bold shadow-xl">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your account in minutes with just your email. No paperwork required.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 landing-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl sm:text-3xl font-bold shadow-xl">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Verify Identity</h3>
              <p className="text-gray-600 leading-relaxed">
                Quick and secure identity verification to keep your account safe.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 landing-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl sm:text-3xl font-bold shadow-xl">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Start Banking</h3>
              <p className="text-gray-600 leading-relaxed">
                Begin managing your money with our powerful tools and features.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      {/* <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              <img 
                src={appMockup} 
                alt="Mobile banking app interface" 
                className="w-64 sm:w-80 md:w-96 h-auto shadow-2xl rounded-3xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Mobile App</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-3">
                Bank anywhere, <span className="landing-text-gradient">anytime</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Download our mobile app and take control of your finances on the go. Available on iOS and Android.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Instant Access</h4>
                    <p className="text-gray-600 text-sm">Check balances and transactions in real-time</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bell className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Smart Notifications</h4>
                    <p className="text-gray-600 text-sm">Get alerts for important account activity</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Financial Insights</h4>
                    <p className="text-gray-600 text-sm">Track spending with detailed analytics</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="landing-gradient-primary text-white">
                  <Download className="mr-2 h-5 w-5" />
                  Download App
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Security Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Security First</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 mt-3">
                Your security is our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">top priority</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                We use industry-leading security measures to protect your money and personal information.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg">256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg">Two-factor authentication</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg">FDIC insured up to $250,000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-green-400 flex-shrink-0" />
                  <span className="text-lg">Real-time fraud detection</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={securityFeature}
                alt="Security and encryption technology"
                className="w-full max-w-md h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-3">
              Trusted by <span className="landing-text-gradient">thousands</span> of customers
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              See what our customers have to say about their {appName} experience.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 landing-glow">
              <CardContent className="p-8 sm:p-16 text-center">
                <div className="flex justify-center mb-6 sm:mb-8 gap-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl sm:text-2xl text-gray-700 mb-8 sm:mb-12 leading-relaxed font-medium">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div>
                  <p className="font-bold text-gray-900 text-lg sm:text-xl">{testimonials[currentTestimonial].name}</p>
                  <p className="text-gray-600 text-base sm:text-lg mt-1">{testimonials[currentTestimonial].role}</p>
                </div>
              </CardContent>
            </Card>

            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 sm:-translate-x-12 landing-gradient-primary text-white rounded-full p-3 sm:p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 sm:translate-x-12 landing-gradient-primary text-white rounded-full p-3 sm:p-4 shadow-xl hover:shadow-2xl transition-all hover:scale-110"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="flex justify-center mt-8 sm:mt-10 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'w-10 landing-gradient-primary' : 'w-3 bg-gray-300'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-10 sm:mb-12">
              Trusted by <span className="landing-text-gradient">leading financial partners</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-center">
              {partners.map((partner, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8 h-20 sm:h-24 flex items-center justify-center border border-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-blue-200">
                    <span className="text-gray-700 font-bold text-base sm:text-lg group-hover:text-blue-600 transition-colors">{partner}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-28 landing-gradient-cta relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-overlay filter blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Ready to transform
            <br />
            your banking experience?
          </h2>
          <p className="text-xl sm:text-2xl text-blue-50 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers and experience the future of banking today.
          </p>
          {token ? (
          <>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <Link to="/dashboard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 w-full sm:w-auto text-lg px-10 py-7 font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
                Continue Banking Today
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Button onClick={()=> navigate("/dashboard")} size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto text-lg px-10 py-7 font-bold backdrop-blur-sm hover:scale-105 transition-all">
              Contact Sales
            </Button>
          </div>
          </>
          ):(
          <>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6">
            <Link to="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-50 w-full sm:w-auto text-lg px-10 py-7 font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105">
                Start Banking Today
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto text-lg px-10 py-7 font-bold backdrop-blur-sm hover:scale-105 transition-all">
              Contact Sales
            </Button>
          </div>
          </>
        )}

          

          <div className="mt-10 flex items-center justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

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


