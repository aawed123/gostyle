// Zero-dependency build: inlines @imports from src/gostyle.css into dist/
const fs = require("fs"), path = require("path");
const src = path.join(__dirname, "src"), dist = path.join(__dirname, "dist");
const entry = fs.readFileSync(path.join(src, "gostyle.css"), "utf8");
const css = entry.replace(/@import\s+"\.\/(.+?)";\s*/g,
  (_, f) => fs.readFileSync(path.join(src, f), "utf8") + "\n");
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, "gostyle.css"), css);
const min = css.replace(/\/\*(?!!)[\s\S]*?\*\//g, "").replace(/\s+/g, " ")
  .replace(/\s*([{}:;,])\s*/g, "$1").replace(/;}/g, "}").trim();
fs.writeFileSync(path.join(dist, "gostyle.min.css"), min);

// JS: copy, and a light minified version (comments + blank lines removed, newlines kept)
const js = fs.readFileSync(path.join(src, "gostyle.js"), "utf8");
fs.writeFileSync(path.join(dist, "gostyle.js"), js);
const jsMin = js.replace(/\/\*(?!!)[\s\S]*?\*\//g, "").split("\n")
  .map((l) => l.trim()).filter(Boolean).join("\n");
fs.writeFileSync(path.join(dist, "gostyle.min.js"), "/*! goStyle JS v0.1.0 | MIT License */\n" + jsMin + "\n");
console.log("Built dist/gostyle(.min).css and dist/gostyle(.min).js");
