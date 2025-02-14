import { appendFile } from "node:fs/promises";
import { $ } from "bun";
import schema from "../../schema.json" with { type: "json" };
import { buildControllerFile } from "./controller-file";
import { buildServiceFile } from "./service-file";

const [moduleName, removeTailCount = 1] = Bun.argv.slice(2);

const fixedRemoveTailCount = -Number(removeTailCount) || 9999;

if (!moduleName) {
  throw new Error("moduleName must exist");
}

if (moduleName.startsWith("user")) {
  throw new Error("User module cannot be generated");
}

const currentSchema = (schema as any)[moduleName];

if (!currentSchema) {
  throw new Error("currentSchema must exist");
}



const typeName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1, fixedRemoveTailCount);

Bun.write(
  `src/services/${moduleName.slice(0, fixedRemoveTailCount)}.ts`,
  buildServiceFile(moduleName, typeName, currentSchema),
);

const addText = `${typeName}Service`;


const indexServiceFile = Bun.file("src/services/index.ts")
const indexServiceFileStr = await indexServiceFile.text()
if (!indexServiceFileStr.includes(addText)) {
    await appendFile(
        "src/services/index.ts",
        `export { ${typeName}Service } from './${moduleName}'`,
      );
}

Bun.write(
  `src/controllers/${moduleName.slice(0, fixedRemoveTailCount)}.ts`,
  buildControllerFile(moduleName, typeName, currentSchema),
);

await $`bun format`;
