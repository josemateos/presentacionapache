import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Invitation1 from "./pages/Invitation1";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import VocabularyDay1 from "./pages/VocabularyDay1";
import VocabularyDay2 from "./pages/VocabularyDay2";
import VocabularyDay3 from "./pages/VocabularyDay3";
import LearnWord from "./pages/LearnWord";
import PhrasesDay from "./pages/PhrasesDay";
import LearnPhrase from "./pages/LearnPhrase";
import GenerateWordImages from "./pages/GenerateWordImages";
import ReviewWordImages from "./pages/ReviewWordImages";
import AuxiliariesHub from "./pages/AuxiliariesHub";
import ConectoresIng from "./pages/ConectoresIng";
import LearnConnector from "./pages/LearnConnector";
import ReviewDay from "./pages/ReviewDay";
import Invitation2 from "./pages/Invitation2";
import Invitation3 from "./pages/Invitation3";
import NotFound from "./pages/NotFound";
import CatalogoAvatar from "./pages/CatalogoAvatar";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/invitacion-1" element={<Invitation1 />} />
            <Route path="/invitacion-2" element={<Invitation2 />} />
            <Route path="/invitacion-3" element={<Invitation3 />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/bienvenida" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/vocabulario-dia-1" element={<VocabularyDay1 />} />
            <Route path="/vocabulario-dia-2" element={<VocabularyDay2 />} />
            <Route path="/vocabulario-dia-3" element={<VocabularyDay3 />} />
            <Route path="/learn-word" element={<LearnWord />} />
            <Route path="/phrases-day" element={<PhrasesDay />} />
            <Route path="/learn-phrase" element={<LearnPhrase />} />
            <Route path="/generate-word-images" element={<GenerateWordImages />} />
            <Route path="/review-word-images" element={<ReviewWordImages />} />
            <Route path="/auxiliaries" element={<AuxiliariesHub />} />
            <Route path="/auxiliaries/conectores-ing" element={<ConectoresIng />} />
            <Route path="/learn-connector" element={<LearnConnector />} />
            <Route path="/review-day" element={<ReviewDay />} />
            <Route path="/catalogo-avatar" element={<CatalogoAvatar />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
