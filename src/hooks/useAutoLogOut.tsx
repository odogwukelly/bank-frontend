import { useEffect } from "react";

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minute in milliseconds

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("pendingEmail");
  window.location.href = "/login";
};

export const useAutoLogout = () => {
  useEffect(() => {
    let inactivityTimer: ReturnType<typeof setTimeout>;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_LIMIT);
    };

    // Track user activity
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    window.addEventListener("scroll", resetInactivityTimer);
    window.addEventListener("click", resetInactivityTimer);

    // Start the timer
    resetInactivityTimer();

    // Cleanup on unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      window.removeEventListener("scroll", resetInactivityTimer);
      window.removeEventListener("click", resetInactivityTimer);
    };
  }, []);
};
