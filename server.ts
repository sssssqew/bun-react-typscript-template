import { serve } from "bun";
import { log } from './utils/log'

const id = Math.random().toString(36).slice(2);
console.log('server id: ', id)

serve({
  port: process.env['PORT'] || 8080,
  // hostname: "mydomain.com", // defaults to "0.0.0.0"
  idleTimeout: 255, // 4min. 25sec
  development: true,

  // Share the same port across multiple processes
  // This is the important part!
  reusePort: true,

  async fetch(request: Request, server) {
    const url = new URL(request.url); 
    console.log(`${new Date()} ${Bun.color("green", "ansi")} ${request.method} ${url.pathname} SUCCESS \n`)
    log(`${new Date()} ${request.method} ${url.pathname} SUCCESS \n`)
    
    const ip = server.requestIP(request); // Set 60 second timeout for this request
    server.timeout(request, 60);

    // If they take longer than 60 seconds to send the body, the request will be aborted
    await request.text();
    return new Response("Hello from Bun #" + id + "!\n" + `Active requests: ${server.pendingRequests}` + "!\n" + `Your IP is ${ip?.address} (${ip?.family}) (${ip?.port})`);
  }
});