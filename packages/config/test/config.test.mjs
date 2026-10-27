import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const packageDir = fileURLToPath(new URL("../", import.meta.url));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "notsobad-config-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  const installed = join(root, "node_modules/@notsobad/config");
  mkdirSync(installed, { recursive: true });
  for (const name of ["package.json", "biome.json", "tsconfig.json"]) {
    cpSync(join(packageDir, name), join(installed, name));
  }
  for (const name of ["@types/node", "hono"]) {
    const dest = join(root, "node_modules", name);
    mkdirSync(dirname(dest), { recursive: true });
    symlinkSync(join(packageDir, "node_modules", name), dest, "dir");
  }
  write(root, "biome.json", '{ "extends": ["@notsobad/config/biome"] }\n');
  write(root, "tsconfig.json", '{ "extends": "@notsobad/config/tsconfig.json" }\n');
  return root;
}

function write(root, name, content) {
  const file = join(root, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

function run(root, dependency, binary, args) {
  const dependencyDir = join(packageDir, "node_modules", dependency);
  const manifest = JSON.parse(readFileSync(join(dependencyDir, "package.json"), "utf8"));
  const result = spawnSync(process.execPath, [join(dependencyDir, manifest.bin[binary]), ...args], {
    cwd: root,
    encoding: "utf8",
  });
  assert.ifError(result.error);
  return { ...result, output: result.stdout + result.stderr };
}

test("TypeScript inherits consumer paths, generated bindings, Node types and Hono JSX", (t) => {
  const root = fixture(t);
  write(root, "worker-configuration.d.ts", "interface Env { TOKEN: string }\n");
  write(root, "src/domain/model.ts", 'export const title = "test";\n');
  write(root, "src/presentation/page.tsx", 'import { title } from "@/domain/model";\nexport const page = <p>{title}</p>;\n');
  write(root, "scripts/check.ts", 'import { readFile } from "node:fs/promises";\nexport const load = () => readFile("test");\n');
  write(root, "test/binding.test.ts", 'export const binding: Env = { TOKEN: "test" };\n');
  write(root, "vitest.config.ts", "export default {};\n");

  const compiled = run(root, "typescript", "tsc", ["--noEmit"]);
  assert.equal(compiled.status, 0, compiled.output);
  const resolved = run(root, "typescript", "tsc", ["--showConfig"]);
  assert.equal(resolved.status, 0, resolved.output);
  const config = JSON.parse(resolved.stdout);
  for (const file of ["src/domain/model.ts", "src/presentation/page.tsx", "scripts/check.ts", "test/binding.test.ts", "vitest.config.ts"]) {
    assert.ok(config.files.includes(`./${file}`), resolved.output);
  }

  write(root, "scripts/check.ts", "export const value: string = undefined;\n");
  const invalid = run(root, "typescript", "tsc", ["--noEmit"]);
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.output, /scripts\/check.ts/);
  assert.match(invalid.output, /undefined/);
});

test("Biome checks the consumer layers and preserves generated-file and test exclusions", (t) => {
  const root = fixture(t);
  write(root, "src/domain/model.ts", "export const value = 1;\n");
  write(root, "src/infrastructure/value.ts", "export const value = 1;\n");
  write(root, "src/application/use-case.ts", 'import { value } from "../domain/model";\nexport const useCase = () => value;\n');
  write(root, "src/domain/model.test.ts", 'import { value } from "../infrastructure/value";\nexport const testValue = value;\n');
  write(root, "worker-configuration.d.ts", "invalid {\n");
  write(root, "src/presentation/web/public/assets/styles.css", "invalid {\n");
  const valid = run(root, "@biomejs/biome", "biome", ["check", "."]);
  assert.equal(valid.status, 0, valid.output);

  write(root, "src/domain/model.ts", 'import { value } from "../infrastructure/value";\nexport const domainValue = value;\n');
  write(root, "src/application/use-case.ts", 'import { value } from "@/infrastructure/value";\nexport const useCase = () => value;\n');
  write(root, "src/infrastructure/value.ts", 'import { useCase } from "../application/use-case";\nexport const value = useCase();\n');
  write(root, "src/presentation/page.ts", 'import { value } from "../infrastructure/value";\nexport const pageValue = value;\n');
  const invalid = run(root, "@biomejs/biome", "biome", ["lint", ".", "--reporter=json"]);
  assert.notEqual(invalid.status, 0);
  const report = JSON.parse(invalid.stdout);
  const restricted = report.diagnostics.filter((diagnostic) => diagnostic.category === "lint/style/noRestrictedImports");
  assert.equal(restricted.length, 4, invalid.output);
});

test("Biome enforces standard Tailwind values and the neutral palette in consumer JSX", (t) => {
  const root = fixture(t);
  const file = "src/presentation/page.tsx";
  write(root, file, 'export const page = <div class="text-sm text-neutral-600 bg-muted border-border gap-4 w-80 [&>svg]:size-4 hover:text-neutral-900/80 text-white" />;\n');
  const valid = run(root, "@biomejs/biome", "biome", ["lint", ".", "--reporter=json"]);
  assert.equal(valid.status, 0, valid.output);

  write(root, file, 'export const page = <div style={{ gap: 18 }} class="text-[13px] bg-[#777] w-[320px] gap-[18px] md:text-[14px] text-gray-600 hover:bg-slate-100/80 border-zinc-200 text-stone-600 text-red-800" />;\n');
  const invalid = run(root, "@biomejs/biome", "biome", ["lint", ".", "--reporter=json"]);
  assert.notEqual(invalid.status, 0);
  const report = JSON.parse(invalid.stdout);
  for (const [category, count] of [["lint/nursery/noInlineStyles", 1], ["lint/nursery/noTailwindArbitraryValue", 5], ["lint/nursery/noTailwindRawColors", 5]]) {
    const diagnostics = report.diagnostics.filter((diagnostic) => diagnostic.category === category);
    assert.equal(diagnostics.length, count, invalid.output);
    assert.ok(diagnostics.every((diagnostic) => diagnostic.severity === "error"), invalid.output);
  }
});

test("Biome rejects unformatted consumer JSON and applies its standard array layout", (t) => {
  const root = fixture(t);
  const file = "format.json";
  write(root, file, JSON.stringify({ short: ["a", "b"], long: ["a".repeat(50), "b".repeat(50)] }));
  const invalid = run(root, "@biomejs/biome", "biome", ["format", file]);
  assert.notEqual(invalid.status, 0, invalid.output);
  const written = run(root, "@biomejs/biome", "biome", ["format", "--write", file]);
  assert.equal(written.status, 0, written.output);
  const formatted = readFileSync(join(root, file), "utf8");
  assert.match(formatted, /"short": \["a", "b"\]/);
  assert.match(formatted, /"long": \[\n/);
  const valid = run(root, "@biomejs/biome", "biome", ["format", file]);
  assert.equal(valid.status, 0, valid.output);
  assert.equal(readFileSync(join(root, file), "utf8"), formatted);
});
