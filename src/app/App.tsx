import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { MenuView } from "./components/MenuView";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminLogin } from "./components/AdminLogin";
import { Feedback } from "./components/Feedback";

export default function App() {
  const [view, setView] = useState<"landing" | "customer" | "admin" | "login" | "feedback">("landing");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check URL for admin access, direct menu access, or admin path
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.pathname === "/admin" || url.searchParams.get("admin") === "true") {
        setView("login");
      } else if (url.searchParams.get("menu") === "true") {
        setView("customer");
      }
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setView("admin");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setView("landing");
  };

  const handleViewMenu = () => {
    setView("customer");
  };

  const handleViewFeedback = () => {
    setView("feedback");
  };

  const handleBackToLanding = () => {
    setView("landing");
  };

  return (
    <div className="size-full">
      {view === "landing" && (
        <LandingPage 
          onViewMenu={handleViewMenu}
          onViewFeedback={handleViewFeedback}
        />
      )}
      {view === "login" && <AdminLogin onLogin={handleAdminLogin} />}
      {view === "admin" && isAdminAuthenticated && (
        <AdminDashboard onLogout={handleAdminLogout} />
      )}
      {view === "customer" && <MenuView onBack={handleBackToLanding} />}
      {view === "feedback" && <Feedback onBack={handleBackToLanding} />}
    </div>
  );
}