const buildOptions = process.env["NODE_ENV"] === 'production' ? {
  entrypoints: ["./src/frontend.jsx"],
  outdir: "./dist",
  splitting: true,
  env: "inline",  // This is needed to inline environment variables
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true
  },
  sourcemap: "none"
}: {
  entrypoints: ["./src/frontend.jsx"],
  outdir: "./dist",
}

async function build (buildOptions){
  await Bun.build(buildOptions)
}

build(buildOptions)
.then(() => console.log('build success'))
.catch(e => console.log(`build failed ${e}`))