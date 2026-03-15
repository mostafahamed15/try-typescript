import type { Lesson } from "./types";
import { lessons as lessonsPt } from "./lessons";
import { lessonsEn } from "./lessons-en";

export function getLessonsByLocale(locale: string): Lesson[] {
  if (locale === "en") {
    return lessonsEn;
  }
  return lessonsPt;
}

export const lessons = lessonsPt;

export type { Lesson, Level } from "./types";