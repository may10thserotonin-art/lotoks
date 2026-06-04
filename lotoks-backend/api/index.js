/**
 * Vercel Serverless Entry Point
 *
 * This imports the already-compiled Express app from dist/ and
 * exports it as a serverless function handler for Vercel.
 *
 * The build step (tsc) compiles src/ → dist/ first, then Vercel
 * uses this file as the serverless function entry.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: app } = require('../dist/index');
module.exports = app;
