import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "dist/index.js", format: "cjs", exports: "named" },
      { file: "dist/index.esm.js", format: "esm" },
    ],
    external: ["react", "react-dom"],
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist",
      }),
    ],
  },
];
