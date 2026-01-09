const handleLogout = () => {
  // Clear stored authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  localStorage.removeItem("pendingEmail");

  // Redirect user to login page
  window.location.href = "/login";
};

export default handleLogout