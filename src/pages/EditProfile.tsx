
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Bell,
    Eye,
    EyeOff,
    Camera,
    Save,
    Edit,
    ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import server from '@/server';
import { toast } from '@/components/ui/use-toast';
import { useUserData } from '@/hooks/userData';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OverlayLoader from '@/components/OverlayLoader';
import Loader from '@/components/Loader';

export default function EditProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const { user_id } = useParams();
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        role: "",
        created_at: "",
        password: ""
    });


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = user_id;
                if (!userId) return;
                const accountRes = await fetch(`${server}/users/get/${userId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!accountRes.ok) {
                    throw new Error("Failed to fetch account data");
                }

                const accountData = await accountRes.json();
                const user = accountData.userData;


                setProfile({
                    firstName: user.firstName
                        ? user.firstName[0].toUpperCase() + user.firstName.slice(1).toLowerCase()
                        : "",
                    lastName: user.lastName
                        ? user.lastName[0].toUpperCase() + user.lastName.slice(1).toLowerCase()
                        : "",
                    email: user.email,
                    phone: user.mobile,
                    address: user.address,
                    dateOfBirth: user.dob
                        ? new Date(user.dob).toLocaleDateString('en-CA')
                        : "",
                    created_at: user.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-CA')
                        : "",
                    role: user.isAdmin ? "admin" : "user",
                    password: user.hashedPassword
                });


            } catch (error) {
                console.error("Error fetching account data:", error);
            } finally{
                setLoading(false)
            }
        };

        fetchUserData();
    }, [user_id]);



    const handleSave = async () => {
        setSaving(true)
        try {
            const payload = {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                isAdmin: profile.role === "admin" ? true : false,
                mobile: profile.phone,
                address: profile.address,
                hashedPassword: profile.password,
                dob: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString() : null,
                created_at: profile.created_at ? new Date(profile.created_at).toISOString() : null
            };

            const res = await fetch(`${server}/users/update/${user_id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const err = await res.json();
                toast({
                    title: "Update failed",
                    description: err.detail || "Try again",
                    variant: "destructive",
                });
                return;
            }

            const updatedUser = await res.json();

            // ✅ Merge with old user data to preserve the id and other required fields
            //   const oldUserData = JSON.parse(localStorage.getItem("userData")) || {};
            //   const mergedUser = { ...oldUserData, ...updatedUser };

            //   localStorage.setItem("userData", JSON.stringify(mergedUser));
            setIsEditing(false);
            setSaving(false)
            toast({
                title: "Success",
                description: "Profile updated successfully!",
                variant: "success",
            });
        } catch (error) {
            toast({
                title: "Network error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <DashboardLayout>
                <Loader message="Loading..." size="h-96" color="blue-500" />
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout>
            {saving && <OverlayLoader message="Saving..." color="red-500" />}

            <div className="space-y-4 sm:space-y-6">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin-user-details/${user_id}`)}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                {/* Header */}
                <div className="flex flex-col space-y-3 sm:space-y-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit User Profile</h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage this user account information</p>
                    </div>
                    <div className="flex space-x-2 sm:space-x-3">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" size="sm">
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Profile Details */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center text-lg sm:text-xl">
                                    <User className="h-5 w-5 mr-2" />
                                    Edit User Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={profile.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            disabled={!isEditing}
                                            className="text-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={profile.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            disabled={!isEditing}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="role" className="text-sm sm:text-base">User Role</Label>
                                        <Select value={profile.role} onValueChange={(value) =>
                                            setProfile({ ...profile, role: value })}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Select user role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="created_at" className="flex items-center mt-2">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Join Date
                                        </Label>
                                        <Input
                                            id="created_at"
                                            type="date"
                                            value={profile.created_at}
                                            onChange={(e) => handleInputChange('created_at', e.target.value)}
                                            disabled={!isEditing}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center mt-2">
                                            <Mail className="h-4 w-4 mr-2" />
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            disabled={!isEditing}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            value={profile.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            disabled={!isEditing}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>

                                {/* phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={profile.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        disabled={!isEditing}
                                        className="text-sm"
                                    />
                                </div>

                                {/* Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="address" className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        Address
                                    </Label>
                                    <Input
                                        id="address"
                                        value={profile.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        disabled={!isEditing}
                                        className="text-sm"
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth" className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Date of Birth
                                    </Label>
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={profile.dateOfBirth}
                                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                        disabled={!isEditing}
                                        className="text-sm"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
