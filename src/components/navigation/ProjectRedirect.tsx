import { useParams, Navigate } from "react-router-dom";

export function ProjectRedirect() {
  const { projectId } = useParams();
  
  if (!projectId) {
    return <Navigate to="/projects" replace />;
  }
  
  return <Navigate to={`/projects/${projectId}/daily-logs`} replace />;
}