import { spawnSync } from "node:child_process";
import { ensureDatabaseUrlEnv } from "./lib/default-env.mjs";

const port = process.env.PORT ?? "3000";
ensureDatabaseUrlEnv("production");

const migrate = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (migrate.status !== 0) {
  process.exit(migrate.status ?? 1);
}

const next = spawnSync("npx", ["next", "start", "-p", port], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

process.exit(next.status ?? 1);
