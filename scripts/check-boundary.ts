// core/ may not depend on anything outside core/: not React, not the page,
// not app/.
// Asks Deno for the import graph of every code file, including files that nothing
// reaches. Type-only imports count too.

const CORE = new URL("../core/", import.meta.url);
const CODE_FILE = /\.[cm]?[jt]sx?$/;
const TEST_FILE = /(^|[._])test\.[cm]?[jt]sx?$/;
// Test files alone may also use the assertion library pinned in core/deno.json.
const TEST_LIBRARY =
  /^(jsr:@std\/assert@|https:\/\/jsr\.io\/@std\/(assert|internal)\/)/;

type Resolved = { specifier?: string; error?: string };
type Dependency = { specifier: string; code?: Resolved; type?: Resolved };
type Graph = {
  modules: { specifier: string; error?: string; dependencies?: Dependency[] }[];
};

async function codeFilesIn(dir: URL): Promise<URL[]> {
  const files: URL[] = [];
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isDirectory) {
      files.push(...await codeFilesIn(new URL(`${entry.name}/`, dir)));
    } else if (CODE_FILE.test(entry.name)) {
      files.push(new URL(entry.name, dir));
    }
  }
  return files;
}

function display(specifier: string): string {
  return specifier.startsWith(CORE.href)
    ? "core/" + decodeURI(specifier.slice(CORE.href.length))
    : specifier;
}

async function violationsFrom(file: URL): Promise<string[]> {
  const result = await new Deno.Command("deno", {
    args: ["info", "--json", file.href],
    cwd: CORE,
    stdout: "piped",
    stderr: "piped",
  }).output();
  if (!result.success) {
    const reason = new TextDecoder().decode(result.stderr).trim();
    return [`${display(file.href)} could not be analyzed: ${reason}`];
  }

  const graph: Graph = JSON.parse(new TextDecoder().decode(result.stdout));
  const isTest = TEST_FILE.test(file.pathname);
  const violations: string[] = [];
  for (const module of graph.modules) {
    // Anything outside core/ was reached through a file inside it, so reporting
    // the file inside is enough.
    if (!module.specifier.startsWith(CORE.href)) continue;
    const from = display(module.specifier);
    if (module.error) violations.push(`${from}: ${module.error}`);
    for (const { specifier, code, type } of module.dependencies ?? []) {
      for (const target of [code, type]) {
        if (!target) continue;
        if (target.error) {
          violations.push(
            `${from} imports "${specifier}", which does not resolve`,
          );
        } else if (
          !target.specifier?.startsWith(CORE.href) &&
          !(isTest && TEST_LIBRARY.test(target.specifier ?? ""))
        ) {
          violations.push(`${from} imports "${specifier}"`);
        }
      }
    }
  }
  return violations;
}

const files = await codeFilesIn(CORE);
const found = await Promise.all(files.map(violationsFrom));
const violations = [...new Set(found.flat())].sort();

if (violations.length > 0) {
  console.error("Boundary check failed: core/ must depend only on core/.\n");
  for (const violation of violations) console.error(`  ${violation}`);
  console.error(`
The core is the model: it has to run with no browser, no React, and no app/
folder, which is what lets the tests and \`deno task replay\` drive it. Move
this dependency into app/, and have app/ read what it needs from the core.`);
  Deno.exit(1);
}
console.log(`Boundary check passed: ${files.length} files in core/.`);
