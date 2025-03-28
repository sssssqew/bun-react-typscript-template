  import { serve } from "bun";
  import { logging } from './middleware/logging'
  import getHTML from './src/layout'
  // import homepage from './public/index.html'


  const id = Math.random().toString(36).slice(2);
  console.log('server id: ', id)

  async function build (){
    await Bun.build({
      entrypoints: ["./src/frontend.jsx"],
      outdir: "./out",
    });
  }

  build()

  serve({
    // hostname: "mydomain.com", // defaults to "0.0.0.0"
    port: process.env['PORT'] || 8080,
    idleTimeout: 255, // 4min. 25sec
    development: true,
    reusePort: true, // Share the same port across multiple processes (only works on linux os)

    routes: {
      "/":  async (req, server) => {
        logging(req, server)
        return new Response(await getHTML(), {
            headers: { "Content-Type": "text/html" },
          })
        },
    //   // Add these static routes
      "/styles.css": async () => new Response(await Bun.file("./src/styles.css"), {
        headers: { "Content-Type": "text/css" },
      }),
      "/frontend.js": async () => {
        return new Response(await Bun.file("./out/frontend.js"), {
          headers: { 
            "Content-Type": "application/javascript",
          },
        })
      },

    //   "/api/risky": () => {
    //     throw new Error("Something went wrong!");
    //   },
    },

    // Fallback handler
    // async fetch(request, server) {  
      // server.timeout(request, 60); // Set 60 second timeout for this request
      // await request.text(); // If they take longer than 60 seconds to send the body, the request will be aborted
      // if(url.pathname === '/'){
      //   return new Response(await getHTML(), {
      //     headers: { "Content-Type": "text/html" },
      //   });
      // }
    //   return new Response("Not Found", { status: 404 });
    // },

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
