import { createRoot } from "react-dom/client";
import App from "./app";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Client-side rendering!");

  // Dynamically import the App component (loading time when refreshing is faster than before)
  const { default: App } = await import("./app");

  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
});