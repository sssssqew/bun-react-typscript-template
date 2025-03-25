import { serve } from "bun";

const id = Math.random().toString(36).slice(2);
console.log('server id: ', id)

serve({
  port: process.env.PORT || 8080,
  // hostname: "mydomain.com", // defaults to "0.0.0.0"
  idleTimeout: 255, // 4min. 25sec
  development: true,

  // Share the same port across multiple processes
  // This is the important part!
  reusePort: true,

  async fetch(request, server) {
    // Set 60 second timeout for this request
    server.timeout(request, 60);

    // If they take longer than 60 seconds to send the body, the request will be aborted
    await request.text();
    return new Response("Hello from Bun #" + id + "!\n");
  }
});