import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle } from "lucide-react";
import server from "@/server"
import { toast } from "@/components/ui/use-toast";

export default function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const email = localStorage.getItem("pendingEmail");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return

        setLoading(true);
        try {
            const res = await fetch(`${server}/users/otp/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                toast({
                    title: "Invalid",
                    description: data.detail || "Invalid OTP. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error(err);
            toast({
                title: "Failed!",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            toast({
                title: "Failure!",
                description: "No email found. Please register again.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${server}/users/otp/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                toast({
                    title: "Sent!",
                    description: data.message || "OTP resent successfully!",
                    variant: "success",
                });
            } else {
                toast({
                    title: "Failure!",
                    description: data.detail || "Failed to resend OTP. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error(err);
            toast({
                title: "Error!",
                description: "Something went wrong while resending OTP.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen landing-gradient-hero flex items-center justify-center px-4">
            <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-2xl p-6 sm:p-8">
                <CardContent>
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 landing-gradient-primary rounded-2xl flex items-center justify-center shadow-lg mb-4">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
                            Verify Your Email
                        </h2>
                        <p className="text-gray-600 mt-2 text-center text-sm sm:text-base max-w-sm">
                            We’ve sent a 6-digit OTP to <span className="font-semibold text-blue-600">{email}</span>.
                            Enter it below to verify your account.
                        </p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="otp" className="block text-gray-700 font-medium mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    id="otp"
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="123456"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center text-lg tracking-widest"
                                    maxLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full landing-gradient-primary text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </Button>
                            <p className="text-sm text-center text-gray-500">
                                Didn’t receive the code?{" "}
                                <button
                                    type="button"
                                    className="text-blue-600 hover:underline font-medium"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </p>
                        </form>
                    ) : (
                        <div className="flex flex-col items-center space-y-4 animate-fade-in">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                            <h3 className="text-xl font-bold text-gray-900">Email Verified!</h3>
                            <p className="text-gray-600 text-center">
                                Your account has been successfully verified.
                                Redirecting to login page...
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
