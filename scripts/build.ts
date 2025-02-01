import { EOL } from "node:os";
import { $ } from "bun";

const source = "./src/index.ts";
const target = "./src/index.prod.ts";

const indexFile = Bun.file(source);

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

await Bun.write(target, fixedContent);

await $`bun build --compile --minify-whitespace --minify-syntax --target bun --outfile server ${target}`;

await Bun.file(target).delete();
