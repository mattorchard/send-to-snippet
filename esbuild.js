const esbuild = require("esbuild");
const copyStaticFiles = require("esbuild-copy-static-files");

const isProd = process.env.NODE_ENV === "production";

/** @type {import("esbuild").BuildOptions}*/
const buildOptions = {
  entryPoints: [
    "./src/entries/serviceWorker.ts",
    "./src/entries/snippets.tsx",
    "./src/entries/options.tsx",
    "./src/entries/sandbox.ts",
    "node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js",
    "node_modules/monaco-editor/esm/vs/editor/editor.worker.js",
  ],
  bundle: true,
  minify: isProd,
  sourcemap: isProd,
  logLevel: "info",
  outdir: "./build",
  jsxFactory: "h",
  jsxFragment: "Fragment",
  jsx: "automatic",
  loader: {
    ".ttf": "dataurl",
  },
  plugins: [
    copyStaticFiles({
      src: "./static",
      dest: "./build",
    }),
  ],
};

const onError = (error) => {
  console.error("ESBuild Error", error);
  process.exit(1);
};

if (isProd) {
  console.log(`ESBuild: Creating production build`);
  esbuild.build(buildOptions).catch(onError);
} else {
  console.log(`ESBuild: Starting dev server`);
  esbuild
    .serve({ servedir: "build" }, buildOptions)
    .then(({ port }) =>
      console.log(`Server live at http://localhost:${port}/snippets.html`)
    )
    .catch(onError);
}
