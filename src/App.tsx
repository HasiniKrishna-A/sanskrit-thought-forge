import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import LandingPage from "./pages/LandingPage";
import SandhiLab from "./pages/SandhiLab";
import CompilerPage from "./pages/CompilerPage";
import GalleryPage from "./pages/GalleryPage";
import WisdomPage from "./pages/WisdomPage";
import SanskritHelpPage from "./pages/SanskritHelpPage";
import GuidePage from "./pages/GuidePage";
import PracticePage from "./pages/PracticePage";
import PronunciationPage from "./pages/PronunciationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sandhi" element={<SandhiLab />} />
          <Route path="/compiler" element={<CompilerPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/wisdom" element={<WisdomPage />} />
          <Route path="/help" element={<SanskritHelpPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
