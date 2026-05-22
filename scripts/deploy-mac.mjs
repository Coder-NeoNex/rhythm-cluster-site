import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const sourceDir = join(process.cwd(), "out");
const targetDir = process.env.NAS_DEPLOY_TARGET;
const verifyUrl = "http://192.168.1.240:8080/";
const allowedTargetPattern = /^\/Volumes\/rhythm-cluster-site(?:-\d+)?$/;

if (process.platform !== "darwin") {
  console.error("deploy:mac is intended for macOS. Use npm run deploy on Windows.");
  process.exit(1);
}

if (!targetDir) {
  console.error("NAS_DEPLOY_TARGET is not set.");
  console.error("Mount the NAS in Finder, then run for example:");
  console.error('NAS_DEPLOY_TARGET="/Volumes/YOUR_NAS_SHARE" pnpm deploy:mac');
  process.exit(1);
}

if (!allowedTargetPattern.test(targetDir)) {
  console.error(`Blocked by safety rule: unsupported deploy target: ${targetDir}`);
  console.error("Allowed target format: /Volumes/rhythm-cluster-site or /Volumes/rhythm-cluster-site-<N>");
  process.exit(1);
}

if (!existsSync(targetDir) || !statSync(targetDir).isDirectory()) {
  console.error(`NAS_DEPLOY_TARGET is not a mounted directory: ${targetDir}`);
  process.exit(1);
}

console.log("Building for Codex/macOS...");
const build = spawnSync(process.execPath, ["scripts/codex-build.mjs"], {
  stdio: "inherit",
});

if (build.status !== 0) {
  console.error("Build failed.");
  process.exit(build.status ?? 1);
}

if (!existsSync(sourceDir)) {
  console.error("Build output directory was not found: out");
  process.exit(1);
}

console.log(`Copying ${sourceDir} -> ${targetDir}`);
mkdirSync(targetDir, { recursive: true });

for (const entry of readdirSync(sourceDir)) {
  const from = join(sourceDir, entry);
  const to = join(targetDir, entry);
  cpSync(from, to, {
    recursive: true,
    force: true,
    dereference: true,
    verbatimSymlinks: false,
  });
}

console.log("");
console.log("Deploy complete.");
console.log(verifyUrl);
