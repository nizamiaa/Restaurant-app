import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LandingPage } from "./components/LandingPage";
import { MenuView } from "./components/MenuView";
import { AdminDashboard } from "./components/AdminDashboard";
import { AdminLogin } from "./components/AdminLogin";
import { Register } from "./components/Register";
import { Feedback } from "./components/Feedback";

const App: React.FC = () => {
  const [view, setView] = useState<"landing" | "customer" | "admin" | "login" | "feedback" | "register">("landing");
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

  const handleRegister = () => {
    setView("login");
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: 8 }}>
        <label>{t('language')}: </label>
        <select
          value={i18n.language}
          onChange={e => i18n.changeLanguage(e.target.value)}
        >
          <option value="az">AZ</option>
          <option value="en">EN</option>
          <option value="ru">RU</option>
        </select>
      </div>
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
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => setView('register')} className="text-blue-600 underline">{t('register')}</button>
          </div>
        </>
      )}
      {view === "register" && <Register onRegister={handleRegister} />}
      {isAdminAuthenticated && (
        <div style={{ position: 'absolute', top: 8, right: 8 }}>
          <button onClick={handleAdminLogout} className="bg-gray-200 px-3 py-1 rounded">{t('logout')}</button>
        </div>
      )}
      {view === "admin" && isAdminAuthenticated && (
        <AdminDashboard onLogout={handleAdminLogout} />
      )}
      {view === "customer" && <MenuView onBack={handleBackToLanding} />}
      {view === "feedback" && <Feedback onBack={handleBackToLanding} />}
    </div>
  );
};

export default App;