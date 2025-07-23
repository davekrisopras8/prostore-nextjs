// eslint.config.js
import { defineConfig } from "eslint-define-config";

export default defineConfig({
  root: true,
  // tell ESLint to never try and lint files under here:
  ignores: ["lib/generated/prisma/**/*", "lib/generated/prisma/**/*.js", "lib/generated/prisma/**/*.ts"],
  rules: {
    // your overrides…
  },
  // your existing parser / env / extends / etc.
});
