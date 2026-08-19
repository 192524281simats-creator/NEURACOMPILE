import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CompilerStudio from "@/pages/CompilerStudio";
import CompilerXRay from "@/pages/CompilerXRay";
import ParseTreePage from "@/pages/ParseTree";
import ASTViewerPage from "@/pages/ASTViewer";
import FirstFollowPage from "@/pages/FirstFollow";
import ParserLabPage from "@/pages/ParserLab";
import SemanticAnalyzerPage from "@/pages/SemanticAnalyzer";
import IntermediateCodePage from "@/pages/IntermediateCode";
import OptimizationLabPage from "@/pages/OptimizationLab";
import TargetCodePage from "@/pages/TargetCode";
import ErrorDetective from "@/pages/ErrorDetective";
import PracticePage from "@/pages/Practice";
import QuizPage from "@/pages/Quiz";
import VivaPage from "@/pages/Viva";
import LabManualPage from "@/pages/LabManual";
import ProgressPage from "@/pages/Progress";
import SettingsPage from "@/pages/Settings";
import LearnPage from "@/pages/Learn";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <p className="text-6xl font-bold text-muted-foreground/20 mb-4">404</p>
      <p className="text-xl font-semibold text-foreground mb-2">Page not found</p>
      <p className="text-muted-foreground mb-6">The page you are looking for does not exist.</p>
      <a href="/dashboard" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
        Go to Dashboard
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/studio" element={<CompilerStudio />} />
          <Route path="/xray" element={<CompilerXRay />} />
          <Route path="/parse-tree" element={<ParseTreePage />} />
          <Route path="/ast" element={<ASTViewerPage />} />
          <Route path="/first-follow" element={<FirstFollowPage />} />
          <Route path="/parser-lab" element={<ParserLabPage />} />
          <Route path="/semantic" element={<SemanticAnalyzerPage />} />
          <Route path="/intermediate" element={<IntermediateCodePage />} />
          <Route path="/optimization" element={<OptimizationLabPage />} />
          <Route path="/target-code" element={<TargetCodePage />} />
          <Route path="/error-detective" element={<ErrorDetective />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/viva" element={<VivaPage />} />
          <Route path="/lab-manual" element={<LabManualPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
