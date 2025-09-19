import { Construction, Calendar, DollarSign, FileText, Clock, MessageSquare, Settings, FolderOpen, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ComingSoonTabProps {
  tabName: string;
}

const getTabIcon = (tabName: string) => {
  switch (tabName.toLowerCase()) {
    case "schedule":
      return Calendar;
    case "change orders":
      return Settings;
    case "selections":
      return FolderOpen;
    case "warranties":
      return Settings;
    case "time clock":
      return Clock;
    case "client updates":
      return MessageSquare;
    case "files":
      return FolderOpen;
    case "messaging":
      return MessageSquare;
    case "financials":
      return DollarSign;
    case "reports":
      return BarChart3;
    default:
      return Construction;
  }
};

const getTabDescription = (tabName: string) => {
  switch (tabName.toLowerCase()) {
    case "schedule":
      return "View and manage project timelines, milestones, and calendar events.";
    case "change orders":
      return "Track and approve project changes, cost adjustments, and scope modifications.";
    case "selections":
      return "Manage material selections, finishes, and client choices throughout the project.";
    case "warranties":
      return "Document and track warranties for materials, work, and equipment.";
    case "time clock":
      return "Track worker hours, attendance, and project time allocation.";
    case "client updates":
      return "Send automated updates and communicate project progress to clients.";
    case "files":
      return "Store and organize project documents, photos, and important files.";
    case "messaging":
      return "Communicate with team members, subcontractors, and clients.";
    case "financials":
      return "Track project costs, budgets, invoicing, and financial performance.";
    case "reports":
      return "Generate detailed reports on project progress, costs, and performance metrics.";
    default:
      return "This feature is currently under development and will be available soon.";
  }
};

const getComingSoonFeatures = (tabName: string) => {
  switch (tabName.toLowerCase()) {
    case "schedule":
      return [
        "Interactive Gantt charts",
        "Calendar integration",
        "Milestone tracking",
        "Resource scheduling",
        "Automated reminders"
      ];
    case "change orders":
      return [
        "Digital approval workflow",
        "Cost impact analysis",
        "Client approval tracking",
        "Automated documentation",
        "Budget integration"
      ];
    case "selections":
      return [
        "Interactive selection sheets",
        "Vendor catalogs",
        "Client approval portal",
        "3D visualization",
        "Cost comparison tools"
      ];
    case "warranties":
      return [
        "Warranty database",
        "Expiration tracking",
        "Automated reminders",
        "Document storage",
        "Claim management"
      ];
    case "time clock":
      return [
        "Mobile time tracking",
        "GPS verification",
        "Payroll integration",
        "Project cost allocation",
        "Attendance reports"
      ];
    case "client updates":
      return [
        "Automated progress emails",
        "Photo sharing",
        "Client portal access",
        "Custom templates",
        "Progress dashboards"
      ];
    case "files":
      return [
        "Cloud storage integration",
        "Version control",
        "File sharing",
        "Advanced search",
        "Access permissions"
      ];
    case "messaging":
      return [
        "Team chat channels",
        "File sharing",
        "Video conferencing",
        "Mobile notifications",
        "Message history"
      ];
    case "financials":
      return [
        "Budget tracking",
        "Invoice generation",
        "Cost forecasting",
        "Profit analysis",
        "Accounting integration"
      ];
    case "reports":
      return [
        "Custom report builder",
        "Real-time analytics",
        "Automated scheduling",
        "Data visualization",
        "Export capabilities"
      ];
    default:
      return [
        "Feature planning in progress",
        "User feedback integration",
        "Best practices research",
        "UI/UX design",
        "Development timeline"
      ];
  }
};

export function ComingSoonTab({ tabName }: ComingSoonTabProps) {
  const Icon = getTabIcon(tabName);
  const description = getTabDescription(tabName);
  const features = getComingSoonFeatures(tabName);

  return (
    <div className="p-6 flex items-center justify-center min-h-[600px]">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {tabName} - Coming Soon
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Planned Features:</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">Stay Updated</h4>
            <p className="text-sm text-muted-foreground mb-4">
              We're working hard to bring you this feature. Want to be notified when it's ready?
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                Request Early Access
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary-hover">
                Get Notified
              </Button>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Have feedback or feature requests? 
              <Button variant="link" className="text-xs p-0 ml-1 h-auto text-primary">
                Let us know
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}