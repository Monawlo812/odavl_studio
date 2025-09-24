// scripts/attest.mjs
import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";
import crypto from "crypto";

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

const commit = execSync("git rev-parse HEAD").toString().trim();
const pkg = readFileSync("package.json");
const pkgHash = sha256(pkg);

const attestation = {
  commit,
  timestamp: new Date().toISOString(),
  packageJsonHash: pkgHash,
};

writeFileSync("reports/attestation.json", JSON.stringify(attestation, null, 2));
console.log("Attestation written:", attestation);
