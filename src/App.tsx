import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/AppLayout";
import ErrorBoundary from "./components/ErrorBoundary";

const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Learn = lazy(() => import("./pages/Learn"));
const SkillTest = lazy(() => import("./pages/SkillTest"));
const Interview = lazy(() => import("./pages/Interview"));
const Workspace = lazy(() => import("./pages/Workspace"));
const Oracle = lazy(() => import("./pages/Oracle"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Account = lazy(() => import("./pages/Account"));
const PublicPortfolio = lazy(() => import("./pages/PublicPortfolio"));
const SkillDNA = lazy(() => import("./pages/SkillDNA"));
const Missions = lazy(() => import("./pages/Missions"));
const NotFound = lazy(() => import("./pages/NotFound"));
const DataUse = lazy(() => import("./pages/DataUse"));
const MyData = lazy(() => import("./pages/MyData"));
const PracticeLab = lazy(() => import("./pages/PracticeLab"));
const ProjectInterview = lazy(() => import("./pages/ProjectInterview"));

const queryClient = new QueryClient({defaultOptions:{queries:{retry:1,refetchOnWindowFocus:false}}});
const loading = <div className="max-w-5xl mx-auto p-8" aria-live="polite" role="status">
  <div className="panel p-6 animate-pulse"><div className="h-4 w-24 bg-surface-3 rounded mb-4"/><div className="h-7 w-2/3 bg-surface-3 rounded mb-3"/><div className="h-4 w-full bg-surface-3 rounded"/></div>
  <span className="sr-only">Loading workspace</span>
</div>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={loading}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/skill-test" element={<SkillTest />} />
                <Route path="/interview" element={<Interview />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/oracle" element={<Oracle />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/account" element={<Account />} />
                <Route path="/skill-dna" element={<SkillDNA />} />
                <Route path="/missions" element={<Missions />} />
                <Route path="/data-use" element={<DataUse />} />
                <Route path="/my-data" element={<MyData />} />
                <Route path="/p/:slug" element={<PublicPortfolio />} />
                <Route path="/practice" element={<PracticeLab />} />
                <Route path="/project-interview" element={<ProjectInterview />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
export default App;
