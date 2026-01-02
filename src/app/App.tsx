import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LandingPage from "./components/LandingPage";
import MenuView from "./components/MenuView";
import AdminDashboard from "./components/AdminDashboard";
import { AdminLogin } from "./components/AdminLogin";
import { Feedback } from "./components/Feedback";

const App: React.FC = () => {
  const [view, setView] = useState<"landing" | "customer" | "admin" | "login" | "feedback">("landing");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.pathname === "/admin" || url.searchParams.get("admin") === "true") {
        setView("login");
      } else if (url.searchParams.get("menu") === "true") {
        setView("customer");
      }
    }
  }, []);
  

  const handleAdminLogin = (userData?: any) => {
    setIsAdminAuthenticated(true);
    setUser(userData || null);
    setView("admin");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setUser(null);
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
          onAdminAccess={() => setView("login")}
        />
      )}
      {view === "login" && (
        <>
          <AdminLogin onLogin={handleAdminLogin} />
        </>
      )}
      {isAdminAuthenticated}
      {view === "admin" && isAdminAuthenticated && (
      <AdminDashboard onLogout={handleAdminLogout} role={user?.role || "limited"} />
      )}
      {view === "customer" && <MenuView onBack={handleBackToLanding} />}
      {view === "feedback" && <Feedback onBack={handleBackToLanding} />}
    </div>
  );
};

export default App;