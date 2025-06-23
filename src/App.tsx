
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ScanEmail from "./pages/ScanEmail";
import SuspiciousInbox from "./pages/SuspiciousInbox";
import Reports from "./pages/Reports";
import ThreatInsights from "./pages/ThreatInsights";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');
    if (authStatus === 'true' && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogin = (role: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/" replace /> : 
                <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Dashboard userRole={userRole} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/scan" 
              element={
                isAuthenticated ? 
                <ScanEmail userRole={userRole} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/inbox" 
              element={
                isAuthenticated ? 
                <SuspiciousInbox userRole={userRole} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/reports" 
              element={
                isAuthenticated ? 
                <Reports userRole={userRole} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/insights" 
              element={
                isAuthenticated ? 
                <ThreatInsights userRole={userRole} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/settings" 
              element={
                isAuthenticated ? 
                <Settings userRole={userRole} onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
