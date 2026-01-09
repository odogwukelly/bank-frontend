import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Phone, Mail, Clock, Send, HelpCircle } from 'lucide-react';
import server from '@/server';

export default function ContactSupport() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
    email: '',
    phone: ''
  });
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async () => {
    setProcessing(true)
    try {
      const payload = {
        userID: userData.id,
        email: formData.email,
        category: formData.category,
        subject: formData.subject,
        mobile: formData.phone,
        message: formData.message
      }
      const res = await fetch(`${server}/users/create/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({
          title: "failed to contact support",
          description: err.detail || "Try again",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Support Request Submitted",
        description: "We'll get back to you within 24 hours.",
        variant: "success",
      });

      setTimeout(() => {
        window.location.reload();
      }, 2500);


    } catch (error) {
      toast({
        title: "Network error",
        description: error.message,
        variant: "destructive",
      });
    } finally{
      setProcessing(false)
    }
  };



  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Support</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Get help with your account or ask questions
          </p>
        </div>

        {/* Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Submit a Support Request</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Fill out the form below and our team will respond as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs sm:text-sm">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category" className="text-sm">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account Issues</SelectItem>
                      <SelectItem value="transaction">Transaction Problems</SelectItem>
                      <SelectItem value="security">Security Concerns</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs sm:text-sm">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs sm:text-sm">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="text-sm resize-none"
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full sm:w-auto text-sm sm:text-base"
                  disabled={!formData.email || !formData.category || !formData.subject || !formData.message}
                ><Send className="h-4 w-4 mr-2" />
                  {processing ? (
                    <>
                      <div className="flex items-center space-x-2">
                        {/* Spinner */}
                        <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                        {/* Text */}
                        <span className="text-sm sm:text-base font-medium text-gray-700 animate-pulse">
                          Processing...
                        </span>
                      </div>

                    </>
                  ) : ("Submit Request")}

                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
