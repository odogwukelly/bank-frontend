
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import server from '@/server';
import { toast } from '@/components/ui/use-toast';
import { useUserData } from '@/hooks/userData';
import Loader from '@/components/Loader';
import OverlayLoader from '@/components/OverlayLoader';
import imageCompression from 'browser-image-compression';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });
  const navigate = useNavigate();
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    joinDate: "",
    accountNumber: '****1234',
    accountType: 'Premium',
    status: "",
    profileUrl: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = storedData?.id;
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
        const userAccount = accountData.userAccount || [];

        setProfile({
          firstName: user.firstName
            ? user.firstName[0].toUpperCase() + user.firstName.slice(1).toLowerCase()
            : "",
          lastName: user.lastName
            ? user.lastName[0].toUpperCase() + user.lastName.slice(1).toLowerCase()
            : "",
          email: user.email,
          phone: user.mobile || " ",
          address: user.address || " ",
          dateOfBirth: user.dob
            ? new Date(user.dob).toLocaleDateString('en-CA')
            : "",
          joinDate: user.created_at,
          accountNumber: userAccount[0]?.accountNumber || "No Account Yet",
          accountType: userAccount[0]
            ? userAccount[0].accountType[0].toUpperCase() + userAccount[0].accountType.slice(1).toLowerCase()
            : "No Account Yet",
          status: user.isEmailVerified ? "Email Verified" : "Verify Email",
          profileUrl: user.profileUrl,
        });
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchUserData();
  }, [storedData?.id]);

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        mobile: profile.phone,
        address: profile.address,
        dob: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString() : null,
      };
      const res = await fetch(`${server}/users/update/${storedData.id}`, {
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
      // Merge with old user data to preserve the id and other required fields
      const oldUserData = JSON.parse(localStorage.getItem("userData")) || {};
      const mergedUser = { ...oldUserData, ...updatedUser };
      localStorage.setItem("userData", JSON.stringify(mergedUser));

      // for file upload
      // if (selectedFile) {
      //   const formData = new FormData();
      //   formData.append("file", selectedFile);

      //   const uploadRes = await fetch(`${server}/users/upload-profile/${storedData.id}`, {
      //     method: "PUT",
      //     body: formData,
      //   });

      //   if (!uploadRes.ok) {
      //     toast({
      //       title: "Image upload failed",
      //       description: "Profile details were saved, but the image failed to upload.",
      //       variant: "destructive",
      //     });
      //   } else {
      //     const data = await uploadRes.json();
      //     setProfile(prev => ({ ...prev, profileUrl: data.profileUrl }));
      //   }
      // }

      if (selectedFile) {
        try {
          // ✅ Compress before upload
          const options = {
            maxSizeMB: 2,            // Limit image size to 2MB
            maxWidthOrHeight: 800,   // Resize large images to 800px
            useWebWorker: true,
          };
          const compressedFile = await imageCompression(selectedFile, options);

          const formData = new FormData();
          formData.append("file", compressedFile);

          const uploadRes = await fetch(`${server}/users/upload-profile/${storedData.id}`, {
            method: "PUT",
            body: formData,
          });

          if (!uploadRes.ok) {
            toast({
              title: "Image upload failed",
              description: "Profile details were saved, but the image failed to upload.",
              variant: "destructive",
            });
          } else {
            const data = await uploadRes.json();
            setProfile((prev) => ({ ...prev, profileUrl: data.image_url }));

            // Update user in localStorage to reflect new image URL
            const updatedUser = { ...JSON.parse(localStorage.getItem("userData")), profileUrl: data.image_url };
            localStorage.setItem("userData", JSON.stringify(updatedUser));
          }
        } catch (err) {
          toast({
            title: "Image compression failed",
            description: err.message,
            variant: "destructive",
          });
        }
      }

      setIsEditing(false);
     
      window.location.reload()

    } catch (error) {
      toast({
        title: "Network error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false)
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  const verifyEmail = async () => {
    const otpRes = await fetch(`${server}/users/otp/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: storedData.email }),
    });

    const otpData = await otpRes.json();

    if (otpRes.ok) {
      // alert("Account created! Please check your email for the OTP code.");
      toast({
        title: "Success",
        description: "Please check your email for the OTP code.",
        variant: "success",
      });
      // ✅ Optionally save email for verify page
      localStorage.setItem("pendingEmail", storedData.email);
      navigate("/verify-otp");
    } else {
      toast({
        title: "Failed!",
        description: otpData.detail || "Network Error",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant preview
    const imageUrl = URL.createObjectURL(file);
    setProfile(prev => ({ ...prev, profileUrl: imageUrl }));

    // Store file for later upload
    setSelectedFile(file);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading..." size="h-96" color="blue-500" />
      </DashboardLayout>
    );
  }


  return (
    // <DashboardLayout>
    //   {saving && <OverlayLoader message="Saving..." color="red-500" />}
    //   <div className="space-y-4 sm:space-y-6">
    //     {/* Header */}
    //     <div className="flex flex-col space-y-3 sm:space-y-4 sm:flex-row sm:items-center sm:justify-between">
    //       <div>
    //         <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
    //         <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your account information and preferences</p>
    //       </div>
    //       <div className="flex space-x-2 sm:space-x-3">
    //         {isEditing ? (
    //           <>
    //             <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
    //               Cancel
    //             </Button>
    //             <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" size="sm">
    //               <Save className="h-4 w-4 mr-2" />
    //               Save Changes
    //             </Button>
    //           </>
    //         ) : (
    //           <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700" size="sm">
    //             <Edit className="h-4 w-4 mr-2" />
    //             Edit Profile
    //           </Button>
    //         )}
    //       </div>
    //     </div>

    //     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
    //       {/* Profile Overview */}
    //       <div className="lg:col-span-1 space-y-4 sm:space-y-6">
    //         <Card>
    //           <CardContent className="p-4 sm:p-6">
    //             <div className="flex flex-col items-center text-center">
    //               <div className="relative">
    //                 <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
    //                   <AvatarImage
    //                     src={profile?.profileUrl || "/placeholder.svg"}
    //                     alt={`${profile.firstName} ${profile.lastName}`}
    //                     className="object-cover"
    //                   />
    //                   <AvatarFallback className="text-lg sm:text-xl">
    //                     {profile?.firstName?.[0]?.toUpperCase() || ""}
    //                     {profile?.lastName?.[0]?.toUpperCase() || ""}
    //                   </AvatarFallback>
    //                 </Avatar>

    //                 {isEditing && (
    //                   <>
    //                     {/* Hidden file input */}
    //                     <input
    //                       type="file"
    //                       accept="image/*"
    //                       ref={fileInputRef}
    //                       onChange={handleFileChange}
    //                       style={{ display: "none" }}
    //                     />

    //                     {/* Camera button */}
    //                     <Button
    //                       size="sm"
    //                       className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
    //                       onClick={() => fileInputRef.current?.click()}
    //                     >
    //                       <Camera className="h-4 w-4" />
    //                     </Button>
    //                   </>
    //                 )}


    //                 {/* {isEditing && (
    //                   <Button
    //                     size="sm"
    //                     className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
    //                   >
    //                     <Camera className="h-4 w-4" />
    //                   </Button>
    //                 )} */}
    //               </div>
    //               <h3 className="text-lg sm:text-xl font-semibold mt-4">
    //                 {profile.firstName} {profile.lastName}
    //               </h3>
    //               <p className="text-gray-600 text-sm">{profile.email}</p>
    //               <div className="flex items-center space-x-2 mt-3">
    //                 {profile.status === "Email Verified" ? (
    //                   <Badge className="bg-green-100 text-green-800">
    //                     {profile.status}
    //                   </Badge>
    //                 ) : (
    //                   <button
    //                     onClick={verifyEmail}>
    //                     <Badge className="bg-red-100 text-red-800">
    //                       {profile.status}
    //                     </Badge>
    //                   </button>
    //                 )}
    //                 {profile.accountType === "No Account Yet" ? (
    //                   <Badge variant="destructive">
    //                     {profile.accountType}
    //                   </Badge>
    //                 ) : (
    //                   <Badge variant="secondary">
    //                     {profile.accountType}
    //                   </Badge>
    //                 )}

    //               </div>
    //             </div>
    //           </CardContent>
    //         </Card>

    //         {/* Account Summary */}
    //         <Card>
    //           <CardHeader className="pb-3">
    //             <CardTitle className="text-lg">Account Summary</CardTitle>
    //           </CardHeader>
    //           <CardContent className="space-y-3">
    //             <div className="flex justify-between items-center">
    //               <span className="text-sm text-gray-600">Account Number</span>
    //               <div className="flex items-center space-x-2">
    //                 <span className="text-sm font-medium">
    //                   {showAccountNumber ? profile.accountNumber : "****" + profile.accountNumber.slice(-4)}
    //                 </span>
    //                 <Button
    //                   variant="ghost"
    //                   size="sm"
    //                   className="h-6 w-6 p-0"
    //                   onClick={() => setShowAccountNumber(!showAccountNumber)}
    //                 >
    //                   {showAccountNumber ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
    //                 </Button>
    //               </div>
    //             </div>
    //             <div className="flex justify-between items-center">
    //               <span className="text-sm text-gray-600">Member Since</span>
    //               <span className="text-sm font-medium">{new Date(profile.joinDate).toLocaleDateString()}</span>
    //             </div>
    //             <div className="flex justify-between items-center">
    //               <span className="text-sm text-gray-600">Account Type</span>
    //               <span className="text-sm font-medium">{profile.accountType}</span>
    //             </div>
    //           </CardContent>
    //         </Card>
    //       </div>

    //       {/* Profile Details */}
    //       <div className="lg:col-span-2 space-y-4 sm:space-y-6">
    //         {/* Personal Information */}
    //         <Card>
    //           <CardHeader>
    //             <CardTitle className="flex items-center text-lg sm:text-xl">
    //               <User className="h-5 w-5 mr-2" />
    //               Personal Information
    //             </CardTitle>
    //           </CardHeader>
    //           <CardContent className="space-y-4">
    //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    //               <div className="space-y-2">
    //                 <Label htmlFor="firstName">First Name</Label>
    //                 <Input
    //                   id="firstName"
    //                   value={profile.firstName}
    //                   onChange={(e) => handleInputChange('firstName', e.target.value)}
    //                   disabled={!isEditing}
    //                   className="text-sm"
    //                 />
    //               </div>
    //               <div className="space-y-2">
    //                 <Label htmlFor="lastName">Last Name</Label>
    //                 <Input
    //                   id="lastName"
    //                   value={profile.lastName}
    //                   onChange={(e) => handleInputChange('lastName', e.target.value)}
    //                   disabled={!isEditing}
    //                   className="text-sm"
    //                 />
    //               </div>
    //             </div>

    //             <div className="space-y-2">
    //               <Label htmlFor="email" className="flex items-center">
    //                 <Mail className="h-4 w-4 mr-2" />
    //                 Email Address
    //               </Label>
    //               <Input
    //                 id="email"
    //                 type="email"
    //                 value={profile.email}
    //                 onChange={(e) => handleInputChange('email', e.target.value)}
    //                 disabled={!isEditing}
    //                 className="text-sm"
    //               />
    //             </div>

    //             {/* Checks on phone */}
    //             {profile.phone === " " ? (
    //               <div className="space-y-2">
    //                 <Label htmlFor="phone" className="flex items-center">
    //                   <Phone className="h-4 w-4 mr-2" />
    //                   Phone Number
    //                 </Label>
    //                 <Input
    //                   id="phone"
    //                   value={"Add Mobile Number"}
    //                   onChange={(e) => handleInputChange('phone', e.target.value)}
    //                   disabled={!isEditing}
    //                   className="text-sm text-red-600 border border-red-600 "
    //                 />
    //               </div>
    //             ) : (
    //               <div className="space-y-2">
    //                 <Label htmlFor="phone" className="flex items-center">
    //                   <Phone className="h-4 w-4 mr-2" />
    //                   Phone Number
    //                 </Label>
    //                 <Input
    //                   id="phone"
    //                   value={profile.phone}
    //                   onChange={(e) => handleInputChange('phone', e.target.value)}
    //                   disabled={!isEditing}
    //                   className="text-sm"
    //                 />
    //               </div>
    //             )}

    //             {/* Checks on Address */}
    //             {profile.address === " " ? (
    //               <div className="space-y-2">
    //                 <Label htmlFor="address" className="flex items-center">
    //                   <MapPin className="h-4 w-4 mr-2" />
    //                   Address
    //                 </Label>
    //                 <Input
    //                   id="address"
    //                   value={"Add Address"}
    //                   onChange={(e) => handleInputChange('address', e.target.value)}
    //                   disabled={!isEditing}
    //                   className="text-sm text-red-600 border border-red-600"
    //                 />
    //               </div>
    //             ) : (<div className="space-y-2">
    //               <Label htmlFor="address" className="flex items-center">
    //                 <MapPin className="h-4 w-4 mr-2" />
    //                 Address
    //               </Label>
    //               <Input
    //                 id="address"
    //                 value={profile.address}
    //                 onChange={(e) => handleInputChange('address', e.target.value)}
    //                 disabled={!isEditing}
    //                 className="text-sm"
    //               />
    //             </div>)}

    //             {/* Checks on Date of Birth */}
    //             {!profile.dateOfBirth ? (
    //               <div className="space-y-2">
    //                 <Label htmlFor="dateOfBirth" className="flex items-center">
    //                   <Calendar className="h-4 w-4 mr-2" />
    //                   Date of Birth
    //                 </Label>
    //                 <Input
    //                   id="dateOfBirth"
    //                   type="date"
    //                   value={""}
    //                   onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
    //                   disabled={!isEditing}
    //                   placeholder="DD/MM/YYYY"
    //                   className="text-sm text-red-600 border border-red-600"
    //                 />
    //               </div>
    //             ) : (
    //               <div className="space-y-2">
    //                 <Label htmlFor="dateOfBirth" className="flex items-center">
    //                   <Calendar className="h-4 w-4 mr-2" />
    //                   Date of Birth
    //                 </Label>
    //                 <Input
    //                   id="dateOfBirth"
    //                   type="date"
    //                   value={profile.dateOfBirth || ""}
    //                   onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
    //                   disabled={!isEditing}
    //                   className="text-sm"
    //                 />
    //               </div>
    //             )}
    //           </CardContent>
    //         </Card>



    //         {/* Notification Preferences */}
    //         <Card>
    //           <CardHeader>
    //             <CardTitle className="flex items-center text-lg sm:text-xl">
    //               <Bell className="h-5 w-5 mr-2" />
    //               Notification Preferences
    //             </CardTitle>
    //           </CardHeader>
    //           <CardContent className="space-y-4">
    //             <div className="flex items-center justify-between">
    //               <div>
    //                 <p className="font-medium text-sm">Email Notifications</p>
    //                 <p className="text-xs text-gray-600">Receive account updates via email</p>
    //               </div>
    //               <Switch
    //                 checked={notifications.email}
    //                 onCheckedChange={(checked) => handleNotificationChange('email', checked)}
    //               />
    //             </div>

    //             <div className="flex items-center justify-between">
    //               <div>
    //                 <p className="font-medium text-sm">SMS Notifications</p>
    //                 <p className="text-xs text-gray-600">Receive alerts via text message</p>
    //               </div>
    //               <Switch
    //                 checked={notifications.sms}
    //                 onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
    //               />
    //             </div>

    //             <div className="flex items-center justify-between">
    //               <div>
    //                 <p className="font-medium text-sm">Push Notifications</p>
    //                 <p className="text-xs text-gray-600">Receive browser notifications</p>
    //               </div>
    //               <Switch
    //                 checked={notifications.push}
    //                 onCheckedChange={(checked) => handleNotificationChange('push', checked)}
    //               />
    //             </div>

    //             <div className="flex items-center justify-between">
    //               <div>
    //                 <p className="font-medium text-sm">Marketing Communications</p>
    //                 <p className="text-xs text-gray-600">Receive promotional offers and updates</p>
    //               </div>
    //               <Switch
    //                 checked={notifications.marketing}
    //                 onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
    //               />
    //             </div>
    //           </CardContent>
    //         </Card>
    //       </div>
    //     </div>
    //   </div>
    // </DashboardLayout>

    <DashboardLayout>
  {saving && <OverlayLoader message="Saving..." color="red-500" />}
  <div className="space-y-4 sm:space-y-6 bg-white dark:bg-gradient-to-br dark:from-black dark:via-blue-950 dark:to-green-950 min-h-screen transition-colors duration-500">
    {/* Header */}
    <div className="flex flex-col space-y-3 sm:space-y-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-blue-200">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-blue-300 mt-1 text-sm sm:text-base">
          Manage your account information and preferences
        </p>
      </div>
      <div className="flex space-x-2 sm:space-x-3">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              size="sm"
              className="dark:border-blue-900/50 dark:text-blue-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200 transition-all duration-300"
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200 transition-all duration-300"
            size="sm"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Profile Overview */}
      <div className="lg:col-span-1 space-y-4 sm:space-y-6">
        <Card className="dark:bg-black/40 dark:border-blue-900/30 dark:shadow-md dark:shadow-blue-900/20 transition-all duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-2 ring-offset-2 dark:ring-blue-900/50 dark:ring-offset-black">
                  <AvatarImage
                    src={profile?.profileUrl || "/placeholder.svg"}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg sm:text-xl dark:text-blue-300">
                    {profile?.firstName?.[0]?.toUpperCase() || ""}
                    {profile?.lastName?.[0]?.toUpperCase() || ""}
                  </AvatarFallback>
                </Avatar>

                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 dark:bg-blue-900 dark:hover:bg-blue-800"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mt-4 dark:text-blue-200">
                {profile.firstName} {profile.lastName}
              </h3>
              <p className="text-gray-600 dark:text-blue-300 text-sm">
                {profile.email}
              </p>
              <div className="flex items-center space-x-2 mt-3">
                {profile.status === "Email Verified" ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                    {profile.status}
                  </Badge>
                ) : (
                  <button onClick={verifyEmail}>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                      {profile.status}
                    </Badge>
                  </button>
                )}
                {profile.accountType === "No Account Yet" ? (
                  <Badge variant="destructive" className="dark:bg-red-900/40 dark:text-red-300">
                    {profile.accountType}
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="dark:bg-blue-900/40 dark:text-blue-300"
                  >
                    {profile.accountType}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Summary */}
        <Card className="dark:bg-black/40 dark:border-blue-900/30 dark:shadow-md dark:shadow-blue-900/20 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg dark:text-blue-200">
              Account Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-blue-300">
                Account Number
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium dark:text-blue-200">
                  {showAccountNumber
                    ? profile.accountNumber
                    : "****" + profile.accountNumber.slice(-4)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 dark:text-blue-300"
                  onClick={() => setShowAccountNumber(!showAccountNumber)}
                >
                  {showAccountNumber ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-blue-300">
                Member Since
              </span>
              <span className="text-sm font-medium dark:text-blue-200">
                {new Date(profile.joinDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-blue-300">
                Account Type
              </span>
              <span className="text-sm font-medium dark:text-blue-200">
                {profile.accountType}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Details */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        {/* Personal Information */}
        <Card className="dark:bg-black/40 dark:border-blue-900/30 dark:shadow-md dark:shadow-blue-900/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl dark:text-blue-200">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 dark:text-blue-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={!isEditing}
                  className="text-sm dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={!isEditing}
                  className="text-sm dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className="text-sm dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone"
                value={
                  profile.phone.trim() === ""
                    ? "Add Mobile Number"
                    : profile.phone
                }
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                className={`text-sm ${
                  profile.phone.trim() === ""
                    ? "text-red-600 border border-red-600 dark:text-red-400 dark:border-red-700"
                    : "dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-200"
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Address
              </Label>
              <Input
                id="address"
                value={
                  profile.address.trim() === "" ? "Add Address" : profile.address
                }
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!isEditing}
                className={`text-sm ${
                  profile.address.trim() === ""
                    ? "text-red-600 border border-red-600 dark:text-red-400 dark:border-red-700"
                    : "dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-200"
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Date of Birth
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={profile.dateOfBirth || ""}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                disabled={!isEditing}
                className={`text-sm ${
                  !profile.dateOfBirth
                    ? "text-red-600 border border-red-600 dark:text-red-400 dark:border-red-700"
                    : "dark:bg-blue-950/40 dark:border-blue-900/50 dark:text-blue-200"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="dark:bg-black/40 dark:border-blue-900/30 dark:shadow-md dark:shadow-blue-900/20 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-lg sm:text-xl dark:text-blue-200">
              <Bell className="h-5 w-5 mr-2" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 dark:text-blue-200">
            {[
              {
                label: "Email Notifications",
                desc: "Receive account updates via email",
                key: "email",
              },
              {
                label: "SMS Notifications",
                desc: "Receive alerts via text message",
                key: "sms",
              },
              {
                label: "Push Notifications",
                desc: "Receive browser notifications",
                key: "push",
              },
              {
                label: "Marketing Communications",
                desc: "Receive promotional offers and updates",
                key: "marketing",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between hover:bg-blue-950/20 p-2 rounded-lg transition-all duration-300"
              >
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-gray-600 dark:text-blue-300">
                    {item.desc}
                  </p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(checked) =>
                    handleNotificationChange(item.key, checked)
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</DashboardLayout>

  );
}


