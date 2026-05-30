import { spawnSync } from "node:child_process";
import { ensureDatabaseUrlEnv } from "./lib/default-env.mjs";

ensureDatabaseUrlEnv("development");

const prisma = spawnSync("npx", ["prisma", "migrate", "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(prisma.status ?? 1);
