export type Level = "basic" | "medium" | "advanced";

export type ValidationFn = (code: string, output: string[]) => boolean;

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
