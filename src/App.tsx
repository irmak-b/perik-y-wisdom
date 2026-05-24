import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import AppRoot from "./pages/AppRoot";
import Home from "./pages/Home";
import CycleTracker from "./pages/CycleTracker";
import WisdomLibrary from "./pages/WisdomLibrary";
import Profile from "./pages/Profile";
import StarScroll from "./pages/StarScroll";
import HealingGrove from "./pages/HealingGrove";
import LifeNest from "./pages/LifeNest";
import BreastCancer from "./pages/BreastCancer";
import CervicalCancer from "./pages/CervicalCancer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/app" element={<AppRoot />}>
              <Route index element={<Home />} />
              <Route path="cycle" element={<CycleTracker />} />
              <Route path="wisdom" element={<WisdomLibrary />} />
              <Route path="grove" element={<HealingGrove />} />
              <Route path="nest" element={<LifeNest />} />
              <Route path="star" element={<StarScroll />} />
              <Route path="star/breast" element={<BreastCancer />} />
              <Route path="star/cervical" element={<CervicalCancer />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
