"use client";

import { useState, useRef, useEffect } from "react";
import type { CodeBlockQuestion } from "@/data/questions";

interface Props {
  question: CodeBlockQuestion;
  globalIdx: number;
  isAnswered: boolean;
  onAnswered: (gi: number, isCorrect: boolean) => void;
}

export default function CodeBlockCard({
  question,
  globalIdx,
  isAnswered,
  onAnswered,
}: Props) {
  const [inputs, setInputs] = useState<string[]>(
    question.blanks.map(() => "")
  );
  const [results, setResults] = useState<("correct" | "wrong" | null)[]>(
    question.blanks.map(() => null)
  );
  const [checked, setChecked] = useState(false);
  const [showHints, setShowHints] = useState<Set<number>>(new Set());
  const [activeHint, setActiveHint] = useState<number | null>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  // Auto-resize inputs to fit content
  useEffect(() => {
    const els = codeRef.current?.querySelectorAll<HTMLInputElement>("input[data-blank]");
    els?.forEach((el) => {
      el.style.width = `${Math.max(el.value.length + 2, 6)}ch`;
    });
  }, [inputs]);

  const handleInput = (bi: number, val: string) => {
    const next = [...inputs];
    next[bi] = val;
    setInputs(next);
  };

  const handleCheck = () => {
    if (checked) return;
    const newResults = question.blanks.map((blank, i) => {
      const val = inputs[i].trim();
      const correct = blank.answer.some(
        (a) => val === a || val.toLowerCase() === a.toLowerCase()
      );
      return correct ? ("correct" as const) : ("wrong" as const);
    });
    setResults(newResults);
    setChecked(true);
    const correctCount = newResults.filter((r) => r === "correct").length;
    const allCorrect = correctCount === question.blanks.length;
    onAnswered(globalIdx, allCorrect);
  };

  const toggleHint = (bi: number) => {
    setActiveHint((prev) => (prev === bi ? null : bi));
  };

  const correctCount = results.filter((r) => r === "correct").length;
  const totalBlanks = question.blanks.length;

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6">
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
          {question.title}
        </span>
        {checked && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              correctCount === totalBlanks
                ? "bg-emerald-900 text-emerald-300"
                : "bg-amber-900 text-amber-300"
            }`}
          >
            {correctCount}/{totalBlanks} 空正确
          </span>
        )}
      </div>

      {/* Code Block */}
      <div
        ref={codeRef}
        className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-[13px] leading-[1.8] mb-4 overflow-x-auto"
      >
        {question.codeLines.map((line, li) => {
          // Check if this line contains any blank markers {N}
          const blankRegex = /\{(\d+)\}/g;
          const parts: (string | number)[] = [];
          let lastIndex = 0;
          let match: RegExpExecArray | null;

          while ((match = blankRegex.exec(line)) !== null) {
            if (match.index > lastIndex) {
              parts.push(line.slice(lastIndex, match.index));
            }
            parts.push(parseInt(match[1]));
            lastIndex = match.index + match[0].length;
          }
          if (lastIndex < line.length) {
            parts.push(line.slice(lastIndex));
          }

          // Line number
          const lineNum = (
            <span className="inline-block w-8 text-right mr-3 text-slate-600 select-none text-xs">
              {li + 1}
            </span>
          );

          if (parts.length === 1 && typeof parts[0] === "string") {
            // Normal line, no blanks
            return (
              <div key={li} className="whitespace-pre">
                {lineNum}
                <span className="text-slate-300">{parts[0] || "\u00A0"}</span>
              </div>
            );
          }

          // Line with blanks
          return (
            <div key={li} className="whitespace-pre">
              {lineNum}
              {parts.map((part, pi) => {
                if (typeof part === "string") {
                  return (
                    <span key={pi} className="text-slate-300">
                      {part}
                    </span>
                  );
                }
                // part is a blank id
                const bi = question.blanks.findIndex((b) => b.id === part);
                if (bi < 0) return <span key={pi}>{`{${part}}`}</span>;

                const r = results[bi];
                const inputCls = `inline-block px-2 py-0 rounded border text-center font-mono text-[13px] outline-none transition-all ${
                  r === "correct"
                    ? "bg-emerald-950 border-emerald-500 text-emerald-300"
                    : r === "wrong"
                    ? "bg-red-950 border-red-500 text-red-300"
                    : "bg-indigo-950 border-indigo-500 text-indigo-200 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-400"
                }`;

                return (
                  <span key={pi} className="inline-flex items-center gap-1">
                    <span className="text-indigo-400 text-xs">#{part}</span>
                    <input
                      data-blank={bi}
                      value={inputs[bi]}
                      onChange={(e) => handleInput(bi, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCheck();
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const nextBi = (bi + 1) % question.blanks.length;
                          const nextInput = codeRef.current?.querySelector<HTMLInputElement>(
                            `input[data-blank="${nextBi}"]`
                          );
                          nextInput?.focus();
                        }
                      }}
                      disabled={checked}
                      className={inputCls}
                      style={{ minWidth: "6ch", width: `${Math.max(inputs[bi].length + 2, 6)}ch` }}
                      placeholder="?"
                    />
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Per-blank hint toggles */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {question.blanks.map((blank, bi) => (
          <button
            key={bi}
            onClick={() => toggleHint(bi)}
            className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              activeHint === bi
                ? "bg-amber-950/60 border-amber-500 text-amber-300"
                : results[bi] === "correct"
                ? "bg-emerald-950/40 border-emerald-700 text-emerald-400"
                : results[bi] === "wrong"
                ? "bg-red-950/40 border-red-700 text-red-400"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
            }`}
          >
            #{blank.id}
          </button>
        ))}
      </div>

      {/* Active hint */}
      {activeHint !== null && !checked && (
        <div className="mb-3 p-3 rounded-lg bg-amber-950/40 border border-amber-700/50 text-amber-300 text-sm">
          填空 #{question.blanks[activeHint].id} 提示：
          {question.blanks[activeHint].hint}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        {!checked && (
          <button
            onClick={handleCheck}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            全部确认
          </button>
        )}
      </div>

      {/* Per-blank explanations after check */}
      {checked && (
        <div className="mt-4 space-y-2">
          {question.blanks.map((blank, bi) => {
            const r = results[bi];
            const explIdx = blank.id - 1;
            return (
              <div
                key={bi}
                className={`p-3 rounded-lg text-sm leading-relaxed ${
                  r === "correct"
                    ? "bg-emerald-950/40 border border-emerald-800/50 text-emerald-300"
                    : "bg-red-950/40 border border-red-800/50 text-red-300"
                }`}
              >
                <span className="font-medium">
                  #{blank.id}{" "}
                  {r === "correct" ? "✅" : "❌"}
                </span>{" "}
                {r === "wrong" && (
                  <span className="text-red-200">
                    正确答案：<code className="bg-red-900/50 px-1 rounded">{blank.answer[0]}</code>{" "}
                  </span>
                )}
                <span className="text-slate-400">
                  {question.explanations[explIdx]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
