
import server from "@/server";
import { useCallback, useEffect, useState } from "react";

export const useUserData = () => {
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem("userData");
    return stored ? JSON.parse(stored) : null;
  });

  const [userAccount, setUserAccount] = useState(() => {
    const stored = localStorage.getItem("userAccount");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);
  const API_URL = server;

  /** 🔁 Unified refresh function for both user & account data */
  const refreshUserData = useCallback(async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("userData"));

      if (!storedUser?.userData?.id) {
        console.warn("⚠️ No user ID found in localStorage.");
        setLoading(false);
        return;
      }

      // ✅ Fetch user data
      const userRes = await fetch(`${API_URL}/users/get/${storedUser.userData.id}`);
      if (!userRes.ok) throw new Error("Failed to fetch user data");
      const userResponse = await userRes.json();
      setUserData(userResponse);
      localStorage.setItem("userData", JSON.stringify(userResponse));

      // ✅ Fetch account data
      const userId = userResponse?.userData?.id;
      if (userId) {
        const accountRes = await fetch(`${API_URL}/users/account/${userId}`);
        if (!accountRes.ok) throw new Error("Failed to fetch account data");
        const accountResponse = await accountRes.json();

        setUserAccount(accountResponse);
        localStorage.setItem("userAccount", JSON.stringify(accountResponse));
      }

    } catch (err) {
      console.error("❌ Error refreshing user/account data:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  /** ✅ Automatically refresh data on page reload */
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return { 
    userData, 
    setUserData, 
    userAccount, 
    setUserAccount, 
    loading, 
    refreshUserData 
  };
};


