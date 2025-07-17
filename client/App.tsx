import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryProvider } from "@/lib/query-client";
import { AuthProvider } from "@/hooks/use-auth";
import { Layout } from "@/components/layout/Layout";

// Page imports
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Profile from "./pages/Profile";
import VisitProfile from "./pages/VisitProfile";
import Write from "./pages/Write";
import Edit from "./pages/Edit";
import CrudDemo from "./pages/CrudDemo";
import NotFound from "./pages/NotFound";
import PlaceholderPage from "./pages/PlaceholderPage";

const App = () => (
  <QueryProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<Search />} />
              <Route path="/post/:id" element={<Detail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user/:userId" element={<VisitProfile />} />
              <Route path="/write" element={<Write />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/crud-demo" element={<CrudDemo />} />
              <Route
                path="/settings"
                element={<PlaceholderPage title="Settings" />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
