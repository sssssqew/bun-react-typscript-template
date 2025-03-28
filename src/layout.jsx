import { renderToReadableStream } from "react-dom/server";
import App from "./app";

function Layout({ children }) {
  return (
    <html>
      <head>
        <title>My App (SSR)</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <div id="root">{children}</div>
        <script src="/frontend.js"></script>
      </body>
    </html>
  );
}

export default async function getHTML(){
  await Bun.build({
    entrypoints: ['./src/frontend.jsx'],
    outdir: './out',
    development: true,
  })
  const stream = await renderToReadableStream(
    <Layout>
      <App />
    </Layout>,
  );
  console.log("Server-side rendering");
  return stream
}