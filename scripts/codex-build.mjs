import { copyFileSync, mkdirSync, symlinkSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const run = (command, args, options = {}) =>
  spawnSync(command, args, { stdio: "inherit", ...options });

const runNextBuild = (nodePath, extraEnv = {}) => {
  const nextBin = join(process.cwd(), "node_modules/next/dist/bin/next");
  const result = run(nodePath, [nextBin, "build", "--webpack"], {
    env: { ...process.env, ...extraEnv },
  });
  process.exit(result.status ?? 1);
};

if (process.platform !== "darwin") {
  runNextBuild(process.execPath);
}

const tmpRoot = `/private/tmp/rhythm-cluster-build-${process.pid}-${Date.now()}`;
const binDir = join(tmpRoot, "bin");
const nodeCopy = join(tmpRoot, "node");
const nodeLink = join(binDir, "node");

mkdirSync(binDir, { recursive: true });
copyFileSync(process.execPath, nodeCopy);

run("codesign", ["--remove-signature", nodeCopy], { stdio: "ignore" });
const signResult = run("codesign", ["--force", "--sign", "-", nodeCopy]);

if (signResult.status !== 0) {
  process.exit(signResult.status ?? 1);
}

try {
  unlinkSync(nodeLink);
} catch {
  // ignore
}

symlinkSync(nodeCopy, nodeLink);

runNextBuild(nodeCopy, {
  PATH: `${binDir}:${process.env.PATH ?? ""}`,
});
