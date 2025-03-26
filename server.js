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

  // routes
  routes: {
    "/": new Response('HOME'),
    // Errors are caught automaticall
    "/api/risky": () => {
      throw new Error("Something went wrong!");
    },
  },

  // Fallback handler
  async fetch(request, server) {
    const url = new URL(request.url); 
    const ip = server.requestIP(request); // Set 60 second timeout for this request

    console.log(`${Bun.color("white", "ansi")} ${new Date()} ${Bun.color("green", "ansi")} ${ip?.address} (${ip?.port}) ${request.method} ${url.pathname} SUCCESS \n`)
    // console.log("Hello from Bun #" + id + "!\n" + `Active requests: ${server.pendingRequests}` + "!\n" + `Your IP is ${ip?.address} (${ip?.family}) (${ip?.port})`)
    log(`${new Date()} ${ip?.address} (${ip?.port}) ${request.method} ${url.pathname} SUCCESS \n`)
    
    
    server.timeout(request, 60);

    // If they take longer than 60 seconds to send the body, the request will be aborted
    await request.text();
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
