import { useAuth } from "../context/AuthContext";
import AppSidebar from "../components/AppSidebar";
import HirerDashboard from "../components/dashboard/HirerDashboard";
import WorkerDashboard from "../components/dashboard/WorkerDashboard";
import BothDashboard from "../components/dashboard/BothDashboard";

export default function HomePage() {
  const { user } = useAuth();

  // Render different dashboard based on user intent
  const renderDashboard = () => {
    if (user?.intent === "hire") {
      return <HirerDashboard />;
    } else if (user?.intent === "find_work") {
      return <WorkerDashboard />;
    } else if (user?.intent === "both") {
      return <BothDashboard />;
    }
    // Fallback to both dashboard if intent is not set
    return <BothDashboard />;
  };

  return (
    <AppSidebar>
      {renderDashboard()}
    </AppSidebar>
  );
}
