import { AppHeader } from "@/components/AppHeader";

interface DashboardHeaderProps {
  onProfileClick?: () => void;
  opacity?: number;
}

export const DashboardHeader = ({}: DashboardHeaderProps) => {
  return <AppHeader />;
};
