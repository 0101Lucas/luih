import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryProvider } from "./components/providers/QueryProvider";

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <App />
  </QueryProvider>
);
