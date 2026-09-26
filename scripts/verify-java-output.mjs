import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filenames = ["01-beginner.json", "02-foundation.json", "03-advanced.json", "04-internals.json", "05-comprehensive.json"];
const imports = [
  "import java.util.*;", "import java.io.*;", "import java.nio.file.*;",
  "import java.nio.charset.*;", "import java.util.concurrent.*;",
  "import java.util.concurrent.atomic.*;", "import java.util.stream.*;",
].join("\n");

function splitLeadingDeclarations(code) {
  let rest = code.trim();
  const declarations = [];
  while (/^(?:class|interface|record|static)\s/u.test(rest)) {
    const opening = rest.indexOf("{");
    if (opening < 0) throw new Error("声明缺少方法体或类型体");
    let depth = 0;
    let closing = -1;
    for (let index = opening; index < rest.length; index += 1) {
      if (rest[index] === "{") depth += 1;
      if (rest[index] === "}") depth -= 1;
      if (depth === 0) { closing = index; break; }
    }
    if (closing < 0) throw new Error("声明的括号没有闭合");
    let declaration = rest.slice(0, closing + 1);
    if (/^(?:class|interface)\s/u.test(declaration)) declaration = `static ${declaration}`;
    declarations.push(declaration);
    rest = rest.slice(closing + 1).trim();
  }
  return { declarations, body: rest };
}

function normalize(value) {
  return value.replace(/\r\n/g, "\n").trimEnd();
}

const questions = (await Promise.all(filenames.map(async (filename) =>
  JSON.parse(await readFile(path.join(root, "src/data/questions", filename), "utf8"))
))).flat().filter((question) => question.type === "output");
const directory = await mkdtemp(path.join(tmpdir(), "java-step-up-answers-"));

try {
  const sourceFiles = [];
  for (const question of questions) {
    const className = `Q_${question.id.replace(/-/g, "_")}`;
    const { declarations, body } = splitLeadingDeclarations(question.code);
    const source = `${imports}\npublic class ${className} {\n${declarations.join("\n")}\npublic static void main(String[] args) throws Exception {\n${body}\n}\n}\n`;
    const filename = path.join(directory, `${className}.java`);
    await writeFile(filename, source, "utf8");
    sourceFiles.push(filename);
  }

  const compiled = spawnSync("javac", ["--release", "21", "-encoding", "UTF-8", "-d", directory, ...sourceFiles], { encoding: "utf8" });
  if (compiled.error) throw compiled.error;
  if (compiled.status !== 0) throw new Error(`Java 21 代码编译失败：\n${compiled.stderr || compiled.stdout}`);

  const errors = [];
  for (const question of questions) {
    const className = `Q_${question.id.replace(/-/g, "_")}`;
    const run = spawnSync("java", ["-cp", directory, className], { encoding: "utf8", timeout: 5000 });
    if (run.error || run.status !== 0) {
      errors.push(`${question.id}: 运行失败：${run.error?.message ?? run.stderr}`);
    } else if (normalize(run.stdout) !== normalize(question.answer)) {
      errors.push(`${question.id}: 参考答案 ${JSON.stringify(question.answer)}，实际输出 ${JSON.stringify(normalize(run.stdout))}`);
    }
  }
  if (errors.length > 0) throw new Error(`输出题校验失败（${errors.length} 项）：\n${errors.join("\n")}`);
  console.log(`已用 Java 21 编译并运行 ${questions.length} 道输出题，全部与参考答案一致。`);
} finally {
  await rm(directory, { recursive: true, force: true });
}
