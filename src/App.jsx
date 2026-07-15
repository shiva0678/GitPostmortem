import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import LoadingScreen from "./pages/LoadingScreen";
import Dashboard from "./pages/Dashboard";

function App() {
  const [view, setView] = useState("landing");
  const [repoUrl, setRepoUrl] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAnalyze = useCallback((url) => {
    setRepoUrl(url);
    setAnalysisData(null);
    setErrorMessage("");
    setView("loading");
  }, []);

  const handleLoadingComplete = useCallback((result) => {
    if (result?.error) {
      setAnalysisData(null);
      setErrorMessage(result.error);
      setView("dashboard");
      return;
    }

    setAnalysisData(result?.data ?? null);
    setErrorMessage("");
    setView("dashboard");
  }, []);

  const handleBack = useCallback(() => {
    setView("landing");
    setRepoUrl("");
    setAnalysisData(null);
    setErrorMessage("");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {view === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LandingPage onAnalyze={handleAnalyze} />
        </motion.div>
      )}

      {view === "loading" && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingScreen
            repoUrl={repoUrl}
            onComplete={handleLoadingComplete}
            onBack={handleBack}
          />
        </motion.div>
      )}

      {view === "dashboard" && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard
            repoUrl={repoUrl}
            analysisData={analysisData}
            errorMessage={errorMessage}
            onBack={handleBack}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
