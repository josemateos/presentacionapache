import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
