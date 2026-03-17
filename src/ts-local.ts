import * as ts from "typescript";

export async function transpileCode(code: string): Promise<string> {
  const result = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ESNext },
  });
  return result.outputText;
}
