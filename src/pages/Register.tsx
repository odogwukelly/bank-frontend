
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';
import server from "@/server";
import appName from '@/appName';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'password') calculatePasswordStrength(value as string);
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Invalid Password",
        description: "Passwords do not match!",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      password: formData.password,
    };

    setLoading(true);
    try {
      const registerRes = await fetch(`${server}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        toast({
          title: "Failed!",
          description: registerData.detail || "Registration failed",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const otpRes = await fetch(`${server}/users/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const otpData = await otpRes.json();

      if (otpRes.ok) {
        toast({
          title: "Success!",
          description: "Account created! Please check your email for the OTP code.",
          variant: "success",
        });
        localStorage.setItem("pendingEmail", formData.email);
        navigate("/verify-otp");
      } else {
        toast({
          title: "Failed!",
          description: otpData.detail || "Failed to send OTP email",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Failed!",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 via-indigo-800 to-green-600">
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_60%)] animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center text-white hover:text-blue-100 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <Card className="backdrop-blur-md bg-white/95 shadow-2xl border border-blue-100 rounded-2xl">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Create Account
            </CardTitle>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              Join {appName} and start banking smarter
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Password Strength:</span>
                    <span>{getPasswordStrengthText()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Terms */}
              <div className="space-y-2 text-sm text-gray-600">
                <label className="flex items-start space-x-2">
                  <Checkbox
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  />
                  <span>
                    I agree to the{" "}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="text-blue-600 underline hover:text-blue-700 transition">
                          Terms of Service
                        </button>
                      </DialogTrigger>

                      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 bg-white shadow-lg border border-gray-200">
                        <Tabs defaultValue="terms" className="w-full mt-2">
                          {/* Tabs List */}
                          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1">
                            <TabsTrigger
                              value="terms"
                              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 font-medium rounded-md transition"
                            >
                              Terms of Service
                            </TabsTrigger>
                            <TabsTrigger
                              value="privacy"
                              className="data-[state=active]:bg-white data-[state=active]:text-blue-700 font-medium rounded-md transition"
                            >
                              Privacy Policy
                            </TabsTrigger>
                          </TabsList>

                          {/* Terms of Service */}
                          <TabsContent
                            value="terms"
                            className="mt-4 space-y-4 text-sm text-gray-700 leading-relaxed"
                          >
                            <p>
                              Welcome to <span className="font-semibold">FirmFrontier Bank</span>. By creating an account
                              or using our banking services, you agree to be bound by these Terms of Service. Please read
                              them carefully before proceeding.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">1. Acceptance of Terms</h3>
                            <p>
                              By accessing our services, you confirm that you are at least 18 years old and legally capable
                              of entering into a binding agreement. If you disagree with any part of these terms, you must
                              discontinue use immediately.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">2. Account Registration</h3>
                            <p>
                              You must provide accurate and complete information during registration. You are solely
                              responsible for maintaining the confidentiality of your login credentials. FirmFrontier Bank
                              will not be held responsible for losses resulting from unauthorized account access.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">3. Banking Services</h3>
                            <p>
                              Our platform provides digital banking features including deposits, withdrawals, transfers,
                              and bill payments. All transactions are subject to verification and applicable regulations.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">4. Fees and Charges</h3>
                            <p>
                              Certain transactions may incur fees. You will be notified before any charge is applied. By
                              completing a transaction, you consent to all applicable service fees and taxes.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">5. Prohibited Activities</h3>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>Engaging in fraudulent or illegal transactions.</li>
                              <li>Using our platform for money laundering or terrorist financing.</li>
                              <li>Attempting to hack, reverse engineer, or disrupt our systems.</li>
                            </ul>

                            <h3 className="font-semibold text-lg mt-3">6. Limitation of Liability</h3>
                            <p>
                              FirmFrontier Bank shall not be held liable for indirect or consequential damages arising from
                              use or inability to use our services, including financial loss or data breaches.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">7. Suspension & Termination</h3>
                            <p>
                              We reserve the right to suspend or terminate your account if you violate these terms or engage
                              in activities compromising platform integrity.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">8. Updates to Terms</h3>
                            <p>
                              These Terms may be updated periodically. Continued use of our platform signifies acceptance of
                              any changes.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">9. Contact Us</h3>
                            <p>
                              For any questions, contact us at{" "}
                              <a href="mailto:support@firmfrontierbank.com" className="text-blue-600 underline">
                                support@firmfrontierbank.com
                              </a>
                              .
                            </p>
                          </TabsContent>

                          {/* Privacy Policy */}
                          <TabsContent
                            value="privacy"
                            className="mt-4 space-y-4 text-sm text-gray-700 leading-relaxed"
                          >
                            <p>
                              At <span className="font-semibold">FirmFrontier Bank</span>, your privacy is our top
                              priority. This Privacy Policy explains how we collect, use, and protect your information.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">1. Information We Collect</h3>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>Personal details (name, date of birth, email, phone number).</li>
                              <li>Financial data (account details, transaction records, balances).</li>
                              <li>Device data (IP address, browser type, device identifiers).</li>
                              <li>KYC verification documents.</li>
                            </ul>

                            <h3 className="font-semibold text-lg mt-3">2. How We Use Your Data</h3>
                            <p>
                              We use your information to operate securely, verify your identity, process transactions, and
                              comply with regulatory requirements.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">3. Data Sharing</h3>
                            <p>We do not sell your personal data. However, we may share it with:</p>
                            <ul className="list-disc pl-6 space-y-1">
                              <li>Regulatory authorities and financial institutions.</li>
                              <li>Third-party vendors providing essential services.</li>
                              <li>Law enforcement when required by law.</li>
                            </ul>

                            <h3 className="font-semibold text-lg mt-3">4. Data Security</h3>
                            <p>
                              We use encryption and secure storage protocols, but users must also safeguard their login
                              credentials.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">5. Your Rights</h3>
                            <p>
                              You may access, update, or delete your data at any time, and request withdrawal of consent for
                              certain uses.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">6. Cookies and Tracking</h3>
                            <p>
                              We use cookies to improve your experience. You may disable them in your browser settings, but
                              some features may not function properly.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">7. Updates to Policy</h3>
                            <p>
                              Updates to this policy will be communicated through our platform or email notifications.
                            </p>

                            <h3 className="font-semibold text-lg mt-3">8. Contact Us</h3>
                            <p>
                              For inquiries, contact{" "}
                              <a href="mailto:info@firmfrontierbank.com" className="text-blue-600 underline">
                                info@firmfrontierbank.com
                              </a>
                              .
                            </p>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>

                  </span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={!formData.agreeToTerms || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-gray-600">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-white/80 text-sm">
          🔒 Your information is protected with bank-level security
        </p>
      </motion.div>
    </div>
  );
}
