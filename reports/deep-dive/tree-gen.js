const fs = require("fs");
const path = require("path");

function generateTree(dir, prefix = "", level = 0, maxLevel = 3) {
  if (level >= maxLevel) return "";

  let result = "";
  try {
    const items = fs
      .readdirSync(dir)
      .filter((item) => !item.startsWith(".git"));
    items.sort();

    items.forEach((item, index) => {
      const isLast = index === items.length - 1;
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);

      const connector = isLast ? "└── " : "├── ";
      result += prefix + connector + item + "\n";

      if (stats.isDirectory() && level < maxLevel - 1) {
        const nextPrefix = prefix + (isLast ? "    " : "│   ");
        result += generateTree(itemPath, nextPrefix, level + 1, maxLevel);
      }
    });
  } catch (err) {
    result += prefix + `[Error reading directory: ${err.message}]\n`;
  }

  return result;
}

const tree = generateTree(".");
console.log(tree);
