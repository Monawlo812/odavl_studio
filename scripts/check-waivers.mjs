// scripts/check-waivers.mjs
import { readFileSync } from "fs";

const text = readFileSync("reports/waivers.md", "utf8");
const rows = text.split("\n").filter(l => l.startsWith("|") && !l.includes("----") && !l.includes("_None_"));

const today = new Date();
let expired = false;

for (const row of rows) {
  const cols = row.split("|").map(c => c.trim());
  const expiry = cols[3]; // Expiry is 3rd col after Path, Reason
  if (expiry && !isNaN(Date.parse(expiry))) {
    if (new Date(expiry) < today) expired = true;
  }
}

if (expired) {
  console.error("❌ Expired waivers found");
  process.exit(1);
} else {
  console.log("✅ No expired waivers");
}
