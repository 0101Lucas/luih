import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { SchedulePage } from "./pages/projects/SchedulePage";
import DailyLogsPage from "./pages/projects/DailyLogsPage";
import { TodosPage } from "./pages/projects/TodosPage";
import { ChangeOrdersPage } from "./pages/projects/ChangeOrdersPage";
import { SelectionsPage } from "./pages/projects/SelectionsPage";
import { WarrantiesPage } from "./pages/projects/WarrantiesPage";
import { TimeClockPage } from "./pages/projects/TimeClockPage";
import { ClientUpdatesPage } from "./pages/projects/ClientUpdatesPage";
import { ProjectRedirect } from "./components/navigation/ProjectRedirect";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:projectId" element={<ProjectRedirect />} />
            <Route path="projects/:projectId/schedule" element={<SchedulePage />} />
            <Route path="projects/:projectId/daily-logs" element={<DailyLogsPage />} />
            <Route path="projects/:projectId/todos" element={<TodosPage />} />
            <Route path="projects/:projectId/change-orders" element={<ChangeOrdersPage />} />
            <Route path="projects/:projectId/selections" element={<SelectionsPage />} />
            <Route path="projects/:projectId/warranties" element={<WarrantiesPage />} />
            <Route path="projects/:projectId/time-clock" element={<TimeClockPage />} />
            <Route path="projects/:projectId/client-updates" element={<ClientUpdatesPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
