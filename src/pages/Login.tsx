import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import server from "@/server";
import { toast } from "@/components/ui/use-toast";
import appName from "@/appName";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { email, password };

    try {
      const res = await fetch(`${server}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }
        if (data.userData) {
          localStorage.setItem("userData", JSON.stringify(data.userData));
        }
        if (data.userAccount) {
          localStorage.setItem("userAccount", JSON.stringify(data.userAccount));
        }

        toast({
          title: "Login Successful",
          variant: "success",
          description: data.userData?.isAdmin
            ? "Welcome back, Admin!"
            : "Welcome to your dashboard!",
        });

        navigate(data.userData?.isAdmin ? "/admin" : "/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: data.detail || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Network Error",
        description: "Please check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 🌀 Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-600 to-indigo-500 dark:from-gray-900 dark:via-gray-800 dark:to-black animate-gradient-x"></div>

      {/* 🌟 Floating Light Glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-500/20 blur-3xl rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>

      {/* 💫 Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-sm sm:max-w-md p-4"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-green-400 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-white font-extrabold text-2xl">FB</span>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-gray-100">
            Welcome Back
          </h1>
          <p className="text-gray-200 mt-2 text-sm sm:text-base">
            Sign in to your {appName} account
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl text-gray-100">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-lg sm:text-xl text-white dark:text-gray-100">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 bg-white/20 border-gray-500/30 focus:ring-2 focus:ring-blue-400 text-white placeholder-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-white/20 border-gray-500/30 focus:ring-2 focus:ring-green-400 text-white placeholder-gray-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                  />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-500 to-green-500 hover:from-blue-700 hover:to-green-600 text-sm font-semibold shadow-lg transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center text-sm mt-3 text-gray-300">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-green-400 hover:text-green-300 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


