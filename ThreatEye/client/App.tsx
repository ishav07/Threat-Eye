import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ThreatEyeDashboard from "./pages/ThreatEyeDashboard";
import LiveFileAnalysis from "./pages/LiveFileAnalysis";
import ThreatIntelligence from "./pages/ThreatIntelligence";
import NetworkMonitoring from "./pages/NetworkMonitoring";
import SystemHealth from "./pages/SystemHealth";
import SecurityReports from "./pages/SecurityReports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ThreatEyeDashboard />} />
          <Route path="/live-analysis" element={<LiveFileAnalysis />} />
          <Route path="/threat-intelligence" element={<ThreatIntelligence />} />
          <Route path="/network-monitoring" element={<NetworkMonitoring />} />
          <Route path="/system-health" element={<SystemHealth />} />
          <Route path="/reports" element={<SecurityReports />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
