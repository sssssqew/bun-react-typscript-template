import { createRoot } from "react-dom/client";
import App from "./app";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Client-side rendering!");
  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
});