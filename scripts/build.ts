import { EOL } from "node:os";
import { $ } from "bun";

const sourceFile = "./src/index.ts";
const targetFile = "./src/index.prod.ts";

const indexFile = Bun.file(sourceFile);

// bun remove useless code for
const content = await indexFile.text();

const fixedContent = content
  .split(EOL)
  .map((item) => {
    if (item.trim().startsWith("//")) {
      return item;
    }
    // remove swagger
    if (item.includes("swagger")) {
      return "";
    }
    return item;
  })
  .filter(Boolean)
  .join(EOL);

await Bun.write(targetFile, fixedContent);

const targetOS = Bun.env.target

if (targetOS === 'linux') {
  await $`bun build --compile --minify-whitespace --minify-syntax --bytecode --target=bun-linux-x64-modern --outfile server ${targetFile}`;
} else {
  // 本地机器
  await $`bun build --compile --minify-whitespace --minify-syntax --bytecode --target bun --outfile server ${targetFile}`;
}
await Bun.file(targetFile).delete();
