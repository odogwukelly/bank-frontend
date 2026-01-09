import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import server from "@/server";
import { toast } from "@/hooks/use-toast";


export default function AdminReplyEmail() {
    const [form, setForm] = useState({
        to: "",
        full_name: "",
        subject: "",
        message: "",
    });
    const API_URL = server

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.to || !form.message) {
            alert("Recipient email and message are required");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/users/send-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            console.log("Response:", res.status, data);

            if (!res.ok) {
                throw new Error(data.detail || "Failed to create account");
            }

            toast({
                title: "Email Sent!",
                description:"Email sent successfully",
                variant: "success"
            });

            // Reset form
            setForm({
                to: "",
                full_name: "",
                subject: "",
                message: "",
            });
        } catch (error) {
            alert(
                error.response?.data?.detail ||
                "Failed to send email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-3xl"
                >
                    <Card className="rounded-2xl shadow-2xl border border-blue-100">
                        <CardContent className="p-6 sm:p-8 space-y-6">
                            {/* Header */}
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-blue-600 text-white">
                                    <Mail size={22} />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                        Reply to Customer
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Send a professional response directly to the customer
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Customer Email
                                    </label>
                                    <Input
                                        name="to"
                                        placeholder="customer@email.com"
                                        value={form.to}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Customer Full Name
                                    </label>
                                    <Input
                                        name="full_name"
                                        placeholder="John Doe"
                                        value={form.full_name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Subject
                                    </label>
                                    <Input
                                        name="subject"
                                        placeholder="Re: Your inquiry"
                                        value={form.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Message
                                    </label>
                                    <Textarea
                                        name="message"
                                        rows={7}
                                        placeholder="Type your reply here..."
                                        value={form.message}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-lg"
                                >
                                    <Send size={16} />
                                    {loading ? "Sending..." : "Send Mail"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
