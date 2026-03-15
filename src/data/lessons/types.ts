export type Level = "basic" | "medium" | "advanced";

export interface Lesson {
  id: number;
  title: string;
  level: Level;
  content: string;
  task: string;
  hint: string;
  starterCode: string;
}
