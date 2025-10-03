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
import LearnWord from "./pages/LearnWord";
import PhrasesDay from "./pages/PhrasesDay";
import LearnPhrase from "./pages/LearnPhrase";
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
            <Route path="/learn-word" element={<LearnWord />} />
            <Route path="/phrases-day" element={<PhrasesDay />} />
            <Route path="/learn-phrase" element={<LearnPhrase />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
