export type Level = "basic" | "medium" | "advanced";

export type ValidationFn = (code: string, output: string[], starterCode: string) => boolean;

export interface Lesson {
  id: number;
  title: string;
  level: Level;
  content: string;
  task: string;
  hint: string;
  starterCode: string;
  validation?: ValidationFn;
}

export function createValidation(task: string): ValidationFn {
  const taskLower = task.toLowerCase();

  if (
    taskLower.startsWith("observe") ||
    taskLower.startsWith("tente") ||
    taskLower.includes("observe como")
  ) {
    return () => true;
  }

  const alterFromMatch = task.match(
    /Altere\s+(?:o\s+)?nome\s+de\s+['"]?([^'"]+)['"]?\s+para\s+outro\s+qualquer/i,
  );
  if (alterFromMatch) {
    const [, oldValue] = alterFromMatch;
    return (code: string, output: string[]) => {
      if (output.some((o) => o.startsWith("❌"))) return false;
      const codeChanged = !code.includes(oldValue);
      const hasOutput = output.length > 0 && !output[0].includes("TypeScript Explorer");
      return codeChanged && hasOutput;
    };
  }

  const alterMatch = task.match(
    /Altere\s+(?:o\s+)?(?:valor\s+de\s+)?`?(\w+)`?\s+para\s+['"]?([^'"]+)['"]?/i,
  );
  if (alterMatch) {
    const [, , newValue] = alterMatch;
    return (code: string, output: string[]) => {
      if (output.some((o) => o.startsWith("❌"))) return false;
      const codeHasNewValue = code.includes(newValue);
      const outputContainsNewValue = output.some((o) => o.includes(newValue));
      return codeHasNewValue && outputContainsNewValue;
    };
  }

  const createValueMatch = task.match(
    /Crie\s+(?:um[ao]?\s+)?(?:variável|função|interface|enum|classe|type)\s+(\w+)/i,
  );
  if (createValueMatch) {
    const [, name] = createValueMatch;
    return (code: string, output: string[]) => {
      if (output.some((o) => o.startsWith("❌"))) return false;
      const hasDefinition =
        code.includes(name) || code.includes(`"${name}"`) || code.includes(`'${name}'`);
      return hasDefinition && output.length > 0;
    };
  }

  const addMatch = task.match(/Adicione\s+(?:uma?\s+)?(?:propriedade|método|valor)\s+(\w+)/i);
  if (addMatch) {
    const [, name] = addMatch;
    return (code: string, output: string[]) => {
      if (output.some((o) => o.startsWith("❌"))) return false;
      const hasAddition = code.includes(name);
      return hasAddition && output.length > 0;
    };
  }

  return (code: string, output: string[], starterCode: string) => {
    if (output.some((o) => o.startsWith("❌"))) return false;
    if (code.trim() === starterCode.trim()) return false;
    return output.length > 0;
  };
}
