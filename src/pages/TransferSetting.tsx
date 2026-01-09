import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Phone, Mail, Clock, Send, HelpCircle, ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import server from '@/server';
import Loader from '@/components/Loader';

export default function TransferSetting() {
    const [loading, setLoading] = useState(true);
    const [updateTransferSetting, setUpdateTransferSetting] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        reviewDuration: '',
        message: '',
        transferOTP: ""
    });
    const { user_id } = useParams()


    useEffect(() => {
        const fetchUserById = async () => {
            try {
                const res = await fetch(`${server}/users/get/${user_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) throw new Error("Failed to fetch accounts");

                const data = await res.json();

                // ✅ Update state and local storage with the latest user data
                setFormData({
                    ...formData,
                    message: data.userData.errorMsg,
                    transferOTP: data.userData.transferOTP,
                    reviewDuration: data.userData.reviewDuration
                });
            } catch (err) {
                console.error("❌ Error fetching accounts:", err);

            } finally {
                setLoading(false)
            }

        }
        fetchUserById()
    }, []);





    const handleSubmit = async () => {
        setUpdateTransferSetting(true)
        try {
            const payload = {
                transferOTP: formData.transferOTP,
                errorMsg: formData.message
            }
            const res = await fetch(`${server}/users/update/${user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                toast({
                    title: "Settings failed",
                    description: err.detail || "Try again",
                    variant: "destructive",
                });
                return;
            }


            toast({
                title: "Success",
                description: "Transfer settings updated successfully!",
                variant: "success",
            });


        } catch (error) {
            toast({
                title: "Network error",
                description: error.message,
                variant: "destructive",
            })
        }finally{
            setUpdateTransferSetting(false)
        }
    };


    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const navigate = useNavigate()



    if (loading) {
        return (
            <DashboardLayout>
                <Loader message="Loading..." size="h-96" color="blue-500" />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin-user-details/${user_id}`)}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Transfer Settings</h1>
                </div>

                {/* Contact Form */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">Grant transfer permission</CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                                Control how users make transfer on this platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>

                            <div className="space-y-4 sm:space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="reviewDuration">Review Duration </Label>
                                    <Input
                                        id="reviewDuration"
                                        type="text"
                                        placeholder='e.g ( 24 hours, 1 week )'
                                        value={formData.reviewDuration}
                                        // onChange={(e) => setFormData({ ...formData, reviewDuration: e.target.value })}
                                        onChange={(e) => handleInputChange('reviewDuration', e.target.value)}

                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="initialDeposit">Transfer OTP</Label>

                                    <Input
                                        id="transferOTP"
                                        type="text"
                                        placeholder="6 digit required"
                                        value={formData.transferOTP}
                                        onChange={(e) => handleInputChange('transferOTP', e.target.value)}
                                        maxLength={6}
                                    />
                                    <div className=""><small className='text-gray-500'><span className='text-black'>Required:</span> Six (6) digit</small></div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-xs sm:text-sm">Transfer Error Message</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Describe why transaction failed..."
                                        value={formData.message}
                                        // onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        onChange={(e) => handleInputChange('message', e.target.value)}

                                        rows={6}
                                        className="text-sm resize-none"
                                    />
                                </div>

                                <Button type="submit" className="w-full sm:w-auto text-sm sm:text-base"
                                    onClick={handleSubmit}>
                                    {updateTransferSetting ? (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                {/* Spinner */}
                                                <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                                                {/* Text */}
                                                <span className="text-sm sm:text-base font-medium text-gray-200 animate-pulse">
                                                    Updating...
                                                </span>
                                            </div>

                                        </>
                                    ) : ("Done")}

                                </Button>
                            </div>
                        </CardContent>
                    </Card>


                </div>
            </div>
        </DashboardLayout>
    );
}
