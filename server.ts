import { serve, Server } from "bun";
import { logging } from './middleware/logging'

const id = Math.random().toString(36).slice(2);
console.log('server id: ', id)

serve({
  // hostname: "mydomain.com", // defaults to "0.0.0.0"
  port: process.env['PORT'] || 8080,
  idleTimeout: 255, // 4min. 25sec
  development: true,
  reusePort: true, // Share the same port across multiple processes (only works on linux os)
  routes: {
    "/": (req, server) => {
      logging(req, server)
      return new Response('HOME')
    },
    "/api/risky": () => {
      throw new Error("Something went wrong!");
    },
  },

  // Fallback handler
  async fetch(request: Request, server: Server) {    
    server.timeout(request, 60); // Set 60 second timeout for this request
    await request.text(); // If they take longer than 60 seconds to send the body, the request will be aborted
    return new Response("Not Found", { status: 404 });
  },

  // Global error handler
  error(error) {
    console.error(error);
    return new Response(`<h1>Internal Server Error:</h1> <pre><h2>${error.stack}</h2>\n</pre>`, {
      status: 500,
      headers: {
        "Content-Type": "text/html",
      },
    });
  },
});
