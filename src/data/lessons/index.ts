import type { Lesson } from "./types";
import { lessons as lessonsPt } from "./lessons";
import { lessonsEn } from "./lessons-en";
import { createValidation } from "./types";

export function getLessonsByLocale(locale: string): Lesson[] {
  if (locale === "en") {
    return lessonsEn;
  }
  return lessonsPt;
}

export const lessons = lessonsPt;
export { createValidation };
export type { Lesson, Level, ValidationFn } from "./types";
