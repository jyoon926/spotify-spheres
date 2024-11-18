import { createRoot } from "react-dom/client";
import "./index.scss";
import "./tailwind.css";
import App from "./App.tsx";
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./utils/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
