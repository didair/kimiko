import { spawnSync } from "node:child_process";
import { ensureDatabaseUrlEnv } from "./lib/default-env.mjs";

ensureDatabaseUrlEnv("development");

const next = spawnSync("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(next.status ?? 1);
