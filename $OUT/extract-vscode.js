const fs = require("fs");
const content = fs.readFileSync("apps/vscode-ext/src/extension.ts", "utf8");

const ui = {
  buttons: [],
  webviewMessages: [],
  excerpt: content.split("\n").slice(0, 50).join("\n"),
};

// Extract button types
if (content.includes("type:'scan'")) ui.buttons.push("scan");
if (content.includes("type:'heal'")) ui.buttons.push("heal");
if (content.includes("type:'openReports'")) ui.buttons.push("openReports");

// Extract message handlers
const lines = content.split("\n");
lines.forEach((line) => {
  if (line.includes("message.type ===")) {
    const match = line.match(/'([^']+)'/);
    if (match) ui.webviewMessages.push(match[1]);
  }
});

const outputDir = process.argv[2];
fs.writeFileSync(outputDir + "/vscode-ui.json", JSON.stringify(ui, null, 2));
fs.writeFileSync(outputDir + "/vscode-excerpt.txt", ui.excerpt);
