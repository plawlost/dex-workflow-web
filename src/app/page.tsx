import { DashboardLayout } from "./_components/dashboard-layout";
import { TimelineView } from "./_components/timeline-view";

export default function HomePage() {
  return (
    <DashboardLayout>
      <TimelineView />
    </DashboardLayout>
  );
}
