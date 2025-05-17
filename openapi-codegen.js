// const { generateEndpoints } = require("@rtk-query/codegen-openapi");

// generateEndpoints({
//   // schemaFile: 'https://api.kodkafa.com/doc-json',
//   schemaFile: (process.env.API_URL || "http://[::1]:3366") + "/doc-json",
//   apiFile: "./src/store/base.api.ts",
//   apiImport: "baseApi",
//   outputFile: "./src/store/core.api.ts",
//   exportName: "coreApi",
//   responseSuffix: "",
//   mergeReadWriteOnly: true,
//   hooks: {
//     queries: true,
//     lazyQueries: true,
//     mutations: true,
//   },
//   flattenArg: true,
//   tag: true,
//   filterEndpoints: /note/,
// })require('dotenv').config(); // Load environment variables from .env.local
const { createClient } = require('@hey-api/openapi-ts');

createClient({
  input: {
    // include: 'notes',
    path: (process.env.API_URL || "http://[::1]:3366") + "/doc-json"
  },
  output: 'src/api/client',
  flattenArg: true,
  plugins: ['@hey-api/client-fetch'],
});