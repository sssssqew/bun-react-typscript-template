  import { serve } from "bun";
  import { logging } from './middleware/logging'
  import getHTML from './src/layout'
  // import homepage from './public/index.html'


  const id = Math.random().toString(36).slice(2);
  console.log('server id: ', id)

  

  serve({
    // hostname: "mydomain.com", // defaults to "0.0.0.0"
    port: process.env['PORT'] || 8080,
    idleTimeout: 255, // 4min. 25sec // when i set this, first loading is not working well
    development: process.env["NODE_ENV"] !== 'production',
    reusePort: true, // Share the same port across multiple processes (only works on linux os)

    routes: {
      "/":  async (req, server) => {
        logging(req, server)
        return new Response(await getHTML(), {
            headers: { "Content-Type": "text/html" },
          })
        },
      // Add these static routes
      "/styles.css": async () => new Response(await Bun.file("./src/styles.css"), {
        headers: { "Content-Type": "text/css" },
      }),

      "/dist/:filename": async (req) => {
        const filename = req.params.filename;
        const filePath = `./dist/${filename}`;
        
        // Check if the requested file is frontend.js
        if (filename === 'frontend.js') {
          return new Response(await Bun.file(filePath), {
            headers: {
              "Content-Type": "application/javascript",
              "Cache-Control": "public, max-age=31536000", // Cache for 1 year
            },
          });
        }
      
        // For other files, you can choose not to set caching or set different caching rules
        return new Response(await Bun.file(filePath), {
          headers: {
            "Content-Type": "application/javascript",
            // Optionally set different caching rules or none
            "Cache-Control": "no-store", // No caching for other files
          },
        });
      },

    //   "/api/risky": () => {
    //     throw new Error("Something went wrong!");
    //   },
    },

    // Fallback handler
    async fetch(request, server) {  
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
