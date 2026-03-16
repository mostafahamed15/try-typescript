import { useState, useCallback, useEffect, lazy, Suspense } from "react";
import confetti from "canvas-confetti";
import {
  Terminal,
  Code2,
  BookOpen,
  Github,
  Play,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lightbulb,
  CheckCircle2,
  List,
} from "lucide-react";

const Editor = lazy(() => import("@monaco-editor/react"));

import { getLessonsByLocale, type Lesson, type Level } from "./data/lessons";
import { getInitialLocale, t, type Locale } from "./i18n";

async function transpileCode(code: string): Promise<string> {
  const ts = await import("typescript");
  const result = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ESNext },
  });
  return result.outputText;
}

async function executeCode(code: string): Promise<string[]> {
  const logs: string[] = [];

  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args: unknown[]) => {
    logs.push(
      args
        .map((a) => {
          if (typeof a === "object" && a !== null) {
            try {
              return JSON.stringify(a);
            } catch {
              return String(a);
            }
          }
          return String(a);
        })
        .join(" "),
    );
  };
  console.error = (...args: unknown[]) => {
    logs.push("❌ " + args.map(String).join(" "));
  };
  console.warn = (...args: unknown[]) => {
    logs.push("⚠️ " + args.map(String).join(" "));
  };

  try {
    const jsCode = await transpileCode(code);
    new Function(jsCode)();
  } catch (err) {
    logs.push(`❌ Erro: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }

  return logs;
}

const levelConfig: Record<Level, { label: string; color: string; dot: string }> = {
  basic: {
    label: "Básico",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  medium: {
    label: "Médio",
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    dot: "bg-yellow-400",
  },
  advanced: {
    label: "Avançado",
    color: "text-red-400 bg-red-400/10 border-red-400/30",
    dot: "bg-red-400",
  },
};

function LevelBadge({ level }: { level: Level }) {
  const cfg = levelConfig[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function LessonListModal({
  currentLesson,
  completedIds,
  onSelect,
  onClose,
  lessons,
  locale,
}: {
  currentLesson: Lesson;
  completedIds: Set<number>;
  onSelect: (lesson: Lesson) => void;
  onClose: () => void;
  lessons: Lesson[];
  locale: Locale;
}) {
  const groups: { level: Level; label: string }[] = [
    { level: "basic", label: locale === "pt-BR" ? "🟢 Básico" : "🟢 Basic" },
    { level: "medium", label: locale === "pt-BR" ? "🟡 Médio" : "🟡 Medium" },
    { level: "advanced", label: locale === "pt-BR" ? "🔴 Avançado" : "🔴 Advanced" },
  ];

  const handleSelect = (lesson: Lesson) => {
    onSelect(lesson);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white">Todas as Lições</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
            ✕ Fechar
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {groups.map(({ level, label }) => (
            <div key={level}>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                {label}
              </p>
              <div className="space-y-1">
                {lessons
                  .filter((l) => l.level === level)
                  .map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelect(lesson)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        lesson.id === currentLesson.id
                          ? "bg-[#3178c6]/20 border border-[#3178c6]/40 text-white"
                          : "hover:bg-slate-700/50 text-slate-300"
                      }`}
                    >
                      <span className="text-xs text-slate-500 w-5 text-right shrink-0">
                        {lesson.id}
                      </span>
                      <span className="flex-1 text-sm">{lesson.title}</span>
                      {completedIds.has(lesson.id) && (
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [isLoading, setIsLoading] = useState(true);

  const allLessons = getLessonsByLocale(locale);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(allLessons[0]);
  const [code, setCode] = useState(allLessons[0].starterCode);
  const [output, setOutput] = useState<string[]>([t("readyToCompile", locale)]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [showLessonList, setShowLessonList] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);

  useEffect(() => {
    const newLessons = getLessonsByLocale(locale);
    const sameLesson = newLessons.find((l) => l.id === currentLesson.id);
    if (sameLesson) {
      setCurrentLesson(sameLesson);
      setCode(sameLesson.starterCode);
    } else {
      setCurrentLesson(newLessons[0]);
      setCode(newLessons[0].starterCode);
    }
    setIsLoading(false);
  }, [locale]);

  const goToLesson = useCallback(
    (lesson: Lesson) => {
      setCurrentLesson(lesson);
      setCode(lesson.starterCode);
      setOutput([t("readyToCompile", locale)]);
      setShowHint(false);
    },
    [locale],
  );

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "prev" && currentIndex > 0) {
      goToLesson(allLessons[currentIndex - 1]);
    } else if (direction === "next" && currentIndex < allLessons.length - 1) {
      goToLesson(allLessons[currentIndex + 1]);
    }
  };

  const celebrateCompletion = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#3178c6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    });
  }, []);

  const handleRunCode = async () => {
    setIsCompiling(true);
    setOutput([]);

    const results = await executeCode(code);
    setOutput(results.length > 0 ? results : [t("codeExecutedNoOutput", locale)]);

    const hasError = results.some((r) => r.startsWith("❌"));
    const taskLower = currentLesson.task.toLowerCase();
    const requiresChange = !taskLower.startsWith("observe") && !taskLower.startsWith("tente") && !taskLower.includes("observe como");
    
    const isValid = (): boolean => {
      if (hasError) return false;
      if (requiresChange && code.trim() === currentLesson.starterCode.trim()) return false;
      if (currentLesson.validation) {
        return currentLesson.validation(code, results);
      }
      return results.length > 0;
    };

    if (isValid() && !completedIds.has(currentLesson.id)) {
      setCompletedIds((prev) => new Set(prev).add(currentLesson.id));
      celebrateCompletion();
    }

    setIsCompiling(false);
  };

  const handleResetCode = () => {
    setCode(currentLesson.starterCode);
    setOutput([t("codeReset", locale)]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f172a]">
        <Loader2 size={32} className="text-[#3178c6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-[#1e293b] border-b border-slate-700 shadow-lg z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowLessonList(!showLessonList)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            title="Todas as lições"
          >
            <List size={24} />
          </button>
          <div className="bg-[#3178c6] p-1.5 rounded-md">
            <Code2 size={24} className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            Try <span className="text-[#3178c6]">{t("tryTypescript", locale)}</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>
              {completedIds.size}/{allLessons.length} {t("allLessons", locale)}
            </span>
            <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3178c6] rounded-full transition-all duration-500"
                style={{ width: `${(completedIds.size / allLessons.length) * 100}%` }}
              />
            </div>
          </div>

          <a
            href="https://github.com/rodrigooler/try-typescript"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
          >
            <Github size={20} />
            <span className="text-sm hidden sm:inline">{t("repo", locale)}</span>
          </a>

          <button
            onClick={() => setLocale(locale === "en" ? "pt-BR" : "en")}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-slate-800"
            title={locale === "en" ? "Switch to Portuguese" : "Switch to English"}
          >
            <span className="font-medium">{locale === "en" ? "🇺🇸" : "🇧🇷"}</span>
            <span className="uppercase text-[10px]">{locale === "en" ? "EN" : "PT"}</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <aside
          className={`w-full md:w-80 lg:w-96 bg-[#0f172a] border-r border-slate-800 flex flex-col z-10 absolute md:relative inset-0 ${showLessonList ? "translate-x-0" : "-translate-x-full md:translate-x-0"} transition-transform duration-300`}
        >
          <div className="p-4 md:p-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-[#3178c6] uppercase tracking-widest text-xs font-bold">
                <BookOpen size={14} />
                <span>{t("interactiveTutorial", locale)}</span>
              </div>
              <button
                onClick={() => setShowLessonList(!showLessonList)}
                className="md:hidden flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs transition-colors"
              >
                <span className="text-lg">✕</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-500 font-mono">
                {String(currentIndex + 1).padStart(2, "0")}/{allLessons.length}
              </span>
              <LevelBadge level={currentLesson.level} />
            </div>

            <h2 className="text-xl font-bold text-white mb-4">{currentLesson.title}</h2>

            <p className="text-slate-400 leading-relaxed mb-6 text-sm">{currentLesson.content}</p>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-4">
              <h3 className="text-xs font-semibold text-slate-300 uppercase mb-2">
                🎯 Sua Missão:
              </h3>
              <p className="text-sm text-slate-200">{currentLesson.task}</p>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setShowHint((v) => !v)}
                className="flex items-center gap-2 text-xs text-yellow-400/70 hover:text-yellow-400 transition-colors"
              >
                <Lightbulb size={13} />
                <span>{showHint ? "Ocultar dica" : "Mostrar dica"}</span>
              </button>
              {showHint && (
                <div className="mt-2 bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3">
                  <code className="text-xs text-yellow-300 font-mono break-all">
                    {currentLesson.hint}
                  </code>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleNavigate("prev")}
                disabled={currentIndex === 0}
                className="flex items-center space-x-1 text-slate-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={20} />
                <span>Anterior</span>
              </button>
              <button
                onClick={() => handleNavigate("next")}
                disabled={currentIndex === allLessons.length - 1}
                className="flex items-center space-x-1 font-medium text-[#3178c6] hover:text-blue-400 disabled:opacity-30 transition-colors"
              >
                <span>Próximo</span>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col bg-[#1e293b]">
          <div className="flex items-center justify-between bg-[#0f172a] px-4 pt-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLessonList(true)}
                className="md:hidden p-2 hover:bg-slate-700 rounded transition-colors"
              >
                <List size={18} />
              </button>
              <div className="px-4 py-2 bg-[#1e293b] rounded-t-lg border-t border-l border-r border-slate-700 text-sm font-medium text-blue-400 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>main.ts</span>
              </div>
            </div>
            <button
              onClick={handleResetCode}
              className="text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-widest mr-2 transition-colors"
            >
              ↺ Reset
            </button>
          </div>

          <div className="flex-1 relative">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full bg-[#1e293b]">
                  <Loader2 size={32} className="text-[#3178c6] animate-spin" />
                </div>
              }
            >
              <Editor
                height="100%"
                defaultLanguage="typescript"
                value={code}
                onChange={(value) => setCode(value || "")}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, Fira Code, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  lineNumbers: "on",
                  renderLineHighlight: "line",
                  cursorBlinking: "smooth",
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </Suspense>

            <button
              onClick={handleRunCode}
              disabled={isCompiling}
              className={`absolute bottom-6 right-6 flex items-center space-x-2 px-6 py-2.5 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 z-20 bg-emerald-500 hover:bg-emerald-600 text-white ${
                isCompiling ? "opacity-60" : ""
              }`}
            >
              {isCompiling ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
              <span className="font-bold uppercase tracking-wider text-xs">
                Compilar & Executar
              </span>
            </button>
          </div>

          <div className="h-1/3 bg-[#0f172a] border-t border-slate-800 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/50 bg-slate-900/30">
              <div className="flex items-center space-x-2 text-slate-500">
                <Terminal size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Console Output
                </span>
              </div>
              <button
                onClick={() => setOutput([])}
                className="text-[10px] text-slate-500 hover:text-slate-300 underline"
              >
                Limpar
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-slate-400 space-y-1">
              {output.map((line, i) => (
                <div
                  key={i}
                  className={`${
                    line.startsWith("❌")
                      ? "text-red-400"
                      : line.startsWith("⚠️")
                        ? "text-yellow-400"
                        : line.startsWith("✅")
                          ? "text-emerald-400"
                          : "text-slate-300"
                  }`}
                >
                  {line}
                </div>
              ))}
              {isCompiling && (
                <div className="text-blue-400 animate-pulse font-bold">Compilando...</div>
              )}
            </div>
          </div>
        </div>

        {showLessonList && (
          <LessonListModal
            currentLesson={currentLesson}
            completedIds={completedIds}
            onSelect={goToLesson}
            onClose={() => setShowLessonList(false)}
            lessons={allLessons}
            locale={locale}
          />
        )}
      </main>

      <footer className="bg-[#0f172a] border-t border-slate-800 px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>TypeScript 5.3 Engine</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/rodrigooler/try-typescript"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white cursor-pointer transition-colors"
          >
            Documentação
          </a>
          <a
            href="https://github.com/rodrigooler/try-typescript/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white cursor-pointer transition-colors"
          >
            Feedback
          </a>
        </div>
      </footer>
    </div>
  );
}
