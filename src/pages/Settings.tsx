import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { User, Bell, Shield, CreditCard, Globe, Moon, Smartphone, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import server from '@/server';
import Loader from '@/components/Loader';
import OverlayLoader from '@/components/OverlayLoader';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [resetingPin, setResetingPin] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [resetPinFormData, setResetPinFormData] = useState({
    pin: "",
    password: "",
    confirmPin: "",
  });
  const [security, setSecurity] = useState({
    twoFactor: true,
    biometric: false,
  });
  const navigate = useNavigate()
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const hashedPassword = storedData.hashedPassword
  const [accounts, setAccounts] = useState([{
    id: 0,
    name: "",
    type: "",
    balance: "",
    accountNumber: "",
    status: ""
  }]);


  const fetchUserData = async () => {
    try {
      const userId = storedData?.id;
      if (!userId) return;

      const accountRes = await fetch(`${server}/users/get/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!accountRes.ok) {
        throw new Error("Failed to fetch account data");
      }

      const accountData = await accountRes.json();

      // Since your backend returns { userData, userAccount }
      const accountsArray = accountData.userAccount || [];

      const formatted = accountsArray.map((acc) => ({
        id: acc.id,
        name: acc.accountType[0].toUpperCase() + acc.accountType.slice(1).toLowerCase(),
        type: acc.accountType,
        balance: acc.accountBalance,
        accountNumber: "****" + acc.accountNumber.slice(-4),
        status: acc.status ? "Active" : "Inactive",
      }));

      setAccounts(formatted);
    } catch (error) {
      console.error("Error fetching account data:", error);
      setAccounts([]);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchUserData()
  }, [])

  const handleDelete = async (account_id) => {
    if (window.confirm("Are you sure you want to proceed with deleting this account?")) {
      try {
        setDeleting(true)
        await fetch(`${server}/users/account/${account_id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });

        // toast({
        //   title: "Deleted",
        //   description: `Account deleted successfully.`,
        //   variant: "success"
        // });
        // setTimeout(() => {
          window.location.reload()
        // }, 2000);

      } catch (error) {
        console.error("Error deleting this user account", error);
        toast({
          title: "failed!",
          description: `Failed to delete account.`,
          variant: "destructive"
        });
      } finally {
        setDeleting(false)
      }
    }
  }

  const handleSubmit = async () => {
    setResetPassword(true)
    if (formData?.currentPassword !== hashedPassword) {
      toast({
        title: "Failed!",
        description: `Current password did not match saved password!.`,
        variant: "destructive"
      });
      setResetPassword(false)
    }

    if (formData?.password !== formData?.confirmPassword) {
      toast({
        title: "Failed!",
        description: `Password did not match confirm password!.`,
        variant: "destructive"
      });
      setResetPassword(false)
    }

    if (formData?.currentPassword === hashedPassword &&
      formData?.password === formData?.confirmPassword) {

      try {
        const payload = {
          hashedPassword: formData?.password
        };

        const loginPayload = {
          email: storedData?.email,
          password: formData?.password
        };

        const res = await fetch(`${server}/users/update/${storedData?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const loginRes = await fetch(`${server}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginPayload),
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

        const data = await loginRes.json();

        if (loginRes.ok) {
          // ✅ Save token & user data
          if (data.access_token) {
            localStorage.setItem("token", data?.access_token);
          }
          if (data.userData) {
            localStorage.setItem("userData", JSON.stringify(data?.userData));
          }
          if (data.userAccount) {
            localStorage.setItem("userAccount", JSON.stringify(data?.userAccount));
          }
        } else {
          toast({
            title: "Refresh login Failed",
            description: data?.detail || "Invalid credentials",
            variant: "destructive",
          });
        }
        // toast({
        //   title: "Success!",
        //   description: `Password Reset Successful.`,
        //   variant: "success"
        // });
        // setTimeout(() => {
          window.location.reload()
        // }, 1500);

      } catch (error) {
        toast({
          title: "Network error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setResetPassword(false)
      }
    }
  }


  const handleResetPinSubmit = async () => {
    setResetingPin(true)
    try {
      if (!/^\d{4}$/.test(resetPinFormData.pin)) {
        toast({
          title: "Invalid PIN!",
          description: "PIN must be exactly 4 digits number",
          variant: "destructive",
        });
        return;
      }

      if (resetPinFormData.pin !== resetPinFormData.confirmPin) {
        toast({
          title: "Failed!",
          description: "PINs do not match.",
          variant: "destructive",
        });
        return;
      }

      if (resetPinFormData.password !== hashedPassword) {
        toast({
          title: "Failed!",
          description: `Password did not match saved password!.`,
          variant: "destructive"
        });
        return;
      }

      if (resetPinFormData.password === hashedPassword &&
        resetPinFormData.pin === resetPinFormData.confirmPin) {

        const payload = {
          pin: resetPinFormData?.pin
        };

        const res = await fetch(`${server}/users/update/${storedData?.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        try {
          const loginPayload = {
            email: storedData?.email,
            password: hashedPassword
          };

          const loginRes = await fetch(`${server}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginPayload),
          });

          const data = await loginRes.json();

          if (loginRes.ok) {
            // Save token & user data
            if (data.access_token) {
              localStorage.setItem("token", data?.access_token);
            }
            if (data.userData) {
              localStorage.setItem("userData", JSON.stringify(data?.userData));
            }
            if (data.userAccount) {
              localStorage.setItem("userAccount", JSON.stringify(data?.userAccount));
            }
          } else {
            toast({
              title: "Refresh login Failed",
              description: data?.detail || "Invalid credentials",
              variant: "destructive",
            });
          }
          toast({
            title: "Success!",
            description: `Password Reset Successful.`,
            variant: "success"
          });
          setTimeout(() => {
            window.location.reload()
          }, 1500);

        } catch (error) {
          toast({
            title: "Network error",
            description: error.message,
            variant: "destructive",
          });
        }

        toast({
          title: "Success!",
          description: `PIN reset was Successful.`,
          variant: "success"
        });

        setTimeout(() => {
          window.location.reload()
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: error.message,
        variant: "destructive",
      });
    } finally{
      setResetingPin(false)
    }
  }


  if (loading) {
    return (
      <DashboardLayout>
        <Loader message="Loading..." size="h-96" color="blue-500" />
      </DashboardLayout>
    );
  }

  return (
    <>

      <DashboardLayout>
        {deleting && <OverlayLoader message="Deleting account..." color="red-500" />}
        <div className="space-y-2 sm:space-y-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your account settings and preferences</p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="payment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
              {/* <TabsTrigger value="profile" className="text-xs sm:text-sm">
              <User className="h-4 w-4 mr-2 hidden sm:inline" />
              Profile
            </TabsTrigger> */}
              {/* <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              <Bell className="h-4 w-4 mr-2 hidden sm:inline" />
              Notifications
            </TabsTrigger> */}
              {/* <TabsTrigger value="preferences" className="text-xs sm:text-sm">
              <Globe className="h-4 w-4 mr-2 hidden sm:inline" />
              Preferences
            </TabsTrigger> */}
              <TabsTrigger value="payment" className="text-xs sm:text-sm">
                <CreditCard className="h-4 w-4 mr-2 hidden sm:inline" />
                Accounts
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs sm:text-sm">
                <Shield className="h-4 w-4 mr-2 hidden sm:inline" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and authentication methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Lock className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <Switch
                      checked={security.twoFactor}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold mb-4">Reset Password</h4>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input value={formData.currentPassword}
                          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                          id="current-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          id="confirm-password" type="password" />
                      </div>
                      <Button
                        onClick={handleSubmit}
                        disabled={!formData.currentPassword || !formData.confirmPassword || !formData.password}
                      >{resetPassword ? (
                        <>
                          <div className="flex items-center space-x-2">
                            {/* Spinner */}
                            <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                            {/* Text */}
                            <span className="text-sm sm:text-base font-medium text-gray-700 animate-pulse">
                              Updating...
                            </span>
                          </div>

                        </>
                      ) : ("Update Password")}
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="mt-6 space-y-4">
              {/* Accounts Management */}

              <Card>
                <CardHeader>
                  <CardTitle>Bank Accounts</CardTitle>
                  <CardDescription>Manage your linked bank accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  {accounts.map((acc) => (
                    <div key={acc.id} className="space-y-3">
                      {acc.id !== 0 ? (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{acc.name} Account</p>
                            <p className="text-sm text-gray-600">{acc.accountNumber} • ${acc.balance.toLocaleString()}</p>
                          </div>

                          <div className="flex space-x-2">
                            {/* <Button variant="outline" size="sm">Edit</Button> */}
                            <Button variant="destructive" size="sm"
                              onClick={() => handleDelete(acc.id)}
                            > Delete
                            </Button>
                          </div>
                        </div>
                      ) : (<></>)}
                    </div>
                  ))}

                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Reset Transfer PIN</CardTitle>
                </CardHeader>
                <CardContent>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input maxLength={30} onChange={(e) => setResetPinFormData({ ...resetPinFormData, password: e.target.value })}
                        id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">PIN</Label>
                      <Input maxLength={4} onChange={(e) => setResetPinFormData({ ...resetPinFormData, pin: e.target.value })}
                        id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm PIN</Label>
                      <Input maxLength={4} onChange={(e) => setResetPinFormData({ ...resetPinFormData, confirmPin: e.target.value })}
                        id="confirm-password" type="password" />
                    </div>

                    <Button
                      onClick={handleResetPinSubmit}
                      disabled={!resetPinFormData.pin || !resetPinFormData.confirmPin || !resetPinFormData.password}
                    >
                      {resetingPin ? (
                        <>
                          <div className="flex items-center space-x-2">
                            {/* Spinner */}
                            <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                            {/* Text */}
                            <span className="text-sm sm:text-base font-medium text-gray-700 animate-pulse">
                              Reseting...
                            </span>
                          </div>

                        </>
                      ) : ("Reset PIN")}
                      </Button>
                  </div>

                </CardContent>
              </Card>

            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </>
  );
}
