import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import server from "@/server";

export default function SetTransferPinModal({ userHasPin }: { userHasPin: boolean }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    pin: "",
    confirmPin: "",
  });
  const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
  const { toast } = useToast();
  const [resetingPin, setResetingPin] = useState(false)

  useEffect(() => {
    // 🔥 Force modal open if user has no PIN
    if (!userHasPin) {
      setOpen(true);
    }
  }, [userHasPin]);

  const handleSubmit = async () => {
    setResetingPin(true)
    try {
      if (!/^\d{4}$/.test(formData.pin)) {
        toast({
          title: "Invalid PIN!",
          description: "PIN must be exactly 4 digits.",
          variant: "destructive",
        });
        return;
      }

      if (formData.pin !== formData.confirmPin) {
        toast({
          title: "Failed!",
          description: "PINs do not match.",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        pin: formData.pin,
        hasSetPin: true,
      };

      const res = await fetch(`${server}/users/update/${storedData?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Server error updating PIN");

      const updatedUser = { ...storedData, hasSetPin: true };
      localStorage.setItem("userData", JSON.stringify(updatedUser));

      // started login
      try {
        const loginPayload = {
          email: storedData?.email,
          password: storedData?.hashedPassword
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
      // ended login
      toast({
        title: "Success!",
        description: "Transfer PIN set successfully.",
        variant: "success",
      });

      // ✅ After success, close modal
      setTimeout(() => setOpen(false), 1500);
    } catch (error: any) {
      toast({
        title: "Failed!",
        description: `Error setting PIN: ${error.message}`,
        variant: "destructive",
      });
    } finally{
      setResetingPin(false)
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => { }} // ❌ Disable closing manually
      modal // ensures focus trap and disables background click
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()} // ❌ Prevent click outside to close
        onEscapeKeyDown={(e) => e.preventDefault()}   // ❌ Prevent ESC key closing
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Set Transfer PIN</DialogTitle>
          <DialogDescription>
            For your account security, please create a 4-digit transfer PIN to continue.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <Input
              id="pin"
              type="password"
              maxLength={4}
              placeholder="Enter 4-digit PIN"
              value={formData.pin}
              onChange={(e) =>
                setFormData({ ...formData, pin: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPin">Confirm PIN</Label>
            <Input
              id="confirmPin"
              type="password"
              maxLength={4}
              placeholder="Re-enter PIN"
              value={formData.confirmPin}
              onChange={(e) =>
                setFormData({ ...formData, confirmPin: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!formData.pin || !formData.confirmPin}
          >
            {resetingPin ? (
                        <>
                          <div className="flex items-center space-x-2">
                            {/* Spinner */}
                            <span className="inline-block w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin shadow-md"></span>

                            {/* Text */}
                            <span className="text-sm sm:text-base font-medium text-gray-700 animate-pulse">
                              Saving...
                            </span>
                          </div>

                        </>
                      ) : ("Save PIN")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
