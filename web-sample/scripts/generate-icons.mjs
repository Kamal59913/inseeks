import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const configPath = resolve(root, "icons.config.json");
const config = JSON.parse(readFileSync(configPath, "utf-8"));

const svgrFlags =
  "--icon --typescript --memo --no-dimensions --out-dir components/icons";

for (const name of config.convert) {
  const svgFile = `assets/icons/${name}.svg`;
  const fullPath = resolve(root, svgFile);

  if (!existsSync(fullPath)) {
    console.warn(`⚠️  Skipping "${name}" — file not found: ${svgFile}`);
    continue;
  }

  console.log(`✅  Converting: ${svgFile}`);
  execSync(`npx @svgr/cli ${svgrFlags} ${svgFile}`, {
    cwd: root,
    stdio: "inherit",
  });
}

console.log("\n🎉 Done! Only listed icons were (re)generated.");
